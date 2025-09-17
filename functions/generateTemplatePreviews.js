const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');

// Paths
const TEMPLATES_DIR = path.join(__dirname, 'templates');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'template-previews');
const COMMON_HTML_PATH = path.join(TEMPLATES_DIR, 'common.html');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`Created output directory: ${OUTPUT_DIR}`);
}

// Register Handlebars helpers
handlebars.registerHelper('formatCurrency', (amount, options) => {
  const currency = options.hash.currency || 'USD';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount || 0);
});

handlebars.registerHelper('formatDate', (date, options) => {
  const dateObj = new Date(date);
  const timezone = options.hash.timezone || 'America/New_York';
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: timezone
  });
});

handlebars.registerHelper('formatDateShort', (date) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
});

handlebars.registerHelper('eq', (a, b) => a === b);

handlebars.registerHelper('formatInvoiceNumber', (number, prefix) => {
  prefix = prefix || 'INV';
  const paddedNumber = String(number).padStart(5, '0');
  return `${prefix}-${paddedNumber}`;
});

// Sample data for preview
const sampleData = {
  invoice: {
    invoiceNumber: 1001,
    date: Date.now(),
    dueDate: Date.now() + (15 * 24 * 60 * 60 * 1000), // 15 days
    lineItems: [
      {
        description: 'Professional Web Development Services',
        quantity: 40,
        rate: 150,
        amount: 6000
      },
      {
        description: 'UI/UX Design and Brand Identity',
        quantity: 25,
        rate: 125,
        amount: 3125
      },
      {
        description: 'Project Management & Consultation',
        quantity: 15,
        rate: 100,
        amount: 1500
      },
      {
        description: 'Quality Assurance and Testing',
        quantity: 20,
        rate: 90,
        amount: 1800
      }
    ],
    subtotal: 12425,
    taxRate: 10,
    taxAmount: 1242.50,
    total: 13667.50,
    notes: 'Thank you for choosing our services! We appreciate your business and look forward to continuing our partnership.\n\nPayment accepted via wire transfer, ACH, or credit card.',
    paymentTerms: 'Net 30 - Payment due within 30 days',
    status: 'pending',
    currency: 'USD',
    formattedInvoiceNumber: 'INV-01001'
  },
  userData: {
    company: 'YOUR COMPANY NAME',
    displayName: 'John Smith',
    email: 'info@yourcompany.com',
    phone: '+1 (555) 123-4567',
    address: {
      street: '123 Business Street, Suite 500',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'United States'
    },
    invoiceSettings: {
      prefix: 'INV',
      currency: 'USD',
      timezone: 'America/Los_Angeles'
    }
  },
  customer: {
    name: 'ABC Corporation',
    company: 'ABC Corporation Ltd.',
    email: 'accounts@abccorp.com',
    phone: '+1 (555) 987-6543',
    address: {
      street: '456 Enterprise Blvd',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    }
  },
  profileData: null,
  timezone: 'America/Los_Angeles',
  invoicePrefix: 'INV',
  currentDate: Date.now()
};

// Auto-discover template files
function discoverTemplates() {
  const templates = [];
  const files = fs.readdirSync(TEMPLATES_DIR);
  
  for (const file of files) {
    if (file.endsWith('.html') && file !== 'common.html') {
      const templateId = file.replace('.html', '');
      templates.push({
        id: templateId,
        filename: file,
        path: path.join(TEMPLATES_DIR, file)
      });
    }
  }
  
  console.log(`Found ${templates.length} templates:`, templates.map(t => t.id));
  return templates;
}

// Load and process template
async function prepareTemplateHtml(templatePath, templateId) {
  // Read template
  let templateHtml = fs.readFileSync(templatePath, 'utf-8');
  
  // Read and inject common styles if available
  if (fs.existsSync(COMMON_HTML_PATH)) {
    const commonHtml = fs.readFileSync(COMMON_HTML_PATH, 'utf-8');
    
    // Extract common styles
    const styleMatch = commonHtml.match(/<style[^>]*id="common-styles"[^>]*>([\s\S]*?)<\/style>/);
    if (styleMatch) {
      const commonStyles = styleMatch[0];
      // Inject before </head>
      templateHtml = templateHtml.replace('</head>', `${commonStyles}\n</head>`);
    }
    
    // Extract running header
    const headerMatch = commonHtml.match(/<!-- RUNNING_HEADER_START -->([\s\S]*?)<!-- RUNNING_HEADER_END -->/);
    if (headerMatch) {
      const runningHeader = headerMatch[1];
      // Compile running header
      const headerTemplate = handlebars.compile(runningHeader);
      const compiledHeader = headerTemplate(sampleData);
      // Inject after <body>
      templateHtml = templateHtml.replace('<body>', `<body>\n${compiledHeader}`);
    }
  }
  
  // Update sample data with current template ID
  const templateData = {
    ...sampleData,
    invoice: {
      ...sampleData.invoice,
      templateId: templateId
    }
  };
  
  // Compile and render template
  const template = handlebars.compile(templateHtml);
  const html = template(templateData);
  
  return html;
}

// Generate preview image using Puppeteer at full resolution
async function generatePreviewImage(html, outputPath) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set viewport to A4 size at 96 DPI for full resolution
    const a4Width = 794;
    const a4Height = 1123;
    
    await page.setViewport({
      width: a4Width,
      height: a4Height,
      deviceScaleFactor: 2 // High quality
    });
    
    // Set content
    await page.setContent(html, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    // Add CSS to ensure proper rendering
    await page.addStyleTag({
      content: `
        /* Reset everything */
        *, *::before, *::after {
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
        }
        
        /* Set html and body */
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          width: ${a4Width}px !important;
          background: white !important;
        }
        
        /* Set invoice container to full width */
        .invoice-container {
          margin: 0 !important;
          padding: 40px !important;
          width: ${a4Width}px !important;
          background: white !important;
          box-sizing: border-box !important;
        }
        
        /* Hide elements we don't want in previews */
        .running-header {
          display: none !important;
        }
      `
    });
    
    // Wait a bit for styles to apply
    await page.evaluate(() => new Promise(r => setTimeout(r, 200)));
    
    // Take full page screenshot at original resolution
    await page.screenshot({
      path: outputPath,
      type: 'png',
      fullPage: true
    });
    
    console.log(`  ✓ Screenshot saved: ${outputPath} (full resolution)`);
  } finally {
    await browser.close();
  }
}

// Main function
async function generateAllPreviews() {
  console.log('====================================================');
  console.log('Automated Invoice Template Preview Generator');
  console.log('====================================================');
  console.log(`Templates directory: ${TEMPLATES_DIR}`);
  console.log(`Output directory: ${OUTPUT_DIR}\n`);
  
  // Discover templates
  const templates = discoverTemplates();
  
  if (templates.length === 0) {
    console.error('No templates found!');
    return;
  }
  
  let successCount = 0;
  let failCount = 0;
  
  // Process each template
  for (const template of templates) {
    console.log(`\nProcessing: ${template.id}`);
    
    try {
      // Prepare HTML
      console.log('  - Preparing HTML...');
      const html = await prepareTemplateHtml(template.path, template.id);
      
      // Generate preview image at full resolution
      console.log('  - Generating preview image (full resolution)...');
      const previewPath = path.join(OUTPUT_DIR, `${template.id}-preview.png`);
      await generatePreviewImage(html, previewPath);
      
      // Generate full image (same as preview for full resolution)
      console.log('  - Generating full image (full resolution)...');
      const fullPath = path.join(OUTPUT_DIR, `${template.id}-full.png`);
      await generatePreviewImage(html, fullPath);
      
      successCount++;
    } catch (error) {
      console.error(`  ✗ Error: ${error.message}`);
      failCount++;
    }
  }
  
  console.log('\n====================================================');
  console.log('Generation Complete!');
  console.log(`✓ Success: ${successCount} templates`);
  console.log(`✗ Failed: ${failCount} templates`);
  console.log(`\nPreview images saved to: ${OUTPUT_DIR}`);
  console.log('====================================================');
}

// Check if Puppeteer is installed
function checkDependencies() {
  try {
    require.resolve('puppeteer');
    console.log('✓ Puppeteer is installed');
    return true;
  } catch (e) {
    console.error('✗ Puppeteer is not installed!');
    console.error('\nTo install Puppeteer, run:');
    console.error('  cd functions');
    console.error('  npm install puppeteer');
    console.error('\nNote: Puppeteer will download Chromium (~200MB)');
    return false;
  }
}

// Run the script
if (require.main === module) {
  console.log('\n🚀 Starting Automated Template Preview Generation\n');
  
  if (checkDependencies()) {
    console.log('\nGenerating previews...\n');
    generateAllPreviews().catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
  } else {
    console.log('\nPlease install dependencies first.');
    process.exit(1);
  }
}

module.exports = { generateAllPreviews, discoverTemplates };

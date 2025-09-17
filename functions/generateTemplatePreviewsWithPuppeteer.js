const fs = require('fs');
const path = require('path');
const pdfService = require('./services/pdfService');
const puppeteer = require('puppeteer');
const sharp = require('sharp');

// Paths
const TEMPLATES_DIR = path.join(__dirname, 'templates');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'template-previews');
const TEMP_DIR = path.join(__dirname, 'temp');

// Ensure directories exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`Created output directory: ${OUTPUT_DIR}`);
}
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Sample data for preview (matching what pdfService expects)
const sampleData = {
  invoice: {
    invoiceNumber: 1001,
    templateId: '', // Will be set dynamically
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
  profileData: null
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

// Generate PDF and convert to PNG using Puppeteer
async function generatePreviewWithPuppeteer(templateId, browser) {
  try {
    // Prepare data with the current template ID
    const data = {
      ...sampleData,
      invoice: {
        ...sampleData.invoice,
        templateId: templateId
      }
    };
    
    // Generate PDF using the existing service
    console.log(`  - Generating PDF for ${templateId}...`);
    const pdfDataUrl = await pdfService.generatePdfPreview(data);
    
    // Extract base64 data from data URL
    const base64Data = pdfDataUrl.split(',')[1];
    const pdfBuffer = Buffer.from(base64Data, 'base64');
    
    // Save PDF temporarily
    const tempPdfPath = path.join(TEMP_DIR, `${templateId}.pdf`);
    fs.writeFileSync(tempPdfPath, pdfBuffer);
    
    // Open PDF in Puppeteer and take screenshots
    console.log(`  - Converting to images with Puppeteer...`);
    const page = await browser.newPage();
    
    // Navigate to the PDF file
    await page.goto(`file:///${tempPdfPath.replace(/\\/g, '/')}`, {
      waitUntil: 'networkidle0'
    });
    
    // Set viewport for full size (A4 at 96 DPI)
    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 2
    });
    
    // Wait a bit for PDF to render
    await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));
    
    // Take full page screenshot
    const screenshotBuffer = await page.screenshot({
      fullPage: true,
      type: 'png'
    });
    
    // Get metadata
    const metadata = await sharp(screenshotBuffer).metadata();
    console.log(`  - Original dimensions: ${metadata.width}x${metadata.height}`);
    
    // Create full size image (800x1000)
    const fullPath = path.join(OUTPUT_DIR, `${templateId}-full.png`);
    await sharp(screenshotBuffer)
      .resize(800, 1000, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255 }
      })
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .toFile(fullPath);
    
    // Create preview size (400x500)
    const previewPath = path.join(OUTPUT_DIR, `${templateId}-preview.png`);
    await sharp(screenshotBuffer)
      .resize(400, 500, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255 }
      })
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .toFile(previewPath);
    
    console.log(`  ✓ Created preview: ${previewPath} (400x500)`);
    console.log(`  ✓ Created full: ${fullPath} (800x1000)`);
    
    // Clean up
    await page.close();
    fs.unlinkSync(tempPdfPath);
    
    return { success: true };
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Main function
async function generateAllPreviews() {
  console.log('====================================================');
  console.log('Puppeteer-Based Invoice Template Preview Generator');
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
  
  // Launch Puppeteer once
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    // Process each template
    for (const template of templates) {
      console.log(`\nProcessing: ${template.id}`);
      
      const result = await generatePreviewWithPuppeteer(template.id, browser);
      if (result.success) {
        successCount++;
      } else {
        failCount++;
      }
    }
  } finally {
    await browser.close();
  }
  
  // Clean up temp directory
  try {
    fs.rmdirSync(TEMP_DIR);
  } catch (e) {
    // Ignore errors
  }
  
  console.log('\n====================================================');
  console.log('Generation Complete!');
  console.log(`✓ Success: ${successCount} templates`);
  console.log(`✗ Failed: ${failCount} templates`);
  console.log(`\nPreview images saved to: ${OUTPUT_DIR}`);
  console.log('====================================================');
}

// Run the script
if (require.main === module) {
  console.log('\n🚀 Starting Puppeteer-Based Template Preview Generation\n');
  
  console.log('This approach renders PDFs in Chromium for perfect text rendering.\n');
  
  generateAllPreviews().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { generateAllPreviews, discoverTemplates };

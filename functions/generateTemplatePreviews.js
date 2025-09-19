const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const pdfService = require('./services/pdfService');

// Paths
const TEMPLATES_DIR = path.join(__dirname, 'templates');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'template-previews');

// Ensure output directory exists
if (!fsSync.existsSync(OUTPUT_DIR)) {
  fsSync.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`Created output directory: ${OUTPUT_DIR}`);
}

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
  const files = fsSync.readdirSync(TEMPLATES_DIR);
  
  for (const file of files) {
    if (file.endsWith('.html') && file !== 'common.html') {
      const templateId = file.replace('.html', '');
      templates.push({
        id: templateId,
        filename: file
      });
    }
  }
  
  console.log(`Found ${templates.length} templates:`, templates.map(t => t.id));
  return templates;
}

// Generate PDF using pdfService
async function generatePdfForTemplate(templateId) {
  // Update sample data with current template ID
  const templateData = {
    ...sampleData,
    invoice: {
      ...sampleData.invoice,
      templateId: templateId
    }
  };
  
  // Generate PDF using pdfService
  const pdfBase64 = await pdfService.generateInvoicePDF(templateData);
  
  // Convert base64 to buffer
  const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
  const pdfBuffer = Buffer.from(base64Data, 'base64');
  
  return pdfBuffer;
}

// Convert PDF to PNG using Puppeteer
async function convertPdfToPng(pdfBuffer, outputPath) {
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
    
    // Convert PDF buffer to base64 data URL
    const pdfBase64 = pdfBuffer.toString('base64');
    const pdfDataUrl = `data:application/pdf;base64,${pdfBase64}`;
    
    // Create HTML with embedded PDF viewer
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { margin: 0; padding: 0; }
          iframe { border: none; }
        </style>
      </head>
      <body>
        <canvas id="pdfCanvas"></canvas>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
        <script>
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          
          // Convert base64 to Uint8Array
          const pdfData = atob('${pdfBase64}');
          const pdfArray = new Uint8Array(pdfData.length);
          for (let i = 0; i < pdfData.length; i++) {
            pdfArray[i] = pdfData.charCodeAt(i);
          }
          
          // Load PDF
          pdfjsLib.getDocument({ data: pdfArray }).promise.then(function(pdf) {
            pdf.getPage(1).then(function(page) {
              const scale = 2; // High quality
              const viewport = page.getViewport({ scale: scale });
              
              const canvas = document.getElementById('pdfCanvas');
              const context = canvas.getContext('2d');
              canvas.height = viewport.height;
              canvas.width = viewport.width;
              
              const renderContext = {
                canvasContext: context,
                viewport: viewport
              };
              page.render(renderContext).promise.then(function() {
                console.log('PDF rendered');
              });
            });
          });
        </script>
      </body>
      </html>
    `;
    
    // Set content and wait for PDF to render
    await page.setContent(html, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    // Wait for PDF to render
    await page.waitForFunction(() => {
      const canvas = document.getElementById('pdfCanvas');
      return canvas && canvas.width > 0 && canvas.height > 0;
    }, { timeout: 30000 });
    
    // Take screenshot of the canvas
    const canvas = await page.$('#pdfCanvas');
    await canvas.screenshot({
      path: outputPath,
      type: 'png'
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
      // Generate PDF using pdfService
      console.log('  - Generating PDF using pdfService...');
      const pdfBuffer = await generatePdfForTemplate(template.id);
      
      // Convert PDF to PNG preview image at full resolution
      console.log('  - Converting PDF to preview image (full resolution)...');
      const previewPath = path.join(OUTPUT_DIR, `${template.id}-preview.png`);
      await convertPdfToPng(pdfBuffer, previewPath);
      
      // Copy preview as full image (same resolution)
      console.log('  - Creating full image copy...');
      const fullPath = path.join(OUTPUT_DIR, `${template.id}-full.png`);
      await fs.copyFile(previewPath, fullPath);
      
      successCount++;
    } catch (error) {
      console.error(`  ✗ Error: ${error.message}`);
      console.error(`     Stack: ${error.stack}`);
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

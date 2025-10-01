import React from 'react';

const PublicInvoiceSEO = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Free Invoice Generator - FlowDesk",
    "description": "Create professional invoices instantly with our free online invoice generator. No signup required. Download PDF invoices with 17+ beautiful templates.",
    "url": "https://flowdesk.tech/try-now",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "17+ Professional Invoice Templates",
      "PDF Download",
      "No Registration Required",
      "Multi-Currency Support",
      "Customizable Invoice Fields",
      "Free Forever"
    ],
    "screenshot": "https://flowdesk.tech/og-invoice-generator.png",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250"
    }
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is the invoice generator really free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Our invoice generator is 100% free to use. No hidden fees, no credit card required. You can create and download unlimited invoices without signing up."
        }
      },
      {
        "@type": "Question",
        "name": "What invoice templates are available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer 17+ professionally designed invoice templates including Modern, Minimalist, Corporate, Creative, and more. All templates are customizable and free to use."
        }
      },
      {
        "@type": "Question",
        "name": "Can I save my invoices without signing up?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can download your invoices as PDFs without signing up. To save invoices online and access them later, you'll need to create a free account."
        }
      },
      {
        "@type": "Question",
        "name": "What file format are invoices downloaded in?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "All invoices are downloaded as PDF files, which can be opened on any device and are perfect for sending to clients or printing."
        }
      }
    ]
  };

  return (
    <>
      <head>
        {/* Primary Meta Tags */}
        <title>Free Invoice Generator - Create Professional Invoices Online | FlowDesk</title>
        <meta name="title" content="Free Invoice Generator - Create Professional Invoices Online | FlowDesk" />
        <meta name="description" content="Generate professional invoices in seconds with our free online invoice maker. No signup required. Choose from 17+ beautiful templates and download PDF instantly." />
        <meta name="keywords" content="free invoice generator, online invoice maker, invoice creator, PDF invoice, invoice templates, free invoice software, create invoice online, invoice generator no signup" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://flowdesk.tech/try-now" />
        <meta property="og:title" content="Free Invoice Generator - Create Professional Invoices Online" />
        <meta property="og:description" content="Generate professional invoices in seconds. No signup required. 17+ templates. Download PDF instantly." />
        <meta property="og:image" content="https://flowdesk.tech/og-invoice-generator.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://flowdesk.tech/try-now" />
        <meta property="twitter:title" content="Free Invoice Generator - Create Professional Invoices Online" />
        <meta property="twitter:description" content="Generate professional invoices in seconds. No signup required. 17+ templates. Download PDF instantly." />
        <meta property="twitter:image" content="https://flowdesk.tech/og-invoice-generator.png" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://flowdesk.tech/try-now" />
        
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />
      </head>
    </>
  );
};

export default PublicInvoiceSEO;

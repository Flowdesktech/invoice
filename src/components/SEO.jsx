import React from 'react';

const SEO = ({ 
  title = 'FlowDesk - Professional Invoice Management Software',
  description = 'Create, send, and track invoices with ease. FlowDesk helps freelancers and small businesses get paid faster with professional invoicing, automated reminders, and payment tracking.',
  keywords = 'invoice software, invoice management, billing software, invoice generator, payment tracking, recurring invoices, freelance invoicing, small business invoicing',
  ogTitle,
  ogDescription,
  ogImage = 'https://flowdesk.tech/og-image.png',
  ogUrl,
  canonicalUrl,
  noIndex = false,
  structuredData,
}) => {
  const siteUrl = 'https://flowdesk.tech';
  const fullOgUrl = ogUrl || (typeof window !== 'undefined' ? window.location.href : siteUrl);
  
  return (
    <>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph Tags for Social Media */}
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullOgUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="FlowDesk" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || title} />
      <meta name="twitter:description" content={ogDescription || description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Additional SEO Tags */}
      <meta name="author" content="FlowDesk" />
      <meta name="application-name" content="FlowDesk" />
      <meta name="theme-color" content="#1e293b" />
      
      {/* Structured Data */}
      {structuredData && (
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </>
  );
};

export default SEO;

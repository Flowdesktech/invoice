import React, { useEffect, useRef } from 'react';

const SocialImageGenerator = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size for social media (1200x630)
    canvas.width = 1200;
    canvas.height = 630;
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, '#1976d2');
    gradient.addColorStop(1, '#1565c0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);
    
    // Add pattern overlay
    ctx.globalAlpha = 0.1;
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 12; j++) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(i * 60 + 30, j * 60 + 15, 40, 40);
      }
    }
    ctx.globalAlpha = 1;
    
    // Add logo/brand text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 80px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('FlowDesk', 100, 150);
    
    // Add tagline
    ctx.font = '40px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Invoice Management Made Simple', 100, 220);
    
    // Add features box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.roundRect(100, 280, 1000, 250, 20);
    ctx.fill();
    
    // Add feature text
    ctx.fillStyle = '#1976d2';
    ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const features = [
      '✓ Create Professional Invoices in Seconds',
      '✓ Multi-Currency Support (30+ Currencies)',
      '✓ Send Invoices Directly via Email',
      '✓ Free Forever - No Credit Card Required'
    ];
    
    features.forEach((feature, index) => {
      ctx.fillText(feature, 150, 350 + (index * 50));
    });
    
    // Add call-to-action
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Start Free at flowdesk.tech', 100, 580);
    
    // Add decorative elements
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.3;
    
    // Top right decoration
    ctx.beginPath();
    ctx.arc(1050, 150, 80, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(1050, 150, 100, 0, Math.PI * 2);
    ctx.stroke();
    
    // Bottom left decoration
    ctx.beginPath();
    ctx.arc(150, 500, 60, 0, Math.PI * 2);
    ctx.stroke();
    
  }, []);

  const downloadImage = (filename) => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h1>Social Media Image Generator</h1>
      <p>Preview of your Open Graph and Twitter card image:</p>
      
      <div style={{ margin: '20px auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'inline-block' }}>
        <canvas 
          ref={canvasRef}
          style={{ 
            maxWidth: '100%', 
            height: 'auto',
            display: 'block'
          }}
        />
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => downloadImage('og-image.png')}
          style={{
            padding: '10px 20px',
            margin: '0 10px',
            fontSize: '16px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Download as og-image.png
        </button>
        <button 
          onClick={() => downloadImage('twitter-card.png')}
          style={{
            padding: '10px 20px',
            margin: '0 10px',
            fontSize: '16px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Download as twitter-card.png
        </button>
      </div>
      
      <div style={{ marginTop: '40px', textAlign: 'left', maxWidth: '600px', margin: '40px auto' }}>
        <h2>Instructions:</h2>
        <ol>
          <li>Click the download buttons above to save the images</li>
          <li>Place the downloaded images in your <code>/public</code> folder</li>
          <li>The images are already referenced in your meta tags</li>
          <li>Deploy to see them in action when sharing on social media</li>
        </ol>
        
        <h3>Image Specifications:</h3>
        <ul>
          <li><strong>Size:</strong> 1200x630 pixels (optimal for both Facebook and Twitter)</li>
          <li><strong>Format:</strong> PNG with high quality</li>
          <li><strong>Design:</strong> Professional gradient with your brand colors</li>
          <li><strong>Content:</strong> Logo, tagline, and key features</li>
        </ul>
      </div>
    </div>
  );
};

// Polyfill for roundRect if not available
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
  };
}

export default SocialImageGenerator;

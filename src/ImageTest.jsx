import React from 'react';

// Simple test component to check if images load
export default function ImageTest() {
  const testImages = [
    '/images/palmi/hero1.jpg',
    '/images/palmi/process1.jpg',
    '/images/synkro/hero.png',
  ];

  return (
    <div style={{ padding: '20px', background: '#fff' }}>
      <h1>Image Loading Test</h1>
      
      {testImages.map((src, index) => (
        <div key={index} style={{ marginBottom: '30px', border: '2px solid #ccc', padding: '10px' }}>
          <p><strong>Testing:</strong> {src}</p>
          
          <img 
            src={src}
            alt={`Test ${index}`}
            style={{ 
              width: '300px', 
              height: '200px', 
              objectFit: 'cover',
              border: '1px solid #000'
            }}
            onLoad={() => console.log(`✅ SUCCESS: ${src} loaded`)}
            onError={(e) => {
              console.error(`❌ FAILED: ${src} failed to load`);
              console.error('Error details:', e);
              e.target.style.border = '3px solid red';
            }}
          />
          
          <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
            Check console for load status
          </p>
        </div>
      ))}

      <div style={{ marginTop: '40px', padding: '20px', background: '#f0f0f0' }}>
        <h2>Debug Info</h2>
        <p><strong>Current URL:</strong> {window.location.href}</p>
        <p><strong>Base URL:</strong> {window.location.origin}</p>
        <p><strong>Expected image URL:</strong> {window.location.origin}/images/palmi/hero1.jpg</p>
        
        <h3>Manual Test Links:</h3>
        {testImages.map((src, i) => (
          <div key={i}>
            <a 
              href={src} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: 'blue', textDecoration: 'underline' }}
            >
              Click to test: {src}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

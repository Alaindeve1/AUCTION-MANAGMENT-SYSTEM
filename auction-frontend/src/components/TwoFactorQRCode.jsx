import React from 'react';

const TwoFactorQRCode = ({ qrCodeUrl }) => {
  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Scan QR Code</h3>
      <div className="p-4 bg-white rounded-lg border border-gray-200">
        <img 
          src={qrCodeUrl} 
          alt="2FA QR Code" 
          className="w-48 h-48"
          onError={(e) => {
            console.error('Error loading QR code:', e);
            e.target.style.display = 'none';
          }}
        />
      </div>
      <p className="mt-4 text-sm text-gray-600 text-center">
        Scan this QR code with Google Authenticator app to set up 2FA
      </p>
    </div>
  );
};

export default TwoFactorQRCode; 
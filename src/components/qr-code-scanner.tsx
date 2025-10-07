'use client';

import { useEffect, useState } from 'react';
import { Html5QrcodeScanner, QrcodeError, QrcodeSuccessCallback } from 'html5-qrcode';
import { Card, CardContent } from './ui/card';

interface QrCodeScannerProps {
  onScanSuccess: QrcodeSuccessCallback;
  onScanError?: (errorMessage: string, error: QrcodeError) => void;
}

export function QrCodeScanner({ onScanSuccess, onScanError }: QrCodeScannerProps) {
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    const qrScanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
        supportedScanTypes: [],
      },
      false
    );

    qrScanner.render(onScanSuccess, onScanError);
    setScanner(qrScanner);

    return () => {
      if (qrScanner.getState() === 2) { // 2 is SCANNING
        qrScanner.stop().catch(console.error);
      }
    };
  }, [onScanSuccess, onScanError]);

  return (
    <Card>
      <CardContent className="pt-6">
        <div id="qr-reader" className="w-full"></div>
      </CardContent>
    </Card>
  );
}

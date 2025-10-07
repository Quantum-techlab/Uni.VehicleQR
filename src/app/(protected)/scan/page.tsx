'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/hooks/use-auth';
import { QrCodeScanner } from '@/components/qr-code-scanner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, CheckCircle, User, Car, Palette, Ticket } from 'lucide-react';
import { doc, getDoc, addDoc, collection, Timestamp, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Driver, ScanLog } from '@/lib/types';
import { format } from 'date-fns';

type ScanStatus = 'idle' | 'scanning' | 'loading' | 'success' | 'error' | 'not_found';

async function fetchDriverAndLogScan(driverId: string, adminEmail: string): Promise<{ driver: Driver | null; logId: string | null }> {
  const driverRef = doc(db, 'drivers', driverId);
  const driverSnap = await getDoc(driverRef);

  if (!driverSnap.exists()) {
    return { driver: null, logId: null };
  }

  const driver = { id: driverSnap.id, ...driverSnap.data() } as Driver;

  const logData = {
    driverId: driver.id,
    driverName: driver.fullName,
    vehicleRegistrationNumber: driver.vehicleRegistrationNumber,
    scannedAt: Timestamp.now(),
    verifiedBy: adminEmail,
    status: 'Verified',
  };

  const logRef = await addDoc(collection(db, 'scan_logs'), logData);

  return { driver, logId: logRef.id };
}

export default function ScanPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [scannedDriver, setScannedDriver] = useState<Driver | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleScanSuccess = async (decodedText: string) => {
    setStatus('loading');
    setScannedDriver(null);

    try {
      if (!user?.email) {
          throw new Error("Admin user not found.");
      }
      const { driver } = await fetchDriverAndLogScan(decodedText, user.email);
      if (driver) {
        setScannedDriver(driver);
        setStatus('success');
      } else {
        setStatus('not_found');
      }
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'An unexpected error occurred.');
    }
  };

  const resetScanner = () => {
    setStatus('idle');
    setScannedDriver(null);
    setErrorMessage('');
  };

  const renderResult = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="font-semibold">Verifying QR Code...</p>
          </div>
        );
      case 'success':
        if (!scannedDriver) return null;
        return (
          <Card className="w-full">
            <CardHeader className="bg-green-100 dark:bg-green-900/20">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <CardTitle className="text-green-800 dark:text-green-300">Verification Successful</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
               <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={scannedDriver.passportPhotoUrl} />
                    <AvatarFallback>{scannedDriver.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">{scannedDriver.fullName}</h3>
                    <p className="text-muted-foreground">{scannedDriver.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2"><Car className="h-4 w-4 text-muted-foreground" /><span>{scannedDriver.vehicleModel}</span></div>
                    <div className="flex items-center gap-2"><Palette className="h-4 w-4 text-muted-foreground" /><span>{scannedDriver.vehicleColor}</span></div>
                    <div className="flex items-center gap-2 col-span-2"><Ticket className="h-4 w-4 text-muted-foreground" /><span className="font-mono text-base font-bold">{scannedDriver.vehicleRegistrationNumber}</span></div>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={resetScanner} className="w-full">Scan Another Vehicle</Button>
            </CardFooter>
          </Card>
        );
      case 'not_found':
      case 'error':
        return (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{status === 'not_found' ? 'Driver Not Found' : 'Scan Error'}</AlertTitle>
            <AlertDescription>
              {status === 'not_found'
                ? 'No driver record was found for this QR code.'
                : errorMessage}
            </AlertDescription>
             <Button onClick={resetScanner} variant="destructive" className="mt-4 w-full">Try Again</Button>
          </Alert>
        );
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Scan Vehicle QR Code</CardTitle>
              <CardDescription>
                Position the vehicle's QR code in front of the camera.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QrCodeScanner
                onScanSuccess={handleScanSuccess}
                onScanError={(error) => console.warn(error)}
              />
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg">
      {renderResult()}
    </div>
  );
}

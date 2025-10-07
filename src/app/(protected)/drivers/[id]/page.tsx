import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Driver } from '@/lib/types';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, Home, Ticket, Car, Palette, ToyCar, QrCode, Download, FileJson } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

async function getDriver(id: string) {
  const driverDoc = await getDoc(doc(db, 'drivers', id));
  if (!driverDoc.exists()) {
    return null;
  }
  return { id: driverDoc.id, ...driverDoc.data() } as Driver;
}

function DetailItem({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | undefined }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-5 w-5 flex-shrink-0 text-muted-foreground mt-1" />
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-base font-semibold">{value}</p>
      </div>
    </div>
  );
}

function QRCodeDisplay({ driver }: { driver: Driver }) {
  'use client';

  const downloadQRCodeAsPDF = async () => {
    const qrElement = document.getElementById('qr-code-pdf');
    if (qrElement) {
      const canvas = await html2canvas(qrElement, { scale: 3 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`QRCode-${driver.vehicleRegistrationNumber}.pdf`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle QR Code</CardTitle>
        <CardDescription>
          Print and attach this QR code to the vehicle.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div id="qr-code-pdf" className="bg-white p-6 rounded-lg text-center">
            <h3 className="text-xl font-bold text-black">{driver.fullName}</h3>
            <p className="text-gray-600 mb-2">{driver.vehicleModel}</p>
            <div className="bg-gray-800 text-white font-mono text-2xl p-2 rounded-md inline-block mb-4">
                {driver.vehicleRegistrationNumber}
            </div>
            <Image
                src={driver.qrCodeUrl}
                alt="QR Code"
                width={250}
                height={250}
                className="mx-auto"
            />
        </div>
        <Button onClick={downloadQRCodeAsPDF} className="w-full max-w-xs">
          <Download className="mr-2 h-4 w-4" />
          Download as PDF
        </Button>
      </CardContent>
    </Card>
  );
}

export default async function DriverDetailPage({ params }: { params: { id: string } }) {
  const driver = await getDriver(params.id);

  if (!driver) {
    notFound();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="flex flex-col items-center text-center sm:flex-row sm:text-left">
            <Avatar className="h-24 w-24 mb-4 sm:mb-0 sm:mr-6">
              <AvatarImage src={driver.passportPhotoUrl} alt={driver.fullName} />
              <AvatarFallback>{driver.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl font-headline">{driver.fullName}</CardTitle>
              <CardDescription>
                Registered on {format(driver.registrationDate.toDate(), 'do MMMM, yyyy')}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <DetailItem icon={Ticket} label="NIN / ID Number" value={driver.nin} />
                <DetailItem icon={Phone} label="Phone Number" value={driver.phoneNumber} />
                <DetailItem icon={Mail} label="Email Address" value={driver.email} />
                <DetailItem icon={Home} label="Residential Address" value={driver.address} />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">Vehicle Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <DetailItem icon={Car} label="Vehicle Registration No." value={driver.vehicleRegistrationNumber} />
                <DetailItem icon={ToyCar} label="Vehicle Brand/Model" value={driver.vehicleModel} />
                <DetailItem icon={Palette} label="Vehicle Color" value={driver.vehicleColor} />
                <DetailItem icon={User} label="Vehicle Type" value={driver.vehicleType} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <QRCodeDisplay driver={driver} />
      </div>
    </div>
  );
}

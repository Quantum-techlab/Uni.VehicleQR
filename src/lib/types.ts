import type { Timestamp } from 'firebase/firestore';

export type Driver = {
  id: string;
  fullName: string;
  nin: string;
  passportPhotoUrl: string;
  phoneNumber: string;
  email: string;
  address: string;
  vehicleRegistrationNumber: string;
  vehicleType: string;
  vehicleColor: string;
  vehicleModel: string;
  qrCodeUrl: string;
  registrationDate: Timestamp;
};

export type ScanLog = {
  id: string;
  driverId: string;
  driverName: string;
  vehicleRegistrationNumber: string;
  scannedAt: Timestamp;
  verifiedBy: string;
  status: 'Verified' | 'Not Found';
};

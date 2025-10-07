'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Users,
  ScanLine,
  ArrowUpRight,
  Car,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from 'firebase/firestore';
import { Driver } from '@/lib/types';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type DashboardData = {
  totalDrivers: number;
  totalScans: number;
  recentDrivers: Driver[];
};

async function getDashboardData(): Promise<DashboardData> {
  const driversRef = collection(db, 'drivers');
  const logsRef = collection(db, 'scan_logs');

  const driversQuery = query(driversRef, orderBy('registrationDate', 'desc'), limit(5));

  const [driversSnapshot, logsSnapshot, recentDriversSnapshot] = await Promise.all([
    getDocs(driversRef),
    getDocs(logsRef),
    getDocs(driversQuery),
  ]);

  const totalDrivers = driversSnapshot.size;
  const totalScans = logsSnapshot.size;

  const recentDrivers = recentDriversSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Driver[];

  return { totalDrivers, totalScans, recentDrivers };
}


export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    getDashboardData().then(setData);
  }, []);

  const { totalDrivers, totalScans, recentDrivers } = data || { totalDrivers: 0, totalScans: 0, recentDrivers: [] };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <motion.div whileHover={{ y: -5, scale: 1.03 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDrivers}</div>
              <p className="text-xs text-muted-foreground">
                Registered drivers in the system
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div whileHover={{ y: -5, scale: 1.03 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
              <ScanLine className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalScans}</div>
              <p className="text-xs text-muted-foreground">
                Total vehicle verifications
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div whileHover={{ y: -5, scale: 1.03 }} className="flex">
          <Card className="flex flex-col w-full">
              <CardHeader>
                  <CardTitle>New Registration</CardTitle>
                  <CardDescription>Register a new driver and vehicle.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end">
                  <Button asChild className="w-full">
                      <Link href="/register-driver">Register Driver</Link>
                  </Button>
              </CardContent>
          </Card>
        </motion.div>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>Recent Registrations</CardTitle>
            <CardDescription>
              The 5 most recently registered drivers.
            </CardDescription>
          </div>
          <Button asChild size="sm" className="ml-auto gap-1">
            <Link href="/register-driver">
              View All
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver</TableHead>
                <TableHead className="hidden md:table-cell">
                  Vehicle
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Plate No.
                </TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentDrivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage
                          src={driver.passportPhotoUrl}
                          alt="Avatar"
                        />
                        <AvatarFallback>{driver.fullName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{driver.fullName}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {driver.vehicleModel}
                  </TableCell>
                   <TableCell className="hidden md:table-cell">
                    <div className="font-medium">{driver.vehicleRegistrationNumber}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    {driver.registrationDate ? format(driver.registrationDate.toDate(), 'PPP') : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
               {recentDrivers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    No recent registrations.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

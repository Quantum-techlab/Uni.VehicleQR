import {
  collection,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ScanLog } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';

async function getScanLogs() {
  const logsRef = collection(db, 'scan_logs');
  const q = query(logsRef, orderBy('scannedAt', 'desc'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ScanLog[];
}

export default async function LogsPage() {
  const logs = await getScanLogs();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scan & Verification Logs</CardTitle>
        <CardDescription>
          A complete history of all vehicle verification scans.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Driver Name</TableHead>
              <TableHead>Vehicle Number</TableHead>
              <TableHead>Verified By (Admin)</TableHead>
              <TableHead className="text-right">Date & Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">{log.driverName}</TableCell>
                <TableCell>{log.vehicleRegistrationNumber}</TableCell>
                <TableCell className="text-muted-foreground">{log.verifiedBy}</TableCell>
                <TableCell className="text-right">
                  {format(log.scannedAt.toDate(), 'PPP p')}
                </TableCell>
              </TableRow>
            ))}
            {logs.length === 0 && (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        No logs found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

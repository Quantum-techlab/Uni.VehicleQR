'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { registerDriverAction } from '@/actions/register-driver';

const driverSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters.'),
  nin: z.string().min(5, 'A valid ID number is required.'),
  passportPhoto: z.instanceof(File).refine((file) => file.size > 0, 'Passport photo is required.'),
  phoneNumber: z.string().min(10, 'A valid phone number is required.'),
  email: z.string().email('Invalid email address.'),
  address: z.string().min(10, 'Address is required.'),
  vehicleRegistrationNumber: z.string().min(3, 'Vehicle registration number is required.'),
  vehicleType: z.string().min(3, 'Vehicle type is required (e.g., Car, Bus).'),
  vehicleColor: z.string().min(3, 'Vehicle color is required.'),
  vehicleModel: z.string().min(3, 'Vehicle brand/model is required.'),
});

type DriverFormValues = z.infer<typeof driverSchema>;

export default function RegisterDriverPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      fullName: '',
      nin: '',
      phoneNumber: '',
      email: '',
      address: '',
      vehicleRegistrationNumber: '',
      vehicleType: '',
      vehicleColor: '',
      vehicleModel: '',
    },
  });

  const onSubmit = async (values: DriverFormValues) => {
    setLoading(true);

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await registerDriverAction(formData);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: result.error,
      });
    } else if (result.driverId) {
      toast({
        title: 'Registration Successful',
        description: 'Driver and vehicle have been registered.',
      });
      router.push(`/drivers/${result.driverId}`);
    } else {
        toast({
            variant: 'destructive',
            title: 'An Unknown Error Occurred',
            description: "Could not complete registration.",
        });
    }

    setLoading(false);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Register New Driver</CardTitle>
        <CardDescription>
          Fill in the details below to register a new driver and their vehicle.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-8">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Driver's Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="nin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIN or any Valid ID</FormLabel>
                      <FormControl>
                        <Input placeholder="National Identity Number, Staff ID, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="passportPhoto"
                  render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                        <FormLabel>Passport Photograph</FormLabel>
                        <FormControl>
                            <Input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if(file) onChange(file);
                                }}
                                {...rest}
                            />
                        </FormControl>
                        <FormDescription>Upload a clear passport-style photo of the driver.</FormDescription>
                        <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="08012345678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="driver@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Residential Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123, University Road, Ilorin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-8">
               <FormField
                  control={form.control}
                  name="vehicleRegistrationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Registration Number</FormLabel>
                      <FormControl>
                        <Input placeholder="KJA-123AB" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vehicleType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Car, Bus, Bike" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vehicleColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Color</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Red, Blue" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vehicleModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Brand/Model</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Toyota Corolla 2010" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading} size="lg">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Register Driver
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

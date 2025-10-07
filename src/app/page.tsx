'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  UserPlus,
  QrCode,
  LayoutDashboard,
  ShieldCheck,
  Database,
  Wind,
  Code,
  ArrowRight,
} from 'lucide-react';
import { Icons } from '@/components/icons';
import Image from 'next/image';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <UserPlus className="h-10 w-10 text-primary" />,
    title: 'Driver Registration',
    description:
      'Admins can securely register new drivers, upload necessary documents, and instantly generate a unique vehicle QR code.',
  },
  {
    icon: <QrCode className="h-10 w-10 text-primary" />,
    title: 'QR Code Scanning',
    description:
      'Campus security can verify driver and vehicle details in real-time by scanning the QR code with any camera-enabled device.',
  },
  {
    icon: <LayoutDashboard className="h-10 w-10 text-primary" />,
    title: 'Admin Dashboard',
    description:
      'A comprehensive dashboard to view all registered vehicles, track verification history, and manage the system efficiently.',
  },
];

const techStack = [
  { icon: <Database className="h-8 w-8" />, name: 'Firebase' },
  { icon: <ShieldCheck className="h-8 w-8" />, name: 'Firestore' },
  { icon: <Wind className="h-8 w-8" />, name: 'TailwindCSS' },
  { icon: <Code className="h-8 w-8" />, name: 'Next.js' },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const cardVariants = {
  initial: { y: 0, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' },
  hover: {
    y: -5,
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
};


export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Icons.Logo className="h-8 w-8 text-primary" />
            <span className="hidden text-lg font-bold text-primary sm:inline-block">
              VehiclePass
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link
              href="#home"
              className="transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link
              href="#features"
              className="transition-colors hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="#about"
              className="transition-colors hover:text-primary"
            >
              About
            </Link>
          </nav>
          <Button asChild>
            <Link href="/login">Admin Login</Link>
          </Button>
        </div>
      </motion.header>

      <main className="flex-1">
        <motion.section 
          id="home" 
          className="relative w-full py-20 md:py-32 lg:py-40"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
           <div
            className="absolute inset-0 bg-contain bg-center opacity-10"
            style={{ backgroundImage: "url('/security-bg.svg')" }}
          ></div>
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <motion.div
                  className="mb-6 flex justify-center"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <QrCode className="h-16 w-16 text-primary" />
              </motion.div>
              <motion.h1 
                className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl font-headline"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                QR Code-Based Vehicle & Driver Verification
              </motion.h1>
              <motion.p 
                className="mt-6 text-lg text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                A secure web platform for registering, verifying, and tracking
                vehicles on the University of Ilorin campus.
              </motion.p>
              <motion.div 
                className="mt-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Button asChild size="lg" className="group">
                  <Link href="/dashboard">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <motion.section 
          id="features" 
          className="w-full bg-muted/40 py-20 md:py-24"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-primary sm:text-4xl font-headline">
                Core Features
              </h2>
              <p className="mt-4 text-muted-foreground">
                Streamlining campus security with powerful, easy-to-use tools.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  initial="initial"
                  whileHover="hover"
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <Card
                    className="h-full transform-gpu bg-background"
                  >
                    <CardHeader className="items-center text-center">
                      {feature.icon}
                      <CardTitle className="mt-4 font-headline">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-center text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
        
        <motion.section 
          id="about" 
          className="w-full bg-background py-20 md:py-24"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
            <div className="container mx-auto grid gap-12 px-4 md:grid-cols-2 md:items-center">
                <div className="order-2 md:order-1">
                    <h2 className="text-3xl font-bold text-primary sm:text-4xl font-headline">
                        Enhancing Campus Security
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        The UniIlorin Vehicle Verification System is a digital solution designed to replace manual gate-pass and vehicle identification methods. By leveraging QR code technology, it provides a faster, more secure, and more reliable way to manage vehicle access on campus.
                    </p>
                    <p className="mt-4 text-muted-foreground">
                        Our goal is to improve security operations, reduce unauthorized entry, and provide a seamless experience for both security personnel and the campus community.
                    </p>
                </div>
                 <div className="order-1 md:order-2 flex justify-center">
                    <Image src="https://picsum.photos/seed/unilorin-gate/600/400" alt="University Gate" width={600} height={400} className="rounded-lg shadow-lg" data-ai-hint="university gate" />
                </div>
            </div>
        </motion.section>

        <motion.section
          id="tech"
          className="w-full bg-muted/40 py-20 md:py-24"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-primary sm:text-4xl font-headline">
              Powered by Modern Technology
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Built using a modern web stack for a fast and reliable experience.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-x-12 gap-y-8">
              {techStack.map((tech, index) => (
                <div key={index} className="flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
                  {tech.icon}
                  <span className="font-semibold">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      </main>

      <footer
        id="contact"
        className="w-full bg-primary text-primary-foreground"
      >
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} University of Ilorin
          </p>
          <p className="mt-2 text-xs text-primary-foreground/80">
            Developed by Abdulrasaq Abdulrasaq Alatare, Department of Information Technology
          </p>
        </div>
      </footer>
    </div>
  );
}

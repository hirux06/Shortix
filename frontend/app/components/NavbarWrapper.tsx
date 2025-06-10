'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar'; // adjust the import path if needed

const hiddenRoutes = ['/', '/home'];

export default function NavbarWrapper() {
  const pathname = usePathname();

  if (hiddenRoutes.includes(pathname)) {
    return null;
  }

  return <Navbar />;
}

import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <div className='flex items-center justify-between px-8 py-5'>
        <div className='text-xl font-bold'><Link href="/">Shortix</Link></div>
        <div>
            <ul className='flex gap-10'>
                <li><Link href="/generateQR">QR Code</Link></li>
                <li><Link href="/generateQR">Shorten URL</Link></li>
                <li><Link href="/login">Login</Link></li>
                <li><Link href="/register">Register</Link></li>
            </ul>
        </div>
    </div>
  )
}

export default Navbar
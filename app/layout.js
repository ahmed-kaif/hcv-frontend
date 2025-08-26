import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/providers/AuthProvider'
import Navbar from '@/components/Navbar'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // This prevents FOUT
  variable: '--font-inter',
})

export const metadata = {
  title: 'HCV Predictor',
  description: 'Predict HCV patient classification',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}
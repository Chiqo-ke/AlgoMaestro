import type { Metadata } from 'next'
import { Inter, Source_Code_Pro } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-code-pro'
})

export const metadata: Metadata = {
  title: 'AlgoMaestro - Algorithmic Trading Platform',
  description: 'AI-powered algorithmic trading strategy development and backtesting platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${sourceCodePro.variable} font-body antialiased`}>
        {children}
      </body>
    </html>
  )
}
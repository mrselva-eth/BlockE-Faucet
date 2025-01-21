import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "BlockE Faucet",
  description: "Claim MATIC tokens on the Polygon network",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-cover bg-center" style={{ backgroundImage: "url('/back.png')" }}>
        {children}
      </body>
    </html>
  )
}


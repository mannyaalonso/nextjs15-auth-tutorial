"use client"

import { useQRCode } from 'next-qrcode'
 
export function QRCode() {
    const { Image } = useQRCode()
  
    return (
      <Image
        text={window.location.href}
        options={{
          type: 'image/jpeg',
          quality: 0.3,
          errorCorrectionLevel: 'M',
          margin: 3,
          scale: 4,
          width: 200,
          color: {
            dark: '#0000',
            light: '#FFF',
          },
        }}
      />
    )
  }
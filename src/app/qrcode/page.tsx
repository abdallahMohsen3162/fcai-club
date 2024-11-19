"use client"
import React from 'react'
import QRCodeComponent from './QrCodeComponent'
export default function Page() {
  return (
    <div>
      <QRCodeComponent value="https://www.npmjs.com/package/react-qrcode-logo" />
    </div>
  )
}

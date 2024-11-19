import { FC } from 'react';
import { QRCode } from 'react-qrcode-logo';

interface QRCodeComponentProps {
  value: string;
}

const QRCodeComponent: FC<QRCodeComponentProps> = ({ value }) => {
  return <QRCode value={value} />;
};

export default QRCodeComponent;

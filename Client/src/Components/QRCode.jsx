import { QRCodeCanvas } from "qrcode.react";

const QRCodeGenerator = () => {
  const inquiryURL = "http://localhost:5173/inquiry"; // Change to your actual URL

  return (
    <div className="qr-container">
      <h2>Scan to Open Inquiry Form</h2>
      <QRCodeCanvas value={inquiryURL} size={200} />
    </div>
  );
};

export default QRCodeGenerator;

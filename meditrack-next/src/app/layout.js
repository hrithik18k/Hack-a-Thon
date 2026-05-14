import Providers from "./providers";
import "../styles/global.css";

export const metadata = {
  title: "Medi Track — Enterprise Healthcare Platform",
  description: "Connect with top doctors, manage appointments seamlessly, and keep all your medical records secure. Enterprise-grade healthcare management.",
  keywords: "healthcare, doctors, appointments, medical records, telemedicine",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

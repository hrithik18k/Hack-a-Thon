import Providers from "./providers";
import "../styles/global.css";

export const metadata = {
  title: "Medi Track",
  description: "Healthcare appointment and medical records platform",
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

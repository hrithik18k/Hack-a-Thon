import "../styles/global.css";
import Providers from "./providers";

export const metadata = {
  title: "Medi Track",
  description: "Trusted digital care experience for patients, doctors, and emergency access.",
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

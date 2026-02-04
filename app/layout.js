export const metadata = {
  title: "Flood Watch AI",
  description: "Guwuhati Flood Reporting",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
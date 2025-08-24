import "primereact/resources/themes/lara-light-blue/theme.css"; // Theme (can be any)
import "primereact/resources/primereact.min.css"; // PrimeReact core styles
import "primeicons/primeicons.css";//layout.js



export const metadata = {
  title: "Car Rental App",
  description: "Car Rental Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#181c32", minHeight: "100vh" }}>
        {children}
      </body>
    </html>
  );
}

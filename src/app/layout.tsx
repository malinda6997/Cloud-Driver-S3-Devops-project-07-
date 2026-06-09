import Sidebar from "../components/Sidebar";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-slate-950">
      <body className="flex h-full flex-col md:flex-row text-slate-200 antialiased">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-slate-950 p-6 md:p-10">{children}</main>
      </body>
    </html>
  );
}
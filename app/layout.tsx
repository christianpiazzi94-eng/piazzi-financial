// app/layout.tsx
import './globals.css';

const BRAND = 'Piazzi Financial Analysis';

export const metadata = {
  title: BRAND,
  description: 'Data-driven financial insights and research modules.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="text-gray-900 bg-[rgb(211,211,255)]">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-20 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            {/* Logo + Brand */}
            <div className="flex items-center gap-3">
              <img
                src="/Lavender.png"
                alt="Piazzi Financial Analysis logo"
                className="w-10 h-10 rounded-full object-cover hover:opacity-80 transition"
              />
              <span className="font-semibold tracking-tight text-gray-900 text-lg">
                {BRAND}
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
              <a href="/" className="hover:text-[#3B3B98] transition">Home</a>
              <a href="#insights" className="hover:text-[#3B3B98] transition">Insights</a>
              <a href="#subscribe" className="hover:text-[#3B3B98] transition">Subscribe</a>
              <a href="#" className="hover:text-[#3B3B98] transition">Contact</a>
              <a href="#" className="hover:text-[#3B3B98] transition">Login</a>
            </nav>
          </div>
        </header>

        {/* Main content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="border-t mt-16 py-8 text-center text-sm text-gray-600 bg-white">
          © {new Date().getFullYear()} {BRAND} — All rights reserved.
        </footer>
      </body>
    </html>
  );
}

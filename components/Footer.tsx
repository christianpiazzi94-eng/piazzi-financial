import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-white">
      <div className="container">
        <div className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <div>
            <div className="text-lg font-bold">YourBrand</div>
            <p className="mt-2 max-w-xs text-gray-600">Concise tagline about your mission.</p>
          </div>
          <div>
            <div className="font-semibold text-gray-900">Sections</div>
            <ul className="mt-3 space-y-2 text-gray-600">
              <li><Link href="/">Insights</Link></li>
              <li><Link href="#">Memos</Link></li>
              <li><Link href="#">Market Commentary</Link></li>
              <li><Link href="#">Education</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-gray-900">Company</div>
            <ul className="mt-3 space-y-2 text-gray-600">
              <li><Link href="#">About</Link></li>
              <li><Link href="#">Careers</Link></li>
              <li><Link href="#">Contact</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-gray-900">Legal</div>
            <ul className="mt-3 space-y-2 text-gray-600">
              <li><Link href="#">Terms</Link></li>
              <li><Link href="#">Privacy</Link></li>
              <li><Link href="#">Disclosures</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t py-6 text-center text-xs text-gray-500">© {new Date().getFullYear()} YourBrand. All rights reserved.</div>
      </div>
    </footer>
  )
}

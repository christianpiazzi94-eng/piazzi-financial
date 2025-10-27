// app/screener-content/page.tsx
// This is the actual page content, now safe from the middleware/auth() check.
export const dynamic = 'force-dynamic'; 

export default function ScreenerContentPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-5xl font-serif font-medium text-brand-dark mb-4">
        Premium Stock Screener Access
      </h1>
      <p className="text-xl text-green-700 font-semibold">
        SUCCESS! Access Granted!
      </p>
      <div className="mt-8 p-6 bg-slate-50 border rounded-lg">
        <h2 className="text-2xl font-bold">Protected Content Area</h2>
        <p className="mt-2 text-slate-700">
          This is the content that was protected by the route handler.
        </p>
      </div>
    </div>
  );
}
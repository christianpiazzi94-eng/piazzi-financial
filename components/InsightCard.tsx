export default function InsightCard() {
  return (
    <article className="rounded-2xl border bg-white overflow-hidden hover:shadow transition">
      <div className="aspect-[16/9] bg-gray-200" />
      <div className="p-4">
        <div className="text-xs text-gray-500">Section • Today</div>
        <h3 className="mt-1 font-semibold text-gray-900 line-clamp-2">
          Placeholder headline for an insight
        </h3>
        <p className="mt-1 text-sm text-gray-600 line-clamp-3">
          Short placeholder summary. Replace with your own copy or pull from your API later.
        </p>
      </div>
    </article>
  );
}

export const PullQuote = ({ text }) => (
  <aside className="my-8 py-4 px-6 border-l-4 border-gray-600 bg-gray-50">
    <blockquote className="text-xl italic text-gray-700">
      {text}
    </blockquote>
  </aside>
);
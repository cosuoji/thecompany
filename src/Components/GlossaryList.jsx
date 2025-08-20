// pages/GlossaryList.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { glossary } from "../data/glossaryData";

export default function GlossaryList() {
  const [search, setSearch] = useState("");

  const filtered = glossary.filter(item =>
    item.term.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce((acc, item) => {
    const letter = item.term[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(item);
    return acc;
  }, {});

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Shoe Glossary</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search for a term..."
        className="w-full border rounded-lg p-3 mb-8 focus:outline-none focus:ring-2 focus:ring-#4B371C"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Alphabet navigation */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {alphabet.map((letter) => (
          <a
            key={letter}
            href={`#${letter}`}
            className="px-2 py-1 text-sm rounded hover:bg-blue-100 text-#4B371C"
          >
            {letter}
          </a>
        ))}
      </div>

      {/* Glossary grouped by letter */}
      {alphabet.map((letter) =>
        grouped[letter] ? (
          <div key={letter} id={letter} className="mb-8">
            <h2 className="text-2xl font-bold text-#4B371C mb-4 border-b border-gray-200">
              {letter}
            </h2>
            <div className="space-y-3">
              {grouped[letter].map((item, idx) => (
                <div
                  key={idx}
                  className="border rounded-lg overflow-hidden shadow-sm bg-white hover:bg-gray-50"
                >
                  <Link
                    to={`/glossary/${item.term.toLowerCase()}`}
                    className="block p-4 font-semibold text-gray-800 hover:text-#4B371C"
                  >
                    {item.term}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}

// pages/GlossaryList.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { glossary } from "../data/glossaryData";
import { Helmet } from "react-helmet-async";

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
      {/* SEO Head */}
      <Helmet>
        <title>Shoe Glossary | Shoe Company</title>
        <meta
          name="description"
          content="Explore our shoe glossary: a complete A–Z dictionary of footwear terms, styles, and materials to help you understand the world of shoes."
        />
        <link rel="canonical" href="https://www.yourshoedomain.com/glossary" />
        <meta property="og:title" content="Shoe Glossary | Shoe Company" />
        <meta
          property="og:description"
          content="A complete glossary of footwear terms, styles, and materials."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.yourshoedomain.com/glossary"
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DefinedTermSet",
            "name": "Shoe Glossary",
            "description":
              "An A–Z glossary of footwear terminology, styles, and materials by Shoe Company.",
            "url": "https://www.yourshoedomain.com/glossary",
            "hasDefinedTerm": glossary.map((item) => ({
              "@type": "DefinedTerm",
              "name": item.term,
              "url": `https://www.yourshoedomain.com/glossary/${item.term.toLowerCase()}`
            }))
          })}
        </script>
      </Helmet>

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

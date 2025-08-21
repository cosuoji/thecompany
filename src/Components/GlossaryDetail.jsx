// pages/GlossaryDetail.jsx
import { useParams, Link } from "react-router-dom";
import { glossary } from "../data/glossaryData";
import { Helmet } from "react-helmet-async";


export default function GlossaryDetail() {
  const { term } = useParams();
  const entry = glossary.find(
    (item) => item.term.toLowerCase() === term.toLowerCase()
  );

  if (!entry) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        <Helmet>
          <title>Term Not Found | Shoe Glossary</title>
          <meta
            name="description"
            content="The glossary term you're looking for does not exist."
          />
        </Helmet>
        <h1 className="text-2xl font-bold text-red-600 mb-4">Term Not Found</h1>
        <p className="mb-6 text-gray-600">
          The glossary term you're looking for does not exist.
        </p>
        <Link
          to="/glossary"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Glossary
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
          {/* ✅ SEO Meta Tags */}
      <Helmet>
        <title>{entry.term} | Shoe Glossary</title>
        <meta name="description" content={entry.definition} />

        {/* Open Graph (Facebook/LinkedIn) */}
        <meta property="og:title" content={`${entry.term} | Shoe Glossary`} />
        <meta property="og:description" content={entry.definition} />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`https://yourdomain.com/glossary/${entry.term.toLowerCase()}`}
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${entry.term} | Shoe Glossary`} />
        <meta name="twitter:description" content={entry.definition} />
      </Helmet>
      <h1 className="text-3xl font-bold text-#4B371C mb-4">{entry.term}</h1>
      <p className="text-gray-700 mb-4">{entry.definition}</p>
      {entry.category && (
        <p className="text-sm text-gray-500 italic">
          Category: {entry.category}
        </p>
      )}

      <div className="mt-8">
        <Link
          to="/glossary"
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          ← Back to Glossary
        </Link>
      </div>
    </div>
  );
}

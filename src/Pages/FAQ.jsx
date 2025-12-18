import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiMinus, FiSearch } from "react-icons/fi";

/* --------------------------------------------
   FAQ DATA
-------------------------------------------- */
const faqData = [
  {
    category: "Shopping & Orders",
    slug: "orders",
    items: [
      {
        id: "international-shipping",
        q: "Do you ship internationally?",
        a: "Yes. We ship worldwide using trusted courier partners. Shipping fees and delivery timelines are calculated at checkout.",
      },
      {
        id: "modify-order",
        q: "Can I modify or cancel my order?",
        a: "Orders can be modified or canceled within 12 hours of purchase. After this window, orders enter processing.",
      },
    ],
  },
  {
    category: "Shoes & Craft",
    slug: "craft",
    items: [
      {
        id: "where-made",
        q: "Where are your shoes made?",
        a: "Our shoes are handcrafted in small batches by skilled artisans using premium, responsibly sourced materials.",
      },
      {
        id: "shoe-care",
        q: "How do I care for my shoes?",
        a: "Store in a cool, dry place. Clean gently with a soft brush or cloth. Care instructions are included with every pair.",
      },
    ],
  },
  {
    category: "Magazine",
    slug: "magazine",
    items: [
      {
        id: "magazine-content",
        q: "What is featured in your magazine?",
        a: "Our magazine explores craftsmanship, culture, design, and thoughtful storytelling beyond footwear.",
      },
      {
        id: "digital-magazine",
        q: "Is the magazine available digitally?",
        a: "Currently, the magazine is available in print only. Digital editions may be introduced later.",
      },
    ],
  },
  {
    category: "Shipping & Returns",
    slug: "returns",
    items: [
      {
        id: "return-policy",
        q: "What is your return policy?",
        a: "Unused items can be returned within 7 days of delivery, in original condition and packaging.",
      },
      {
        id: "return-shipping",
        q: "Who covers return shipping?",
        a: "Return shipping costs are covered by the customer unless the item arrived damaged or incorrect.",
      },
    ],
  },
];

/* --------------------------------------------
   FAQ ITEM
-------------------------------------------- */
const FAQItem = ({ item, isOpen, onToggle }) => (
  <div id={item.id} className="border-b border-neutral-200 py-6 scroll-mt-28">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between text-left"
    >
      <h4 className="text-lg md:text-xl font-medium text-neutral-900">
        {item.q}
      </h4>
      {isOpen ? <FiMinus /> : <FiPlus />}
    </button>

    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <p className="mt-4 text-neutral-600 leading-relaxed">
            {item.a}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

/* --------------------------------------------
   MAIN PAGE
-------------------------------------------- */
const FAQ = () => {
  const [openId, setOpenId] = useState(null);
  const [search, setSearch] = useState("");

  /* --------------------------------------------
     SEARCH FILTER
  -------------------------------------------- */
  const filteredData = useMemo(() => {
    if (!search) return faqData;

    return faqData
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) =>
            item.q.toLowerCase().includes(search.toLowerCase()) ||
            item.a.toLowerCase().includes(search.toLowerCase())
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [search]);

  /* --------------------------------------------
     DEEP LINK OPEN
  -------------------------------------------- */
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;

    faqData.forEach((section) => {
      section.items.forEach((item) => {
        if (item.id === hash) {
          setOpenId(item.id);
          document.getElementById(item.id)?.scrollIntoView({
            behavior: "smooth",
          });
        }
      });
    });
  }, []);

  /* --------------------------------------------
     SEO FAQ SCHEMA
  -------------------------------------------- */
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqData.flatMap((section) =>
        section.items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        }))
      ),
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => document.head.removeChild(script);
  }, []);

  return (
    <main className="bg-[#F8F4EF] min-h-screen">
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-28 pb-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl text-black font-bold tracking-tight"
        >
          Frequently Asked Questions
        </motion.h1>
        <p className="mt-6 text-neutral-600 max-w-2xl mx-auto">
          Everything you need to know about our shoes, magazine, and editorial work.
        </p>

        {/* SEARCH */}
        <div className="relative max-w-md mx-auto mt-10">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions…"
            className="w-full pl-12 pr-4 py-3 rounded-full border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-[220px_1fr] gap-12">
        {/* STICKY NAV */}
        <aside className="hidden md:block sticky top-32 h-fit">
          <nav className="space-y-4">
            {faqData.map((section) => (
              <a
                key={section.slug}
                href={`#${section.items[0].id}`}
                className="block text-sm uppercase tracking-wide text-neutral-500 hover:text-neutral-900"
              >
                {section.category}
              </a>
            ))}
          </nav>
        </aside>

        {/* FAQ LIST */}
        <div>
          {filteredData.map((section) => (
            <div key={section.slug} className="mb-16">
              <h3 className="text-2xl text-black font-semibold mb-6">
                {section.category}
              </h3>

              {section.items.map((item) => (
                <FAQItem
                  key={item.id}
                  item={item}
                  isOpen={openId === item.id}
                  onToggle={() =>
                    setOpenId(openId === item.id ? null : item.id)
                  }
                />
              ))}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default FAQ;

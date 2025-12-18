import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiMinus, FiSearch } from "react-icons/fi";
import SEO from "../Components/SEO";

/* --------------------------------------------
   SHIPPING DATA
-------------------------------------------- */
const shippingData = [
  {
    category: "General Shipping",
    slug: "general",
    items: [
      {
        id: "processing-time",
        q: "How long does order processing take?",
        a: "Orders are processed within 1–3 business days. Once dispatched, you’ll receive a confirmation email with tracking details.",
      },
      {
        id: "where-ship-from",
        q: "Where do you ship from?",
        a: "All orders are shipped directly from our fulfillment partners depending on your location and product availability.",
      },
    ],
  },
  {
    category: "International Shipping",
    slug: "international",
    items: [
      {
        id: "international-availability",
        q: "Do you ship internationally?",
        a: "Yes. We ship worldwide using trusted courier partners. Available options and pricing are shown at checkout.",
      },
      {
        id: "customs-duties",
        q: "Will I pay customs or import duties?",
        a: "International orders may be subject to customs duties or import taxes. These charges are the responsibility of the recipient.",
      },
    ],
  },
  {
    category: "Delivery Times",
    slug: "delivery-times",
    items: [
      {
        id: "delivery-estimates",
        q: "How long does delivery take?",
        a: "Delivery times vary by location. Domestic orders typically arrive within 3–5 business days, while international orders may take 7–14 business days.",
      },
      {
        id: "delays",
        q: "What happens if my delivery is delayed?",
        a: "While delays are rare, they can occur due to customs or courier issues. Our support team is happy to assist if your order takes longer than expected.",
      },
    ],
  },
  {
    category: "Tracking & Issues",
    slug: "tracking",
    items: [
      {
        id: "tracking-order",
        q: "How do I track my order?",
        a: "Once your order ships, you’ll receive a tracking number via email. You can use this to monitor delivery progress.",
      },
      {
        id: "missing-package",
        q: "What if my package is lost or missing?",
        a: "If your tracking shows delivered but you haven’t received your order, please contact us within 48 hours so we can assist.",
      },
    ],
  },
];

/* --------------------------------------------
   SHIPPING ITEM
-------------------------------------------- */
const ShippingItem = ({ item, isOpen, onToggle }) => (
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
const Shipping = () => {
  const [openId, setOpenId] = useState(null);
  const [search, setSearch] = useState("");

  /* --------------------------------------------
     SEARCH FILTER
  -------------------------------------------- */
  const filteredData = useMemo(() => {
    if (!search) return shippingData;

    return shippingData
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

    shippingData.forEach((section) => {
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
     SEO SHIPPING SCHEMA
  -------------------------------------------- */
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Shipping Information",
      description:
        "Shipping details, delivery timelines, and international shipping information.",
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => document.head.removeChild(script);
  }, []);

  return (
    <>
      <SEO
        title="Shipping Information"
        description="Shipping details, delivery timelines, and international shipping information."
        url="https://yourdomain.com/shipping"
      />

      <main className="bg-[#F8F4EF] min-h-screen">
        {/* HERO */}
        <section className="max-w-6xl mx-auto px-6 pt-28 pb-16 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold tracking-tight"
          >
            Shipping Information
          </motion.h1>
          <p className="mt-6 text-neutral-600 max-w-2xl mx-auto">
            Everything you need to know about shipping, delivery times, and order tracking.
          </p>

          {/* SEARCH */}
          <div className="relative max-w-md mx-auto mt-10">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search shipping topics…"
              className="w-full pl-12 pr-4 py-3 rounded-full border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
        </section>

        {/* CONTENT */}
        <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-[220px_1fr] gap-12">
          {/* STICKY NAV */}
          <aside className="hidden md:block sticky top-32 h-fit">
            <nav className="space-y-4">
              {shippingData.map((section) => (
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

          {/* SHIPPING LIST */}
          <div>
            {filteredData.map((section) => (
              <div key={section.slug} className="mb-16">
                <h3 className="text-2xl font-semibold mb-6">
                  {section.category}
                </h3>

                {section.items.map((item) => (
                  <ShippingItem
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
    </>
  );
};

export default Shipping;

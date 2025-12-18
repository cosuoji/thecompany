import React from "react";
import { motion } from "framer-motion";
import SEO from "../Components/SEO";

const sections = [
  {
    title: "Introduction",
    content: `
At Olu The Maker, we respect your privacy and are committed to protecting
your personal information. This Privacy Policy explains how we collect,
use, and safeguard your data when you visit our website or purchase our products.
    `,
  },
  {
    title: "Information We Collect",
    content: `
We may collect the following types of information:
- Personal information you provide (name, email, shipping address, payment details)
- Usage data (pages visited, clicks, device and browser type)
- Cookies and tracking technologies to improve user experience
    `,
  },
  {
    title: "How We Use Your Information",
    content: `
Your information is used to:
- Process orders and payments
- Communicate order updates and promotional offers
- Improve website functionality and content
- Ensure security and prevent fraud
    `,
  },
  {
    title: "Sharing Information",
    content: `
We do not sell your personal data. We may share information with:
- Shipping and fulfillment partners
- Payment processors
- Legal authorities if required by law
    `,
  },
  {
    title: "Cookies & Tracking",
    content: `
Our website uses cookies and similar tracking technologies to enhance your
experience, analyze traffic, and personalize content. You can manage cookie
preferences in your browser settings.
    `,
  },
  {
    title: "Third-Party Services",
    content: `
We may integrate with third-party services such as analytics or payment
processors. These services have their own privacy policies, and we encourage
you to review them.
    `,
  },
  {
    title: "Your Rights",
    content: `
Depending on your location, you may have rights to:
- Access, correct, or delete your personal information
- Object to or restrict processing
- Withdraw consent
Contact us at support@oluthemaker.com for assistance.
    `,
  },
  {
    title: "Data Security",
    content: `
We implement reasonable technical and organizational measures to protect
your personal information against unauthorized access, loss, or misuse.
    `,
  },
  {
    title: "Children's Privacy",
    content: `
Our website is not intended for children under 13. We do not knowingly
collect personal information from children.
    `,
  },
  {
    title: "Changes to This Policy",
    content: `
We may update this Privacy Policy from time to time. Any changes will
be posted on this page with the effective date.
    `,
  },
  {
    title: "Contact Us",
    content: `
If you have questions about this Privacy Policy, please contact us at
support@oluthemaker.com.
    `,
  },
];

const Privacy = () => {
  return (
    <>
      <SEO
        title="Privacy Policy | Olu The Maker"
        description="Read how Olu The Maker collects, uses, and protects your personal information."
        url="https://yourdomain.com/privacy"
      />

      <main className="bg-[#F8F4EF] text-[#2A1E12] min-h-screen">
        {/* Header */}
        <section className="max-w-4xl mx-auto px-6 pt-32 pb-16 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold tracking-tight"
          >
            Privacy Policy
          </motion.h1>

          <p className="mt-4 text-lg text-[#4B371C] max-w-2xl mx-auto">
            Learn how we collect, use, and protect your personal information.
          </p>
        </section>

        {/* Content */}
        <section className="max-w-4xl mx-auto px-6 pb-32 space-y-10">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <h2 className="text-2xl font-semibold mb-3">
                {section.title}
              </h2>
              <p className="leading-relaxed text-[#3B2A1A] whitespace-pre-line">
                {section.content.trim()}
              </p>
            </motion.div>
          ))}
        </section>
      </main>
    </>
  );
};

export default Privacy;

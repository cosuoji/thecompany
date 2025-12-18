import React from "react";
import { motion } from "framer-motion";
import SEO from "../Components/SEO";

const sections = [
  {
    title: "Introduction",
    content: `
Welcome to Olu The Maker. These Terms and Conditions govern your use of our website,
products, and services. By accessing or using our site, you agree to be bound by these
terms. If you do not agree, please do not use our services.
    `,
  },
  {
    title: "About Olu The Maker",
    content: `
Olu The Maker is a fashion and editorial brand operating in Nigeria, offering handcrafted
footwear, printed magazines, and written editorial content through our website.
    `,
  },
  {
    title: "User Accounts",
    content: `
You may be required to create an account to access certain features of our website.
You are responsible for maintaining the confidentiality of your account information
and for all activities that occur under your account.
    `,
  },
  {
    title: "Products & Services",
    content: `
We offer physical products including shoes and magazines, as well as digital editorial
content through our blog. All product descriptions and prices are subject to change
without notice.
    `,
  },
  {
    title: "Pricing & Payments",
    content: `
All prices are displayed in the applicable currency and may change at any time.
We reserve the right to correct pricing errors and cancel orders if necessary.
    `,
  },
  {
    title: "Shipping",
    content: `
Shipping timelines, fees, and policies are outlined on our Shipping Information page.
By placing an order, you agree to the shipping terms provided at checkout.
    `,
  },
  {
    title: "Returns & Refunds",
    content: `
Shoes may be eligible for returns subject to our return policy.
Magazines and printed editorial products are non-refundable.
Please refer to our Shipping & Returns page for full details.
    `,
  },
  {
    title: "Intellectual Property",
    content: `
All content on this website — including text, images, logos, designs, and editorial
material — is the intellectual property of Olu The Maker and may not be reproduced,
distributed, or used without written permission.
    `,
  },
  {
    title: "Editorial & Blog Content",
    content: `
All blog posts, articles, and editorial materials are provided for informational and
creative purposes only. Unauthorized reproduction or commercial use is prohibited.
    `,
  },
  {
    title: "Limitation of Liability",
    content: `
Olu The Maker shall not be liable for any indirect, incidental, or consequential damages
arising from the use of our website or products to the maximum extent permitted by law.
    `,
  },
  {
    title: "Third-Party Links",
    content: `
Our website may contain links to third-party websites. We are not responsible for the
content, policies, or practices of these external sites.
    `,
  },
  {
    title: "Changes to These Terms",
    content: `
We reserve the right to update or modify these Terms and Conditions at any time.
Changes will be effective upon posting on this page.
    `,
  },
  {
    title: "Governing Law",
    content: `
These Terms and Conditions are governed by and construed in accordance with the laws
of the Federal Republic of Nigeria.
    `,
  },
  {
    title: "Contact Information",
    content: `
If you have any questions about these Terms and Conditions, please contact us at
support@oluthemaker.com.
    `,
  },
];

const Terms = () => {
  return (
    <>
      <SEO
        title="Terms & Conditions | Olu The Maker"
        description="Read the Terms and Conditions governing the use of Olu The Maker’s website, products, editorial content, and services."
        url="https://yourdomain.com/terms"
      />

      <main className="bg-[#F8F4EF] text-[#2A1E12] min-h-screen">
        {/* Header */}
        <section className="max-w-4xl mx-auto px-6 pt-32 pb-16">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold tracking-tight"
          >
            Terms & Conditions
          </motion.h1>

          <p className="mt-4 text-lg text-[#4B371C] max-w-2xl">
            Please read these terms carefully before using our website or purchasing
            our products.
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

export default Terms;

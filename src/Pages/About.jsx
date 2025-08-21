import React from 'react'
import PageTransition from '../Components/PageTransition'
import { Helmet } from 'react-helmet-async'

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us | Olú the Maker</title>
        <meta 
          name="description" 
          content="Learn more about Olú the Maker — our story, mission, and passion for crafting high-quality shoes that combine style, comfort, and durability." 
        />
        <meta name="robots" content="index, follow" />

        {/* Open Graph (for social sharing) */}
        <meta property="og:title" content="About Us | Olú the Maker" />
        <meta 
          property="og:description" 
          content="Discover the story behind Olú the Maker. We design shoes that blend fashion with comfort." 
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/about" />
        <meta property="og:image" content="https://yourdomain.com/images/about-cover.jpg" />

        {/* Structured Data - Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Olú the Maker",
            "url": "https://yourdomain.com",
            "logo": "https://yourdomain.com/images/logo.png",
            "sameAs": [
              "https://www.facebook.com/yourbrand",
              "https://www.instagram.com/yourbrand",
              "https://twitter.com/yourbrand"
            ]
          })}
        </script>
      </Helmet>

      <PageTransition>
        <section className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold mb-6">About Us</h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            At <strong>Olú the Maker</strong>, we believe shoes are more than just 
            footwear — they’re a statement of style, comfort, and identity. 
            Founded in [Year], our mission is to craft timeless designs that fit seamlessly 
            into your lifestyle.
          </p>
        </section>
      </PageTransition>
    </>
  )
}

export default About

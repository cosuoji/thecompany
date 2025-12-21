// src/Components/SEO.jsx
import { Helmet } from "react-helmet-async"

const SEO = ({
  title = "Leading Bespoke Brand in Africa",
  description = "Explore our shoe glossary, guides, and stories about footwear fashion and lifestyle. Learn everything about shoes, styles, and trends.",
  url = "https://yourdomain.com",
  image = "https://yourdomain.com/images/og-default.jpg",
}) => {
  return (
    <Helmet>
      <title>{title} | Olú the Maker</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
    </Helmet>
  )
}

export default SEO

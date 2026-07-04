import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  ogImage?: string;
  ogType?: string;
  canonicalPath?: string;
}

const SITE_NAME = 'Maharaja - Authentic Indian Fine Dining';
const SITE_URL = 'https://maharajaindiancuisine.com';
const DEFAULT_OG_IMAGE =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?fm=webp&w=1200&h=630&fit=crop&q=80';

const SEO = ({
  title,
  description,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  canonicalPath = '',
}: SEOProps) => {
  const fullTitle = title === SITE_NAME ? title : `${title} | Maharaja`;
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Maharaja" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;

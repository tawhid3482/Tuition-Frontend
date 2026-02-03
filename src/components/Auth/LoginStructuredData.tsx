// components/LoginStructuredData.tsx
export const LoginStructuredData = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Login Page",
    "description": "User login page for secure account access",
    "url": "https://yourdomain.com/login",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://yourdomain.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Login",
          "item": "https://yourdomain.com/login"
        }
      ]
    },
    "mainEntity": {
      "@type": "WebSite",
      "name": "Your Company",
      "url": "https://yourdomain.com"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};
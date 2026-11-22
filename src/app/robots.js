export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/equipment", "/how-it-works", "/about", "/contact"],
      disallow: ["/dashboard/", "/payment/"],
    },
  };
}

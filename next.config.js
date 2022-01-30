const withPWA = require("next-pwa");
const removeImports = require("next-remove-imports");

module.exports = removeImports(
  withPWA({
    images: {
      domains: ["lh3.googleusercontent.com"],
    },
    pwa: {
      dest: "public",
    },
    async redirects() {
      return [
        {
          source: "/event/:slug",
          destination: "/event/:slug/links",
          permanent: true,
        },
      ];
    },
  }),
);

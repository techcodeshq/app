const withPWA = require("next-pwa");

module.exports = withPWA({
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  pwa: {
    dest: "public",
  },
});

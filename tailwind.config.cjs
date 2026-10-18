const tokens = require("./src/generated/tokens.json");
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  // The reference supplies its own reset. Tailwind preflight would change
  // heading margins, SVG layout, borders, and button metrics.
  corePlugins: { preflight: false },
  theme: {
    screens: {
      desktop: { min: "1025px" },
      tablet: { max: "1024px" },
      mobile: { max: "767px" },
      carousel: { max: "640px" },
    },
    extend: {
      colors: Object.fromEntries(
        Object.keys(tokens)
          .filter((k) => k.startsWith("--color-"))
          .map((k) => [k.slice(8), `var(${k})`]),
      ),
      fontSize: Object.fromEntries(
        Object.keys(tokens)
          .filter((k) => k.startsWith("--text-"))
          .map((k) => [k.slice(7), `var(${k})`]),
      ),
      spacing: Object.fromEntries(
        Object.keys(tokens)
          .filter((k) => k.startsWith("--sp-"))
          .map((k) => [k.slice(5), `var(${k})`]),
      ),
      fontFamily: { reference: ["Montserrat", "sans-serif"] },
    },
  },
};

// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "3xl": "0 2px 2px 2px rgba(0, 0, 0, 0.3)",
      },
      transitionDuration: {
        500: "500ms",
      },
      scale: {
        120: "1.2",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"], // Define Poppins font here
      },
    },
  },
  plugins: [],
};

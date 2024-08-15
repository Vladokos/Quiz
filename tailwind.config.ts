import type { Config } from "tailwindcss";
import withMT from "@material-tailwind/react/utils/withMT";

const config = withMT({
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        beige: "#ede8e3",
        beige_lighter:"#EDE8E2",
        whity: "#F4F3F6",
        darkBlue: "#191D63",
        gre: "#757575"
      },
      maxWidth: {
        "1340": "1340px",
      },
      fontSize: {
        "1xl": ["22px", "22px"],
      },
    },
  },
  plugins: [],
});
export default config;

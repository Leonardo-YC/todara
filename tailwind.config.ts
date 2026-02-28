import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"], // Vital para que 'dark:hidden' funcione
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
        // Mapeamos tus variables OKLCH para que Tailwind las reconozca
  			background: "var(--background)",
  			foreground: "var(--foreground)",
  			card: {
  				DEFAULT: "var(--card)",
  				foreground: "var(--card-foreground)"
  			},
  			primary: {
  				DEFAULT: "var(--primary)",
  				foreground: "var(--primary-foreground)"
  			},
  			border: "var(--border)",
  			input: "var(--input)",
  			ring: "var(--ring)",
  		},
  		borderRadius: {
  			lg: "var(--radius)",
  			md: "calc(var(--radius) - 2px)",
  			sm: "calc(var(--radius) - 4px)"
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
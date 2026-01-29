import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* ===================================
         PRD v2.0 Design Token Extensions
         =================================== */

      colors: {
        // Primary Colors - Warm Indigo Blue
        primary: {
          50: "rgb(var(--color-primary-50) / <alpha-value>)",
          100: "rgb(var(--color-primary-100) / <alpha-value>)",
          500: "rgb(var(--color-primary-500) / <alpha-value>)",
          600: "rgb(var(--color-primary-600) / <alpha-value>)",
          700: "rgb(var(--color-primary-700) / <alpha-value>)",
        },

        // Semantic Colors
        success: "rgb(var(--color-success) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
        info: "rgb(var(--color-info) / <alpha-value>)",
        error: "rgb(var(--color-error) / <alpha-value>)",

        // Neutral Colors - Toss-style Gray
        gray: {
          50: "rgb(var(--color-gray-50) / <alpha-value>)",
          100: "rgb(var(--color-gray-100) / <alpha-value>)",
          200: "rgb(var(--color-gray-200) / <alpha-value>)",
          300: "rgb(var(--color-gray-300) / <alpha-value>)",
          400: "rgb(var(--color-gray-400) / <alpha-value>)",
          500: "rgb(var(--color-gray-500) / <alpha-value>)",
          600: "rgb(var(--color-gray-600) / <alpha-value>)",
          700: "rgb(var(--color-gray-700) / <alpha-value>)",
          800: "rgb(var(--color-gray-800) / <alpha-value>)",
          900: "rgb(var(--color-gray-900) / <alpha-value>)",
        },

        // Theme Background Colors
        bg: {
          primary: "rgb(var(--color-bg-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-bg-secondary) / <alpha-value>)",
          tertiary: "rgb(var(--color-bg-tertiary) / <alpha-value>)",
          card: "rgb(var(--color-bg-card) / <alpha-value>)",
        },

        // Text Colors
        text: {
          primary: "rgb(var(--color-text-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-text-secondary) / <alpha-value>)",
          tertiary: "rgb(var(--color-text-tertiary) / <alpha-value>)",
        },

        // Border Colors
        border: {
          DEFAULT: "rgb(var(--color-border) / <alpha-value>)",
          light: "rgb(var(--color-border-light) / <alpha-value>)",
        },

        // Accent Colors
        accent: {
          blue: "rgb(var(--color-accent-blue) / <alpha-value>)",
          "blue-hover": "rgb(var(--color-accent-blue-hover) / <alpha-value>)",
          green: "rgb(var(--color-accent-green) / <alpha-value>)",
          "green-hover": "rgb(var(--color-accent-green-hover) / <alpha-value>)",
          yellow: "rgb(var(--color-accent-yellow) / <alpha-value>)",
          red: "rgb(var(--color-accent-red) / <alpha-value>)",
        },

        // Status Colors
        status: {
          "praying-bg": "rgb(var(--color-status-praying-bg) / <alpha-value>)",
          "praying-text": "rgb(var(--color-status-praying-text) / <alpha-value>)",
          "partial-bg": "rgb(var(--color-status-partial-bg) / <alpha-value>)",
          "partial-text": "rgb(var(--color-status-partial-text) / <alpha-value>)",
          "answered-bg": "rgb(var(--color-status-answered-bg) / <alpha-value>)",
          "answered-text": "rgb(var(--color-status-answered-text) / <alpha-value>)",
        },
      },

      // Typography Scale (PRD v2.0)
      fontSize: {
        xs: ["var(--font-size-xs)", { lineHeight: "1.5" }],        // 11px - Caption
        sm: ["var(--font-size-sm)", { lineHeight: "1.5" }],        // 13px - Body Small
        base: ["var(--font-size-base)", { lineHeight: "1.5" }],    // 15px - Body
        lg: ["var(--font-size-lg)", { lineHeight: "1.5" }],        // 17px - Body Large
        xl: ["var(--font-size-xl)", { lineHeight: "1.25" }],       // 20px - Title 3
        "2xl": ["var(--font-size-2xl)", { lineHeight: "1.25" }],   // 24px - Title 2
        "3xl": ["var(--font-size-3xl)", { lineHeight: "1.25" }],   // 28px - Title 1
        "4xl": ["var(--font-size-4xl)", { lineHeight: "1.25" }],   // 34px - Display
      },

      // Font Family
      fontFamily: {
        sans: [
          "Pretendard Variable",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Roboto",
          "Helvetica Neue",
          "sans-serif",
        ],
      },

      // Font Weight
      fontWeight: {
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },

      // Spacing System (4px base)
      spacing: {
        0.5: "var(--space-1)",   // 4px
        1: "var(--space-2)",     // 8px
        1.5: "var(--space-3)",   // 12px
        2: "var(--space-4)",     // 16px
        2.5: "var(--space-5)",   // 20px
        3: "var(--space-6)",     // 24px
        4: "var(--space-8)",     // 32px
        5: "var(--space-10)",    // 40px
        6: "var(--space-12)",    // 48px
        8: "var(--space-16)",    // 64px
      },

      // Border Radius (Toss-style rounded corners)
      borderRadius: {
        sm: "var(--radius-sm)",      // 8px
        md: "var(--radius-md)",      // 12px
        lg: "var(--radius-lg)",      // 16px
        xl: "var(--radius-xl)",      // 20px
        "2xl": "var(--radius-2xl)",  // 24px
        full: "var(--radius-full)",  // 9999px
      },

      // Box Shadow (Toss-style Elevation)
      boxShadow: {
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow-md)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
      },

      // Animation
      animation: {
        shimmer: "var(--animate-shimmer)",
        "pray-pulse": "var(--animate-pray-pulse)",
      },

      // Backdrop Blur (for glass effect)
      backdropBlur: {
        glass: "12px",
      },
    },
  },
  plugins: [],
};

export default config;

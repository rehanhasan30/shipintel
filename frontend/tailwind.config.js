/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#004ac6",
        "primary-container": "#2563eb",
        "on-primary": "#ffffff",
        "primary-fixed": "#dbe1ff",
        "on-primary-fixed-variant": "#003ea8",
        
        "secondary": "#9d4300",
        "secondary-container": "#fd761a",
        "on-secondary": "#ffffff",
        "secondary-fixed": "#ffdbca",
        "on-secondary-fixed-variant": "#783200",
        
        "tertiary": "#4d556b",
        "tertiary-container": "#656d84",
        "on-tertiary": "#ffffff",
        "tertiary-fixed": "#dae2fd",
        "on-tertiary-fixed-variant": "#3f465c",
        
        "background": "#f7f9fb",
        "on-background": "#191c1e",
        
        "surface": "#f7f9fb",
        "surface-bright": "#f7f9fb",
        "surface-dim": "#d8dadc",
        "surface-container": "#eceef0",
        "surface-container-low": "#f2f4f6",
        "surface-container-lowest": "#ffffff",
        "surface-container-high": "#e6e8ea",
        "surface-container-highest": "#e0e3e5",
        
        "on-surface": "#191c1e",
        "on-surface-variant": "#434655",
        
        "outline": "#737686",
        "outline-variant": "#c3c6d7",
        
        "error": "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "margin-desktop": "32px",
        "margin-mobile": "16px",
        "stack-xs": "4px",
        "stack-sm": "8px",
        "stack-md": "16px",
        "stack-lg": "24px",
        "stack-xl": "48px",
        "gutter": "24px",
        "container-max": "1280px",
        "unit": "4px",
      },
      fontFamily: {
        "body-lg": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
        "display-lg": ["Inter", "sans-serif"],
        "headline-lg": ["Inter", "sans-serif"],
        "headline-md": ["Inter", "sans-serif"],
        "headline-sm": ["Inter", "sans-serif"],
        "label-md": ["Inter", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"],
        "mono-sm": ["monospace"],
      },
      fontSize: {
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-sm": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "label-md": ["14px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "500" }],
        "label-sm": ["12px", { lineHeight: "16px", fontWeight: "600" }],
        "mono-sm": ["13px", { lineHeight: "20px", fontWeight: "400" }],
      }
    },
  },
  plugins: [],
}

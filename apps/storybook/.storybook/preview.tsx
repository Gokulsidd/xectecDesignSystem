import type { Preview } from "@storybook/react";

// Import design tokens CSS — this applies all CSS variables globally
import "@xectec/tokens/tokens.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true,
    },
    viewport: {
      viewports: {
        mobile: {
          name: "Mobile (iPhone SE)",
          styles: { width: "375px", height: "667px" },
          type: "mobile",
        },
        tablet: {
          name: "Tablet (iPad)",
          styles: { width: "768px", height: "1024px" },
          type: "tablet",
        },
        laptop: {
          name: "Laptop (Small screen)",
          styles: { width: "1024px", height: "768px" },
          type: "desktop",
        },
        desktop: {
          name: "Desktop (Large screen)",
          styles: { width: "1440px", height: "900px" },
          type: "desktop",
        },
      },
    },
  },
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme for components",
      defaultValue: "light",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "light", icon: "sun", title: "Light" },
          { value: "dark", icon: "moon", title: "Dark" },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals["theme"] as string ?? "light";

      // Apply data-theme to the html element for CSS variable switching
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-theme", theme);
        document.body.style.backgroundColor = "var(--color-bg)";
      }

      return (
        <div
          data-theme={theme}
          style={{
            padding: "2rem",
            minHeight: "100vh",
            backgroundColor: "var(--color-bg)",
            fontFamily: "var(--font-family-sans)",
          }}
        >
          <Story />
        </div>
      );
    },
  ],
};

export default preview;

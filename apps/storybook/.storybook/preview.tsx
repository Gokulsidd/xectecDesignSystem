import type { Preview } from "@storybook/react";

// Import base design tokens CSS — this applies all CSS variables globally
import "@xectec/tokens/tokens.css";

// Import client theme CSS files as raw strings via Vite's ?inline query.
// This bundles them at build time, so they are always available regardless
// of how/where Storybook is served.
// @ts-expect-error — Vite ?inline import, no type declaration needed
import corientCss from "@xectec/themes/corient.css?inline";
// @ts-expect-error — Vite ?inline import
import thaiCss from "@xectec/themes/thai.css?inline";

const CLIENT_CSS: Record<string, string> = {
  xectec:  "",        // default Xectec/XT — no overrides
  corient: corientCss as string,
  thai:    thaiCss    as string,
};

const STYLE_TAG_ID = "xectec-client-theme";

/** Inject (or remove) the client theme <style> tag. */
function applyClientTheme(clientId: string): void {
  if (typeof document === "undefined") return;

  let styleEl = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null;

  const css = CLIENT_CSS[clientId] ?? "";

  if (!css) {
    // Remove any existing override — fall back to default Xectec tokens
    styleEl?.remove();
    return;
  }

  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = STYLE_TAG_ID;
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = css;
}

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
      name: "Mode",
      description: "Light / Dark display mode",
      defaultValue: "light",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "light", icon: "sun",  title: "Light" },
          { value: "dark",  icon: "moon", title: "Dark"  },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
    clientTheme: {
      name: "Client",
      description: "Active client brand theme (color set)",
      defaultValue: "xectec",
      toolbar: {
        icon: "paintbrush",
        items: [
          { value: "xectec",  title: "🔵  Xectec / XT (default)" },
          { value: "corient", title: "⚫  Corient" },
          { value: "thai",    title: "🟣  Thai" },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme       = (context.globals["theme"]       as string) ?? "light";
      const clientTheme = (context.globals["clientTheme"] as string) ?? "xectec";

      // Apply data-theme attribute to <html> for light/dark CSS variable switching
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-theme", theme);
        document.body.style.backgroundColor = "var(--color-bg)";
      }

      // Inject / swap the client theme <style> tag
      applyClientTheme(clientTheme);

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

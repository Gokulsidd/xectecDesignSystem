import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";

// __dirname = apps/storybook/.storybook/
const repoRoot         = path.resolve(__dirname, "../../..");
const uiPackageSrc     = path.resolve(repoRoot, "packages/ui/src");
const tokensPackageSrc = path.resolve(repoRoot, "packages/tokens/src");

const config: StorybookConfig = {
  stories: [
    {
      directory: uiPackageSrc,
      files: "**/*.stories.@(ts|tsx|mdx)",
      titlePrefix: "",
    },
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  viteFinal: (config) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          // Workspace package aliases — point Vite directly to TypeScript source
          "@xectec/ui": uiPackageSrc,
          "@xectec/tokens": tokensPackageSrc,
        },
      },
    };
  },
};

export default config;

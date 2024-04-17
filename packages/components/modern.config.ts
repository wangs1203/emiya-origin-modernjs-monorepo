import { moduleTools, defineConfig } from '@modern-js/module-tools';
import { tailwindcssPlugin } from '@modern-js/plugin-tailwindcss';
import { testingPlugin } from '@modern-js/plugin-testing';
// @ts-expect-error
import { modulePluginDoc } from '@modern-js/plugin-rspress';

export default defineConfig({
  plugins: [
    moduleTools(),
    tailwindcssPlugin(),
    testingPlugin(),
    modulePluginDoc(),
  ],
  buildPreset: 'npm-component',
});

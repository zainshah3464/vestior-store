import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // ─────────────────────────────────────────────────────────────
  // Project overrides
  // ─────────────────────────────────────────────────────────────
  {
    rules: {
      // Aesthetic-only rule
      'react/no-unescaped-entities': 'off',

      // React 19 new rules — several false positives in this codebase:
      //   • set-state-in-effect: our effects are legit setup (animation shapes)
      //   • refs: scroll refs are read inside callbacks, not during render
      //   • immutability: cart loadCart pattern is a valid idiom
      // We rely on careful code review instead of these strict rules.
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/immutability': 'off',

      // We use plain <img> in emails, admin tables, cart thumbs
      '@next/next/no-img-element': 'off',

      // Downgrade "any" to warning — used sparingly for external payloads
      '@typescript-eslint/no-explicit-any': 'warn',

      // Unused vars: warn with `_`-prefix ignore pattern
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      '@next/next/no-html-link-for-pages': 'warn',
      'prefer-const': 'warn',
    },
  },

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage/**",
    "test-results/**",
    "playwright-report/**",
  ]),
]);

export default eslintConfig;
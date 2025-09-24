// eslint.config.cjs
const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const importPlugin = require("eslint-plugin-import");
const sonarjs = require("eslint-plugin-sonarjs");
const security = require("eslint-plugin-security");
const prettier = require("eslint-plugin-prettier");

module.exports = (async () => {
  const nestjsTyped = await import("@darraghor/eslint-plugin-nestjs-typed");

  return [
    js.configs.recommended,

    // typescript-eslint v7 configs
    ...(tseslint.configs?.recommended ?? []),
    ...(tseslint.configs?.recommendedTypeChecked ?? []),

    // Main source files
    {
      files: ["src/**/*.ts", "apps/**/*.ts", "libs/**/*.ts", "test/**/*.ts"],
      languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
          project: "./tsconfig.json",
          tsconfigRootDir: __dirname,
        },
      },
      plugins: {
        "@darraghor/nestjs-typed": nestjsTyped,
        import: importPlugin,
        sonarjs,
        security,
        prettier,
      },
      rules: {
        // TypeScript / NestJS best practices
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        "@typescript-eslint/no-explicit-any": "warn",

        // Import rules
        "import/order": [
          "error",
          {
            groups: ["builtin", "external", "internal", ["parent", "sibling", "index"]],
            "newlines-between": "always",
          },
        ],
        "import/no-default-export": "error",

        // SonarJS / Security
        "sonarjs/no-duplicate-string": "warn",
        "security/detect-object-injection": "off",

        // General JS rules
        "no-console": ["warn", { allow: ["warn", "error"] }],
        "no-nested-ternary": "error",

        // Prettier integration
        "prettier/prettier": "error",
      },
      ignores: [
        "dist/",
        "node_modules/",
        "*.config.*",
        "src/utils/generated-types/*",
      ],
    },

    // Test overrides
    {
      files: ["**/*.spec.ts", "**/*_test_.ts"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
      },
    },
  ];
})();
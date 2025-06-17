/**
 * @type {import("prettier").Config}
 */
const config = {
  singleQuote: true,
  jsxSingleQuote: true,
  semi: false,
  tabWidth: 2,
  bracketSpacing: true,
  bracketSameLine: true,
  arrowParens: 'always',
  trailingComma: 'none',
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindFunctions: ['clsx', 'twMerge']
}

export default config

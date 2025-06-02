module.exports = [
  {
    ignores: [
      "node_modules/**",
      "**/*.min.js",
      "**/*.min.css",
      "assets/**",
      "config/**",
      "locales/**",
      "templates/**",
      "sections/**",
      "snippets/**",
      "layout/**",
      "vendor/**"
    ]
  },
  {
    files: ["*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        gsap: "readonly",
        Shopify: "readonly",
        module: "readonly",
        require: "readonly",
        process: "readonly"
      }
    },
    rules: {
      "indent": ["error", 2],
      "linebreak-style": ["error", "unix"],
      "quotes": ["error", "single"],
      "semi": ["error", "always"]
    }
  }
]; 
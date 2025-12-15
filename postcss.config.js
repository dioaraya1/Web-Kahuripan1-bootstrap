const postcssImport = require("postcss-import");
const postcssNested = require("postcss-nested");
const postcssMixins = require("postcss-mixins");
const autoprefixer = require("autoprefixer");
const postcssPresetEnv = require("postcss-preset-env");
const cssnano = require("cssnano");

// Hanya load purgecss di production
let purgecss = null;
if (process.env.NODE_ENV === "production") {
  purgecss = require("@fullhuman/postcss-purgecss");
}

const plugins = [
  // 1. Import harus pertama
  postcssImport({
    path: ["src/postcss", "node_modules"],
  }),

  // 2. Mixins
  postcssMixins(),

  // 3. Nested CSS
  postcssNested(),

  // 4. Modern CSS features
  postcssPresetEnv({
    stage: 3,
    features: {
      "nesting-rules": true,
      "custom-media-queries": true,
      "custom-properties": {
        preserve: false,
      },
      "color-function": true,
    },
  }),

  // 5. Auto prefixer
  autoprefixer({
    overrideBrowserslist: ["> 0.5% in ID", "last 2 versions", "not dead"],
    flexbox: "no-2009",
  }),
];

// Tambahkan purgecss hanya di production
if (process.env.NODE_ENV === "production" && purgecss) {
  plugins.push(
    purgecss({
      content: ["./dist/**/*.html", "./src/**/*.js", "./src/**/*.vue"],
      defaultExtractor: (content) => {
        const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
        const innerMatches =
          content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];
        return broadMatches.concat(innerMatches);
      },
      safelist: {
        standard: [
          "active",
          "show",
          "hide",
          "fade",
          "collapsing",
          "modal-backdrop",
          "carousel-item",
          "carousel-inner",
          "carousel-control-prev",
          "carousel-control-next",
          "carousel-control-prev-icon",
          "carousel-control-next-icon",
          /^col-/,
          /^row-/,
          /^btn-/,
          /^nav-/,
          /^navbar-/,
          /^dropdown-/,
          /^bg-/,
          /^text-/,
          /^border-/,
          /^rounded-/,
          /^shadow-/,
          /^m-/,
          /^p-/,
          /^d-/,
          /^fs-/,
          /^fw-/,
          /^lh-/,
          /^opacity-/,
          /^translate-/,
        ],
        deep: [/modal/, /tooltip/, /popover/, /carousel/, /offcanvas/],
        greedy: [/data-bs-/, /aria-/, /role/],
      },
      variables: true,
    })
  );

  // Tambahkan CSS minification
  plugins.push(
    cssnano({
      preset: [
        "default",
        {
          discardComments: {
            removeAll: true,
          },
        },
      ],
    })
  );
}

module.exports = {
  plugins,
};

module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
    [
      "component",
      {
        "libraryName": "butterjs-sdk",
        "styleLibraryName": "es"
      }
    ]
  ]
};

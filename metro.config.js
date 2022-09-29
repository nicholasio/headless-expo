// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const headlessConfig = require('./headless.config');

const config = getDefaultConfig(__dirname);

config.transformer.minifierConfig.compress.global_defs = {
    "__10up__HEADLESS_CONFIG": headlessConfig,
    "@alert": "console.log"
}; 

console.log(config.transformer);
module.exports = config;

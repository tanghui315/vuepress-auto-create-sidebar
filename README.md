# vuepress-auto-create-sidebar


vuepress-auto-create-sidebar is a simple sidebar automating tool for Vuepress.

It looks for folders with README's in the folder vuepress was run in. 
If a base-option was supplied in config.js, it will instead look in the specified directory.

Only supports .md files named README. 

## Install

```bash
npm install vuepress-auto-create-sidebar
```

## Usage
config.js
```javascript
const sidebar = require('vuepress-auto-create-sidebar')

module.exports = {
    ...
    themeConfig: {
        sidebar: sidebar.getSidebar()
    ...
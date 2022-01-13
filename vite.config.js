import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { resolve } from 'path'
import path from 'path'
import { readdirSync } from 'fs'

// const paths = {
//   "@/*": ["./src/*"]
// }

// const alias = Object.entries(paths)
// .reduce((acc,[key, [value]]) => {
//   const aliasKey = key.substring(0, key.length - 2)
//   const path = value.substring(0, value.length - 2)
//   return {
//     ...acc,
//     [aliasKey]: resolve(__dirname, path)
//   }
// }, {})

const absolutePathAliases = {};
// Root resources folder
const srcPath = path.resolve('./src/');
// Ajust the regex here to include .vue, .js, .jsx, etc.. files from the resources/ folder
const srcRootContent = readdirSync(srcPath, { withFileTypes: true }).map((dirent) => dirent.name.replace(/(\.js){1}(x?)/, ''));

srcRootContent.forEach((directory) => {
  absolutePathAliases[directory] = path.join(srcPath, directory);
})

const alias = {
  ...absolutePathAliases,
  "node_modules": path.resolve(__dirname, "./node_modules/")
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias
  },
  define: {
    'process.env': {},
    'global': {},
  }
})

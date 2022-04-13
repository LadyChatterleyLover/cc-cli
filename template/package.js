function packageTemplate() {
  return `
    "scripts": {
      "dev": "vite",
      "build": "vue-tsc --noEmit && vite build",
      "preserve": "vite build",
      "serve": "vite preview --port 5050",
      "typecheck": "vue-tsc --noEmit"
    },
    "dependencies": {
      "@types/nprogress": "^0.2.0",
      "axios": "^0.24.0",
      "nprogress": "^0.2.0",
      "vue": "^3.2.14",
      "vue-router": "^4.0.11",
      "vuex": "^4.0.2"
    },
    "devDependencies": {
      "@vitejs/plugin-vue": "^1.9.3",
      "@vitejs/plugin-vue-jsx": "^1.2.0",
      "sass": "^1.43.4",
      "sass-loader": "^12.3.0",
      "typescript": "~4.3.5",
      "vite": "^2.6.3",
      "vue-tsc": "^0.3.0"
    }
  `
}
module.exports = {
  packageTemplate      
}
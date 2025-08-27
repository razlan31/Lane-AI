#!/bin/bash
set -e

echo "🚀 Cleaning old configs..."
rm -f package.json vite.config.js tailwind.config.js postcss.config.js tsconfig.json tsconfig.node.json

echo "📦 Creating package.json..."
cat > package.json <<'JSON'
{
  "name": "lane-ai",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.3",
    "vite": "^5.4.0"
  }
}
JSON

echo "⚙️ Creating vite.config.js..."
cat > vite.config.js <<'JS'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src"
    }
  }
});
JS

echo "🎨 Creating tailwind.config.js..."
cat > tailwind.config.js <<'JS'
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
JS

echo "🌀 Creating postcss.config.js..."
cat > postcss.config.js <<'JS'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
JS

echo "📐 Creating tsconfig.json..."
cat > tsconfig.json <<'JSON'
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
JSON

echo "📐 Creating tsconfig.node.json..."
cat > tsconfig.node.json <<'JSON'
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.js"]
}
JSON

echo "🖌️ Ensuring src/index.css exists..."
cat > src/index.css <<'CSS'
@tailwind base;
@tailwind components;
@tailwind utilities;
CSS

echo "🧹 Cleaning node_modules and lock file..."
rm -rf node_modules package-lock.json

echo "📥 Installing dependencies..."
npm install

echo "✅ Setup complete. Run 'npm run dev' to start the app."

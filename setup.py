import os

# ============================================================
# MediChain Healthcare Frontend - Python Setup Script
# ============================================================

print("\n🏥 MediChain Healthcare Frontend Setup\n")

# ------------------------------------------------------------
# 1️⃣  Create folder structure
# ------------------------------------------------------------
print("📁 Creating folder structure...")

folders = [
    "src/api",
    "src/components",
    "src/pages",
    "src/context",
    "src/hooks",
    "src/utils"
]

for folder in folders:
    os.makedirs(folder, exist_ok=True)
    print(f"   ✓ Created {folder}")

# ------------------------------------------------------------
# 2️⃣  Create configuration files
# ------------------------------------------------------------
print("\n⚙️  Creating configuration files...")

tailwind_config = """\
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
"""
with open("tailwind.config.js", "w", encoding="utf-8") as f:
    f.write(tailwind_config)
print("   ✓ Created tailwind.config.js")

postcss_config = """\
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
"""
with open("postcss.config.js", "w", encoding="utf-8") as f:
    f.write(postcss_config)
print("   ✓ Created postcss.config.js")

env_file = "VITE_API_BASE_URL=http://localhost:5000\n"
with open(".env", "w", encoding="utf-8") as f:
    f.write(env_file)
print("   ✓ Created .env")

# ------------------------------------------------------------
# 3️⃣  Create/Update index.css
# ------------------------------------------------------------
index_css = """\
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
"""
with open("src/index.css", "w", encoding="utf-8") as f:
    f.write(index_css)
print("   ✓ Created src/index.css")

# ------------------------------------------------------------
# 4️⃣  Create main.jsx
# ------------------------------------------------------------
main_jsx = """\
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
"""
with open("src/main.jsx", "w", encoding="utf-8") as f:
    f.write(main_jsx)
print("   ✓ Created src/main.jsx")

# ------------------------------------------------------------
# 5️⃣  Create .gitignore
# ------------------------------------------------------------
gitignore = """\
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment
.env
.env.local
.env.*.local
"""
with open(".gitignore", "w", encoding="utf-8") as f:
    f.write(gitignore)
print("   ✓ Created .gitignore")

# ------------------------------------------------------------
# ✅ DONE!
# ------------------------------------------------------------
print("\n✅ Setup complete!")
print("\n📝 Next steps:")
print("   1. Copy all component files into their respective folders")
print("   2. Copy App.jsx to src/App.jsx")
print("   3. Run: npm run dev")
print("   4. Open http://localhost:5173 in your browser")

print("\n💡 File locations:")
print("   • API files → src/api/")
print("   • Components → src/components/")
print("   • Pages → src/pages/")
print("   • Context → src/context/")
print("   • Utils → src/utils/")

print("\n🔗 Backend should be running on: http://localhost:5000\n")

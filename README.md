# Nishikigoi Heritage - Professional Forum

A professional forum dedicated to Nishikigoi heritage, built with React, TypeScript, and Vite.

## Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- npm

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
Start the development server:
```bash
npm run dev
```

### Building
Build for production:
```bash
npm run build
```

### Linting
Run ESLint:
```bash
npm run lint
```

## Deployment

This project is configured to deploy to GitHub Pages automatically via GitHub Actions.

1. Push changes to `main` branch.
2. Set the `VITE_GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API keys
3. The `Deploy to GitHub Pages` workflow (in `.github/workflows/deploy.yml`) will run automatically.
4. Go to repository Settings -> Pages to verify the deployment URL.

## Configuration

- **.gitignore**: Optimized for React/Vite, including environment variables and system files.
- **ESLint**: configured in `eslint.config.js` for code quality.

/**
 * Side-effect stylesheet imports. Next.js ships a declaration for
 * `*.module.css` but not for global stylesheets, so `import './globals.css'`
 * has no type under moduleResolution: "bundler".
 */
declare module '*.css';

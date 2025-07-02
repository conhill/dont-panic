# DON'T PANIC 🚀

An interactive portfolio website inspired by *The Hitchhiker's Guide to the Galaxy*. This desktop-first experience features advanced menu animations, space-themed design, and smooth transitions powered by anime.js.

## ✨ Features

- **Interactive Menu System**: Animated navigation with smooth transitions and hover effects
- **Space-Themed Design**: Cosmic background with particle animations and galaxy imagery
- **Advanced Animations**: Powered by anime.js for smooth, performant transitions
- **Desktop-First**: Optimized for desktop viewing with mobile warning overlay
- **Portfolio Sections**: Showcases work, skills, and projects with animated reveals
- **Responsive Typography**: Custom fonts (Seconda Round) for a unique aesthetic

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3/SCSS, JavaScript (ES6+)
- **Animations**: anime.js, jQuery
- **Build Tools**: Sass, Browserify
- **Deployment**: GitHub Pages ready

## 📁 Project Structure

```
dont-panic/
├── index.html              # Main HTML file
├── index.js                # Main JavaScript entry point
├── timelines.js            # Animation timeline definitions
├── utils.js                # Utility functions
├── bundle.js               # Compiled JavaScript bundle
├── anime.min.js            # Animation library
├── package.json            # Project dependencies
├── README.md               # This file
├── css/
│   ├── styles.css          # Compiled CSS
│   ├── styles.css.map      # Source map
│   └── styles.scss         # Main SCSS file
├── fonts/
│   ├── SecondaRound-Bold.ttf
│   └── SecondaRound-Regular.ttf
└── images/
    ├── 3dprint.png
    ├── about-me.png
    ├── bottom.png
    ├── coding.png
    ├── nyc.png
    └── work.png
```

## 🚀 Getting Started

### Prerequisites

- Node.js (for development)
- npm or yarn
- Sass compiler
- Browserify (for bundling)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/dont-panic.git
cd dont-panic
```

2. Install dependencies:
```bash
npm install
```

3. Install global tools (if not already installed):
```bash
npm install -g sass browserify
```

### Development

#### Compiling SCSS
```bash
sass css/styles.scss css/styles.css --watch
```

#### Bundling JavaScript
```bash
browserify index.js -o bundle.js
```

#### Development Server
Open `index.html` in your browser or use a local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server
```

## 🌐 Deployment to GitHub Pages

### Method 1: Manual Deployment

1. **Build the project**:
```bash
# Compile SCSS
sass css/styles.scss css/styles.css

# Bundle JavaScript
browserify index.js -o bundle.js
```

2. **Commit all files**:
```bash
git add .
git commit -m "Build assets for deployment"
git push origin main
```

3. **Enable GitHub Pages**:
   - Go to your repository settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Save

### Method 2: GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
    
    - name: Install dependencies
      run: |
        npm install -g sass browserify
    
    - name: Build project
      run: |
        sass css/styles.scss css/styles.css
        browserify index.js -o bundle.js
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Menu animations not working
- Ensure `anime.min.js` is loaded before other scripts
- Check browser console for JavaScript errors
- Verify CSS transforms are not conflicting

#### 2. Fonts not loading
- Ensure font files are in the correct path (`fonts/`)
- Check CORS settings if using a local server
- Verify font-face declarations in CSS

#### 3. GitHub Pages deployment issues
- Ensure `bundle.js` and `styles.css` are committed
- Check that all asset paths are relative
- Verify repository settings for GitHub Pages

#### 4. Mobile warning not appearing
- Check viewport meta tag in HTML
- Verify JavaScript is not blocked
- Test on actual mobile device, not just browser dev tools

### Build Issues

#### SCSS compilation errors
```bash
# Check for syntax errors
sass css/styles.scss css/styles.css --check

# Compile with error output
sass css/styles.scss css/styles.css --verbose
```

#### JavaScript bundling errors
```bash
# Check for syntax errors
node -c index.js

# Bundle with debug output
browserify index.js -o bundle.js --debug
```

## 🎨 Customization

### Modifying Animations
Edit `timelines.js` to adjust animation parameters:
- Duration: Change `duration` values
- Easing: Modify `easing` functions
- Delays: Adjust `delay` properties

### Styling Changes
Edit `css/styles.scss` and recompile:
```bash
sass css/styles.scss css/styles.css
```

### Adding New Sections
1. Update HTML structure in `index.html`
2. Add corresponding animations in `timelines.js`
3. Update styles in `css/styles.scss`
4. Rebuild assets

## 📱 Mobile Experience

This project is designed desktop-first. Mobile users will see a warning overlay encouraging them to view on desktop for the best experience. The overlay can be customized in the CSS and JavaScript files.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Build and test
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🌟 Acknowledgments

- Inspired by *The Hitchhiker's Guide to the Galaxy* by Douglas Adams
- Built with [anime.js](https://animejs.com/) for smooth animations
- Space imagery and design elements from various sources

---

*"Don't panic! This portfolio is mostly harmless."* 🌌
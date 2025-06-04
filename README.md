# Don't Panic

A playful, animated menu UI inspired by "The Hitchhiker's Guide to the Galaxy."  
Built with anime.js, jQuery, and SCSS.

---

## Features

- Animated, interactive menu system with "tube" and "warning" effects
- Smooth, physics-inspired transitions and hover effects
- Dynamic info panels that update based on user selection
- Modular code structure for easy extension

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone this repository:
    ```sh
    git clone https://github.com/your-username/dont-panic.git
    cd dont-panic
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

---

## Development

- Main source files:  
  - JavaScript: `index.js`, `timelines.js`, `utils.js`
  - Styles: `css/styles.scss`
  - Entry HTML: `index.html`
- Edit SCSS and JS files as needed.
- Run a local server or open `index.html` in your browser to view the UI.

---

## Build

To compile the JavaScript and SCSS:

```sh
npm run build
```

- This will:
  - Compile `css/styles.scss` to `css/styles.css`
  - Bundle your JS with Browserify into `bundle.js`

---

## Running Locally

You can use any static server. For example, with [http-server](https://www.npmjs.com/package/http-server):

```sh
npx http-server .
```

Then open [http://localhost:8080](http://localhost:8080) in your browser.

---

## Scripts

- `npm run build` — Compile and bundle JS/CSS for production

---

## Customization

- Update the info panel content and images in `index.html` and via the mapping in `utils.js`.
- Adjust animation timings and effects in `timelines.js`.
- SCSS variables for menu and color themes are in `css/styles.scss`.

---

## License

MIT

---

**Don't Panic!**

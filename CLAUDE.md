# draw.io Tools - Developer Guide

This document provides guidance for AI assistants and developers working on this repository.

## Project Overview

**draw.io Tools** is a collection of web-based utilities for working with draw.io diagrams. The tools are built as static HTML files with vanilla JavaScript and can be hosted on any static web server (including GitHub Pages) **without any build step**.

## Repository Structure

```
drawio-tools/
├── index.html          # Landing page with tool picker
├── styles/             # CSS styles
│   ├── main.css        # Main stylesheet (imports all)
│   ├── variables.css   # CSS custom properties
│   ├── base.css        # Reset and base styles
│   └── components.css  # Reusable component styles
├── utils/              # Shared JavaScript utilities
│   └── drawio-tools.js # Combined utility library (global namespace)
├── assets/             # Static assets
│   ├── logo.svg        # draw.io logo
│   └── favicon.svg     # Favicon
├── tools/              # Individual tool pages
│   ├── text-tools.html # Text encoding/decoding
│   ├── mxfile-tools.html # MxFile validation
│   ├── generate.html   # AI diagram generation
│   ├── base64.html     # Image to Base64
│   ├── viewer.html     # Diagram viewer
│   ├── csv.html        # CSV import
│   ├── link.html       # Custom links builder
│   ├── merge.html      # Image merge
│   └── convert.html    # Redirect to text-tools.html (backward compat)
├── package.json        # npm metadata (no dependencies required)
└── CLAUDE.md           # This file
```

## Technology Stack

- **No Build Required**: Pure static HTML/CSS/JS
- **JavaScript**: Vanilla JS with IIFE pattern, no ES modules
- **CSS**: CSS Custom Properties with light/dark mode via `@import`
- **Compression**: pako library loaded from CDN
- **Global Namespace**: `window.DrawioTools` for shared utilities

## Development

### Getting Started

No installation or build step required. Simply:

1. Open any HTML file directly in your browser, OR
2. Serve with any static server:
   ```bash
   # Python
   python -m http.server 8080

   # Node.js (npx)
   npx serve .

   # VS Code Live Server extension
   ```

### Key Patterns

1. **IIFE Pattern**: All JavaScript uses Immediately Invoked Function Expressions
2. **Global Namespace**: Utilities exposed via `window.DrawioTools`
3. **CSS Variables**: Use CSS custom properties from `variables.css`
4. **Dark Mode**: Automatic via `prefers-color-scheme` media query
5. **CDN Loading**: pako loaded from cdnjs before drawio-tools.js

### Code Style

- Use 2-space indentation
- Use single quotes for JavaScript strings (except in HTML attributes)
- Use `var` for compatibility (no `const`/`let`)
- Functions should have comments for clarity
- Prefer vanilla JS over modern syntax for browser compatibility

## Key Concepts

### MxFile Format

draw.io uses an XML-based format called mxfile:

```xml
<mxfile>
  <diagram name="Page-1">
    <!-- Base64 encoded, deflated, URL-encoded content -->
  </diagram>
</mxfile>
```

The diagram content is processed through this pipeline:
1. XML → URL encode → Deflate compress → Base64 encode
2. Decoding reverses the process

### Utility Functions (window.DrawioTools)

**Encoding Functions**:
- `encode(data, options)` - Full encoding pipeline
- `decode(data, options)` - Full decoding pipeline
- `urlEncode(data)` / `urlDecode(data)` - URL encoding
- `base64Encode(data)` / `base64Decode(data)` - Base64 encoding
- `deflate(data)` / `inflate(data)` - Deflate compression

**MxFile Functions**:
- `validateMxFile(content)` - Returns validation errors
- `correctMxFile(content)` - Attempts to fix corrupted files
- `getMxFileInfo(content)` - Extract metadata
- `isMxFile(content)` - Check if content is valid mxfile
- `getDiagramNames(content)` - Get page names

**File Functions**:
- `setupDropZone(element, onDrop)` - Drag and drop handler
- `downloadFile(content, filename)` - Trigger file download
- `copyToClipboard(text)` - Copy to clipboard
- `readFileAsText(file)` - Read file as text
- `readFileAsDataURL(file)` - Read file as data URL

**Text Functions**:
- `formatXml(xml)` - Pretty-print XML
- `normalizeXml(xml)` - Minify XML
- `formatJson(json)` - Pretty-print JSON
- `normalizeJson(json)` - Minify JSON
- `escapeString(str)` / `unescapeString(str)` - Escape sequences

## Adding New Tools

1. Create HTML file in `tools/`
2. Use the standard page structure (see existing tools)
3. Include scripts at the end of body:
   ```html
   <script src="https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js"></script>
   <script src="../utils/drawio-tools.js"></script>
   <script>
     (function() {
       var DT = window.DrawioTools;
       // Tool logic here
     })();
   </script>
   ```
4. Add link in `index.html` landing page
5. Update this documentation

### Tool Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tool Name - draw.io Tools</title>
  <link rel="icon" type="image/svg+xml" href="../assets/favicon.svg">
  <link rel="stylesheet" href="../styles/main.css">
</head>
<body>
  <div class="page">
    <header class="header"><!-- Standard header --></header>
    <main class="main-content">
      <div class="container tool-page">
        <!-- Tool content -->
      </div>
    </main>
    <footer class="footer"><!-- Standard footer --></footer>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js"></script>
  <script src="../utils/drawio-tools.js"></script>
  <script>
    (function() {
      var DT = window.DrawioTools;
      // Tool logic
    })();
  </script>
</body>
</html>
```

## Backward Compatibility

Old URLs are preserved:
- `/tools/convert.html` → redirects to `/tools/text-tools.html`

## Testing

No automated tests. Test manually by:
1. Opening HTML files directly in browser
2. Testing each tool with various inputs
3. Verifying encoding/decoding roundtrip
4. Testing file drag-and-drop
5. Checking dark mode appearance
6. Testing in different browsers

## Deployment

The site is fully static and can be deployed anywhere:

- **GitHub Pages**: Deploy root directory directly
- **Netlify/Vercel**: Point to root as publish directory
- **Any Web Server**: Copy all contents

No build step required.

## Common Issues

1. **pako not loading**: Ensure CDN script is included before drawio-tools.js
2. **Path issues**: Tools use `../assets/`, `../styles/`, `../utils/` (relative to tools/)
3. **CORS errors**: AI tools need valid API keys and may have CORS restrictions
4. **Dark mode flickering**: CSS uses system preference, no JS toggle needed

## Links

- [draw.io](https://www.drawio.com)
- [draw.io GitHub](https://github.com/jgraph/drawio)
- [Pako Library](https://github.com/nodeca/pako)

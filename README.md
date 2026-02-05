# draw.io Tools

A collection of web-based utilities for working with [draw.io](https://www.drawio.com) diagrams.

**[View the Tools →](https://jgraph.github.io/drawio-tools/)**

## Tools

### Text & Encoding
- **[Text Tools](https://jgraph.github.io/drawio-tools/tools/text-tools.html)** - Compress, decompress, encode, and decode text using URL encoding, Base64, and deflate compression
- **[Base64 Images](https://jgraph.github.io/drawio-tools/tools/base64.html)** - Convert images to Base64 data URLs for embedding

### Diagram Files
- **[MxFile Tools](https://jgraph.github.io/drawio-tools/tools/mxfile-tools.html)** - Validate and repair draw.io diagram files
- **[Diagram Viewer](https://jgraph.github.io/drawio-tools/tools/viewer.html)** - View diagrams from public URLs and generate embeddable links
- **[Image Merge](https://jgraph.github.io/drawio-tools/tools/merge.html)** - Stack multiple images vertically

### Generation & Import
- **[AI Generate](https://jgraph.github.io/drawio-tools/tools/generate.html)** - Generate diagrams from natural language using AI (ChatGPT, Claude, Gemini)
- **[CSV Import](https://jgraph.github.io/drawio-tools/tools/csv.html)** - Convert CSV data into draw.io diagrams
- **[Custom Links](https://jgraph.github.io/drawio-tools/tools/link.html)** - Create interactive diagram links with actions

### Legacy Tools
- [Navigator](https://jgraph.github.io/drawio-tools/tools/navigator.html) - Browser information viewer
- [Tickets](https://jgraph.github.io/drawio-tools/tools/tickets.html) - Freshdesk tickets editor

## Development

### Prerequisites

- Node.js 18+
- npm

### Getting Started

```bash
# Clone the repository
git clone https://github.com/jgraph/drawio-tools.git
cd drawio-tools

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Structure

```
drawio-tools/
├── src/                    # Source files
│   ├── index.html          # Landing page
│   ├── styles/             # CSS styles
│   ├── utils/              # Shared JavaScript utilities
│   └── tools/              # Individual tool pages
├── public/                 # Static assets
├── tools/                  # Legacy tools (original versions)
├── package.json            # npm configuration
├── vite.config.js          # Vite build configuration
└── CLAUDE.md               # Developer guide
```

### Technology Stack

- **Build Tool**: [Vite](https://vitejs.dev/)
- **JavaScript**: ES Modules
- **CSS**: CSS Custom Properties with automatic dark mode
- **Compression**: [pako](https://github.com/nodeca/pako)

## License

Apache-2.0 License - see [LICENSE](LICENSE) for details.

## Links

- [draw.io](https://www.drawio.com)
- [draw.io on GitHub](https://github.com/jgraph/drawio)
- [Report Issues](https://github.com/jgraph/drawio-tools/issues)

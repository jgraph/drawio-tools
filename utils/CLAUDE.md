# utils/ Directory - Shared Utilities

This directory contains shared JavaScript utility modules used across all tools.

## Modules

### encoding.js
Core encoding/decoding functions for draw.io data format.

**Pipeline**: URL encode → Deflate → Base64

```javascript
import { encode, decode } from './encoding.js';

// Full pipeline
const encoded = encode('xml content', { urlEncode: true, deflate: true, base64: true });
const decoded = decode(encoded.data, { urlDecode: true, inflate: true, base64: true });

// Individual operations
import { urlEncode, urlDecode, base64Encode, base64Decode } from './encoding.js';
```

### xml.js
XML parsing and formatting utilities.

```javascript
import { parseXml, formatXml, normalizeXml, formatJson } from './xml.js';

const result = parseXml('<xml>content</xml>');
if (result.success) {
  const doc = result.doc;
}

const formatted = formatXml(xml); // Pretty-print
const normalized = normalizeXml(xml); // Remove whitespace
```

### mxfile.js
MxFile-specific validation and repair.

```javascript
import { validateMxFile, correctMxFile, isMxFile, getMxFileInfo } from './mxfile.js';

if (isMxFile(content)) {
  const validation = validateMxFile(content);
  if (!validation.valid) {
    console.log(validation.errors);
    const fixed = correctMxFile(content);
  }
}
```

### file.js
File operations and drag-drop handling.

```javascript
import { setupDropZone, downloadFile, copyToClipboard } from './file.js';

// Setup drag-drop
const cleanup = setupDropZone(element, (content, file) => {
  console.log('Dropped:', file.name);
});

// Download
downloadFile(content, 'diagram.drawio');

// Clipboard
const success = await copyToClipboard(text);
```

## Return Value Pattern

All utility functions return result objects for consistency:

```javascript
// Success
{ success: true, data: 'result' }

// Error
{ success: false, error: 'Error message' }
```

## Adding New Utilities

1. Create new `.js` file in this directory
2. Export functions using named exports
3. Add JSDoc comments for documentation
4. Re-export from `index.js`
5. Update this README

## Dependencies

- **pako**: Compression library (npm package)
- Browser APIs: DOMParser, XMLSerializer, FileReader

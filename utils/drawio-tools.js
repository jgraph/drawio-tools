/**
 * Draw.io Tools - Utilities
 * Combined utilities for encoding, XML, mxfile, and file operations.
 * Uses pako from CDN (window.pako must be loaded first)
 */

(function(global) {
  'use strict';

  // ============================================
  // ENCODING UTILITIES
  // ============================================

  function encode(data, options) {
    options = options || {};
    var urlEncode = options.urlEncode !== false;
    var deflate = options.deflate !== false;
    var base64 = options.base64 !== false;

    try {
      var result = data;

      if (urlEncode) {
        result = encodeURIComponent(result);
      }

      if (deflate && result.length > 0) {
        var compressed = pako.deflateRaw(result);
        result = String.fromCharCode.apply(null, new Uint8Array(compressed));
      }

      if (base64) {
        result = btoa(result);
      }

      return { success: true, data: result };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  function decode(data, options) {
    options = options || {};
    var urlDecode = options.urlDecode !== false;
    var inflate = options.inflate !== false;
    var base64 = options.base64 !== false;

    try {
      var result = data;

      var extracted = extractDiagramContent(result);
      if (extracted) {
        result = extracted;
      }

      if (base64) {
        result = atob(result);
      }

      if (inflate && result.length > 0) {
        var bytes = Uint8Array.from(result, function(c) { return c.charCodeAt(0); });
        result = pako.inflateRaw(bytes, { to: 'string' });
      }

      if (urlDecode) {
        result = decodeURIComponent(result);
      }

      return { success: true, data: result };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  function extractDiagramContent(xml) {
    try {
      var parser = new DOMParser();
      var doc = parser.parseFromString(xml, 'text/xml');
      var root = doc.documentElement;

      if (root && root.nodeName === 'mxfile') {
        var diagrams = root.getElementsByTagName('diagram');
        if (diagrams.length > 0) {
          return diagrams[0].textContent || '';
        }
      }
    } catch (e) {}
    return null;
  }

  function urlEncode(data) {
    try {
      return { success: true, data: encodeURIComponent(data) };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  function urlDecode(data) {
    try {
      return { success: true, data: decodeURIComponent(data) };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  function base64Encode(data) {
    try {
      return { success: true, data: btoa(data) };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  function base64Decode(data) {
    try {
      return { success: true, data: atob(data) };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  function deflate(data) {
    try {
      var compressed = pako.deflateRaw(data);
      var result = String.fromCharCode.apply(null, new Uint8Array(compressed));
      return { success: true, data: result };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  function inflate(data) {
    try {
      var bytes = Uint8Array.from(data, function(c) { return c.charCodeAt(0); });
      var result = pako.inflateRaw(bytes, { to: 'string' });
      return { success: true, data: result };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  function removeLinebreaks(data) {
    return data.replace(/(\r\n|\n|\r)/gm, '');
  }

  function escapeString(data) {
    return escape(data);
  }

  function unescapeString(data) {
    return unescape(data);
  }

  function toJsVariable(data) {
    var lines = data.split('\n');
    var result = [];

    for (var i = 0; i < lines.length; i++) {
      if (i < lines.length - 1 || lines[i].length > 0) {
        result.push("'" + lines[i].replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "\\n'");
      }
    }

    return result.join(' +\n');
  }

  // ============================================
  // XML UTILITIES
  // ============================================

  function parseXml(xml) {
    try {
      var parser = new DOMParser();
      var doc = parser.parseFromString(xml, 'text/xml');

      var errors = doc.getElementsByTagName('parsererror');
      if (errors && errors.length > 0) {
        return { success: false, error: errors[0].textContent };
      }

      return { success: true, doc: doc };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  function normalizeXml(xml) {
    var result = xml;
    result = result.replace(/>\s*/g, '>');
    result = result.replace(/\s*</g, '<');
    return result;
  }

  function formatXml(xml) {
    try {
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(xml, 'application/xml');

      var errors = xmlDoc.getElementsByTagName('parsererror');
      if (errors && errors.length > 0) {
        return { success: false, error: 'Invalid XML: ' + errors[0].textContent };
      }

      var xsltDoc = parser.parseFromString(
        '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">' +
        '  <xsl:strip-space elements="*"/>' +
        '  <xsl:template match="para[content-style][not(text())]">' +
        '    <xsl:value-of select="normalize-space(.)"/>' +
        '  </xsl:template>' +
        '  <xsl:template match="node()|@*">' +
        '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>' +
        '  </xsl:template>' +
        '  <xsl:output indent="yes"/>' +
        '</xsl:stylesheet>',
        'application/xml'
      );

      var xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsltDoc);
      var resultDoc = xsltProcessor.transformToDocument(xmlDoc);
      var resultXml = new XMLSerializer().serializeToString(resultDoc);

      return { success: true, data: resultXml };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  function formatJson(json, indent) {
    indent = indent || 2;
    try {
      var parsed = JSON.parse(json);
      return { success: true, data: JSON.stringify(parsed, null, indent) };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  function normalizeJson(json) {
    try {
      var parsed = JSON.parse(json);
      return { success: true, data: JSON.stringify(parsed) };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  function getTextContent(node) {
    if (!node) return '';
    return node.textContent !== undefined ? node.textContent : node.text || '';
  }

  // ============================================
  // MXFILE UTILITIES
  // ============================================

  var ErrorType = {
    BASE64: 'base64',
    DEFLATE: 'deflate',
    URL_ENCODE: 'url_encode',
    XML: 'xml'
  };

  function validateMxFile(content) {
    var errors = [];

    try {
      var parseResult = parseXml(content);

      if (!parseResult.success) {
        errors.push({
          type: ErrorType.XML,
          message: 'XML parsing error: ' + parseResult.error
        });
        return { valid: false, errors: errors };
      }

      var doc = parseResult.doc;
      var root = doc.documentElement;

      if (root.nodeName !== 'mxfile') {
        errors.push({
          type: ErrorType.XML,
          message: "Invalid root element: expected 'mxfile', got '" + root.nodeName + "'"
        });
        return { valid: false, errors: errors };
      }

      var parserErrors = doc.getElementsByTagName('parsererror');
      if (parserErrors && parserErrors.length > 0) {
        for (var i = 0; i < parserErrors.length; i++) {
          errors.push({
            type: ErrorType.XML,
            message: 'Invalid XML content: ' + parserErrors[i].textContent
          });
        }
      }

      var diagrams = doc.getElementsByTagName('diagram');

      if (diagrams.length === 0) {
        errors.push({
          type: ErrorType.XML,
          message: 'No diagram elements found in mxfile'
        });
      }

      for (var i = 0; i < diagrams.length; i++) {
        var pageErrors = validateDiagramPage(diagrams[i], i + 1);
        errors = errors.concat(pageErrors);
      }

      var textErrors = validateMxFileText(content);
      errors = errors.concat(textErrors);

      return { valid: errors.length === 0, errors: errors };
    } catch (e) {
      errors.push({
        type: ErrorType.XML,
        message: 'Unexpected error: ' + e.message
      });
      return { valid: false, errors: errors };
    }
  }

  function isDiagramUncompressed(diagram) {
    var children = diagram.childNodes;
    for (var i = 0; i < children.length; i++) {
      if (children[i].nodeType === 1) {
        return true;
      }
    }
    return false;
  }

  function validateDiagramPage(diagram, pageNumber) {
    var errors = [];

    // Uncompressed diagrams contain XML child elements directly
    if (isDiagramUncompressed(diagram)) {
      return errors;
    }

    var data = getTextContent(diagram);

    if (!data || data.trim().length === 0) {
      return errors;
    }

    try {
      var base64Decoded = atob(data);

      try {
        var bytes = Uint8Array.from(base64Decoded, function(c) { return c.charCodeAt(0); });
        var inflated = pako.inflateRaw(bytes, { to: 'string' });

        try {
          decodeURIComponent(inflated);
        } catch (e) {
          errors.push({
            type: ErrorType.URL_ENCODE,
            message: 'URL decode error: ' + e.message,
            page: pageNumber
          });

          var uriErrors = checkUriComponents(inflated);
          for (var i = 0; i < uriErrors.length; i++) {
            errors.push({
              type: ErrorType.URL_ENCODE,
              message: uriErrors[i],
              page: pageNumber
            });
          }
        }
      } catch (e) {
        errors.push({
          type: ErrorType.DEFLATE,
          message: 'Inflate error: ' + e.message,
          page: pageNumber
        });
      }
    } catch (e) {
      errors.push({
        type: ErrorType.BASE64,
        message: 'Base64 decode error: ' + e.message,
        page: pageNumber
      });
    }

    return errors;
  }

  function validateMxFileText(content) {
    var errors = [];
    var tokens = content.split('<diagram ');
    var pos = tokens[0].length + 10;

    for (var i = 1; i < tokens.length; i++) {
      var start = tokens[i].indexOf('>') + 1;
      var end = tokens[i].lastIndexOf('</diagram>');

      if (end === -1) {
        errors.push({
          type: ErrorType.XML,
          message: 'Missing closing </diagram> tag',
          page: i,
          position: pos
        });
        continue;
      }

      var data = tokens[i].substring(start, end).trim();

      // Skip base64 validation for uncompressed diagrams (XML content)
      if (data.charAt(0) === '<') {
        pos += tokens[i].length + 9;
        continue;
      }

      while (data.charAt(data.length - 1) === '=') {
        data = data.substring(0, data.length - 1);
      }

      for (var j = 0; j < data.length; j++) {
        var code = data.charCodeAt(j);
        var isValid =
          (code > 47 && code < 58) ||
          (code > 64 && code < 91) ||
          (code > 96 && code < 123) ||
          code === 43 ||
          code === 47;

        if (!isValid) {
          errors.push({
            type: ErrorType.BASE64,
            message: "Invalid Base64 character '" + data.charAt(j) + "' (code: " + code + ")",
            page: i,
            position: pos + start + j
          });
        }
      }

      pos += tokens[i].length + 9;
    }

    return errors;
  }

  function checkUriComponents(data) {
    var errors = [];
    var tokens = data.split('%');
    var pos = 0;
    var temp = [];

    for (var j = 0; j < tokens.length; j++) {
      if (tokens[j].length > 0) {
        temp.push(tokens[j]);
        pos += 1;

        if (tokens[j].length > 2 || j === tokens.length - 1) {
          var value = '%' + temp.join('%');

          try {
            decodeURIComponent(value);
          } catch (ex) {
            var displayValue = value.length < 32 ? value : value.substring(0, 32) + '...';
            errors.push('Invalid URI component at position ' + pos + ': ' + displayValue);
          }

          temp = [];
        }

        pos += tokens[j].length;
      }
    }

    return errors;
  }

  function correctMxFile(content) {
    var trimmed = content.trim();

    if (trimmed.endsWith('</mxfile>')) {
      return {
        success: true,
        data: trimmed,
        message: 'File is already valid'
      };
    }

    var index = trimmed.lastIndexOf('</diagram>');

    if (index > 0) {
      var corrected = trimmed.substring(0, index + 10) + '</mxfile>';
      return {
        success: true,
        data: corrected,
        message: 'File corrected: truncated content after last diagram and added closing tag'
      };
    }

    return {
      success: false,
      message: 'Unable to correct file: no valid diagram structure found'
    };
  }

  function isMxFile(content) {
    var trimmed = content.trim();
    return (
      trimmed.indexOf('<mxfile') === 0 ||
      (trimmed.indexOf('<?xml') === 0 && trimmed.indexOf('<mxfile') > -1)
    );
  }

  function getMxFileInfo(content) {
    var parseResult = parseXml(content);
    if (!parseResult.success) return null;

    var root = parseResult.doc.documentElement;
    if (root.nodeName !== 'mxfile') return null;

    var diagrams = root.getElementsByTagName('diagram');

    return {
      pages: diagrams.length,
      host: root.getAttribute('host') || undefined,
      modified: root.getAttribute('modified') || undefined,
      version: root.getAttribute('version') || undefined
    };
  }

  function getDiagramNames(content) {
    var parseResult = parseXml(content);
    if (!parseResult.success) return [];

    var diagrams = parseResult.doc.getElementsByTagName('diagram');
    var names = [];

    for (var i = 0; i < diagrams.length; i++) {
      names.push(diagrams[i].getAttribute('name') || 'Page ' + (i + 1));
    }

    return names;
  }

  // ============================================
  // FILE UTILITIES
  // ============================================

  function readFileAsText(file) {
    return new Promise(function(resolve, reject) {
      var reader = new FileReader();
      reader.onload = function(e) { resolve(e.target.result); };
      reader.onerror = function() { reject(new Error('Failed to read file')); };
      reader.readAsText(file);
    });
  }

  function readFileAsDataURL(file) {
    return new Promise(function(resolve, reject) {
      var reader = new FileReader();
      reader.onload = function(e) { resolve(e.target.result); };
      reader.onerror = function() { reject(new Error('Failed to read file')); };
      reader.readAsDataURL(file);
    });
  }

  function downloadFile(content, filename, mimeType) {
    filename = filename || 'download.drawio';
    mimeType = mimeType || 'text/plain';
    var blob = new Blob([content], { type: mimeType });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function setupDropZone(element, onDrop, options) {
    options = options || {};
    var onDragEnter = options.onDragEnter;
    var onDragLeave = options.onDragLeave;

    function handleDragOver(e) {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }

    function handleDragEnter(e) {
      e.stopPropagation();
      e.preventDefault();
      if (onDragEnter) onDragEnter(e);
    }

    function handleDragLeave(e) {
      e.stopPropagation();
      e.preventDefault();
      if (onDragLeave) onDragLeave(e);
    }

    function handleDrop(e) {
      e.stopPropagation();
      e.preventDefault();
      if (onDragLeave) onDragLeave(e);

      if (e.dataTransfer.files.length > 0) {
        var file = e.dataTransfer.files[0];
        readFileAsText(file).then(function(content) {
          onDrop(content, file);
        }).catch(function(error) {
          console.error('Failed to read dropped file:', error);
        });
      }
    }

    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('dragenter', handleDragEnter);
    element.addEventListener('dragleave', handleDragLeave);
    element.addEventListener('drop', handleDrop);

    return function() {
      element.removeEventListener('dragover', handleDragOver);
      element.removeEventListener('dragenter', handleDragEnter);
      element.removeEventListener('dragleave', handleDragLeave);
      element.removeEventListener('drop', handleDrop);
    };
  }

  function copyToClipboard(text) {
    return navigator.clipboard.writeText(text).then(function() {
      return true;
    }).catch(function() {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return true;
      } catch (e) {
        document.body.removeChild(textarea);
        return false;
      }
    });
  }

  function getFileExtension(filename) {
    var parts = filename.split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : '';
  }

  function isDrawioFile(filename) {
    var ext = getFileExtension(filename);
    return ['drawio', 'xml', 'svg'].indexOf(ext) > -1;
  }

  // ============================================
  // UI UTILITIES
  // ============================================

  var toastContainer = null;

  function getToastContainer() {
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }
    return toastContainer;
  }

  function showToast(message, type, duration) {
    type = type || 'info';
    duration = duration || 4000;

    var container = getToastContainer();

    var toast = document.createElement('div');
    toast.className = 'toast toast--' + type;

    var messageSpan = document.createElement('span');
    messageSpan.className = 'toast__message';
    messageSpan.textContent = message;

    var closeBtn = document.createElement('button');
    closeBtn.className = 'toast__close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close');

    toast.appendChild(messageSpan);
    toast.appendChild(closeBtn);
    container.appendChild(toast);

    function removeToast() {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.2s ease-out';
      setTimeout(function() {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 200);
    }

    closeBtn.addEventListener('click', removeToast);

    if (duration > 0) {
      setTimeout(removeToast, duration);
    }

    return toast;
  }

  // ============================================
  // EXPORT
  // ============================================

  global.DrawioTools = {
    // Encoding
    encode: encode,
    decode: decode,
    extractDiagramContent: extractDiagramContent,
    urlEncode: urlEncode,
    urlDecode: urlDecode,
    base64Encode: base64Encode,
    base64Decode: base64Decode,
    deflate: deflate,
    inflate: inflate,
    removeLinebreaks: removeLinebreaks,
    escapeString: escapeString,
    unescapeString: unescapeString,
    toJsVariable: toJsVariable,
    // XML
    parseXml: parseXml,
    normalizeXml: normalizeXml,
    formatXml: formatXml,
    formatJson: formatJson,
    normalizeJson: normalizeJson,
    getTextContent: getTextContent,
    // MxFile
    ErrorType: ErrorType,
    validateMxFile: validateMxFile,
    correctMxFile: correctMxFile,
    isMxFile: isMxFile,
    getMxFileInfo: getMxFileInfo,
    getDiagramNames: getDiagramNames,
    // File
    readFileAsText: readFileAsText,
    readFileAsDataURL: readFileAsDataURL,
    downloadFile: downloadFile,
    setupDropZone: setupDropZone,
    copyToClipboard: copyToClipboard,
    getFileExtension: getFileExtension,
    isDrawioFile: isDrawioFile,
    // UI
    showToast: showToast
  };

})(window);

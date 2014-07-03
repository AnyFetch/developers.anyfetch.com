---
title: How to use an anyFetch hydrater?
layout: doc
---

Anyfetch ships with some default hydraters you may want to check.

## File hydraters
Hydraters working on binary files.

### plaintext.hydrater.anyfetch.com
> [Source](https://github.com/AnyFetch/plaintext.hydrater.anyfetch.com)

Retrieve basic information about a file (word, pdf, ppt, txt, rtf, png...). Will extract text if available.

* Input document type: `file`
* Output document type: `document`
* Output metadata:
    - `text`
* Output data:
    - `html` 

### ocr.hydrater.anyfetch.com
> [Source](https://github.com/AnyFetch/ocr.hydrater.anyfetch.com)

Retrieve textual information from an image.

* Input document type: `file`
* Output metadata:
    - `text`

### pdf.hydrater.anyfetch.com
> [Source](https://github.com/AnyFetch/pdf.hydrater.anyfetch.com)

Transform a PDF file to HTML.

* Input document type: `document`
* Output data:
    - `html`

### office.hydrater.anyfetch.com
> [Source](https://github.com/AnyFetch/office.hydrater.anyfetch.com)

Transform an office file to PDF, inject it back onto anyFetch.

* Input document type: `document`
* Output data:
    - `html`

### eml.hydrater.anyfetch.com
> [Source](https://github.com/AnyFetch/eml.hydrater.anyfetch.com)

Retrieve data from eml files, hydrate mail data and save back the attachments as files on anyFetch.

* Input document type: `document`
* Output document type: `email`
* Force-reset creation date
* Output metadata:
    - `to`
    - `from`
    - `cc`
    - `bcc`
    - `subject`
    - `date`
    - `text`
* Output data:
   - `html`
* Create additional documents for each attachment

### image.hydrater.anyfetch.com
> [Source](https://github.com/AnyFetch/image.hydrater.anyfetch.com)

Generate thumbnails and preview from an image.

* Input document type: `file`
* Output document type: `image`
* Output data:
   - `display`
   - `thumb`

### iptc.hydrater.anyfetch.com
> [Source](https://github.com/AnyFetch/iptc.hydrater.anyfetch.com)

Retrieve IPTC data from an image.

* Input document type: `file`
* Output data:
   - `author`
   - `description`
   - `keywords`

### markdown.hydrater.anyfetch.com
> [Source](https://github.com/AnyFetch/markdown.hydrater.anyfetch.com)

Generate markdown html from a document.

* Input document type: `file`
* Output document type: `document`
* Output metadata:
    - `text`
* Output data:
    - `html` 

## Document hydraters
Hydraters working on raw JSON documents.

### embedmail.hydrater.anyfetch.com
> [Source](https://github.com/AnyFetch/embedmail.hydrater.anyfetch.com)

Remove previous mail conversation from search index, to keep search accurate on new information only.

* Input document type: `email`
* Output metadata:
    - `text`, with stripped conversations
* Output data:
    - `html` 

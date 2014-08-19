---
title: AnyFetch hydraters resources
layout: doc
---

Anyfetch ships with some default hydraters you may want to check.

## File hydraters
Hydraters working on binary files.

### plaintext.anyfetch.com
> [Source](https://github.com/AnyFetch/plaintext.hydrater.anyfetch.com)

Retrieve basic information about a file (word, pdf, ppt, txt, rtf, png...). Will extract text if available.

* Input document type: `file`
* Output document type: `document`
* Output metadata:
    - `text`
* Output data:
    - `html` 

### ocr.anyfetch.com
> [Source](https://github.com/AnyFetch/ocr.hydrater.anyfetch.com)

Retrieve textual information from an image by running an OCR algorithm. Best results are obtained with scanned documents.

* Input document type: `file`
* Output metadata:
    - `text`

### pdf.anyfetch.com
> [Source](https://github.com/AnyFetch/pdf.hydrater.anyfetch.com)

Transform a PDF file to HTML.

* Input document type: `document`
* Output data:
    - `html`

### office.anyfetch.com
> [Source](https://github.com/AnyFetch/office.hydrater.anyfetch.com)

Transform an Office (or OpenOffice) file to HTML.

* Input document type: `document`
* Output data:
    - `html`

### eml.anyfetch.com
> [Source](https://github.com/AnyFetch/eml.hydrater.anyfetch.com)

Retrieve data from eml files, hydrate mail data and save back the attachments as files on AnyFetch.

Each attachment is added as a new document and goes through its own hydration chain.

The creation date is always set to the time at which the email has been sent.

* Input document type: `document`
* Output document type: `email`
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

### image.anyfetch.com
> [Source](https://github.com/AnyFetch/image.hydrater.anyfetch.com)

Generate thumbnails and preview from an image, store them directly in base64.

* Input document type: `file`
* Output document type: `image`
* Output data:
   - `display`
   - `thumb`

### iptc.anyfetch.com
> [Source](https://github.com/AnyFetch/iptc.hydrater.anyfetch.com)

Retrieve IPTC data from an image (picture creator, keywords, description...)

* Input document type: `file`
* Output data:
   - `author`
   - `description`
   - `keywords`

### markdown.anyfetch.com
> [Source](https://github.com/AnyFetch/markdown.hydrater.anyfetch.com)

Transform a Markdown file to HTML.

* Input document type: `file`
* Output document type: `document`
* Output metadata:
    - `text`
* Output data:
    - `html` 

### filecleaner.anyfetch.com
> [Source](https://github.com/AnyFetch/filecleaner.hydrater.anyfetch.com)

Remove useless files (.log, .lock, etc.)

### embedmail.anyfetch.com
> [Source](https://github.com/AnyFetch/embedmail.hydrater.anyfetch.com)

Remove previous mail conversation from search index, to keep search accurate on new information only.

* Input document type: `email`
* Output metadata:
    - `text`, with conversations stripped
* Output data:
    - `html` 

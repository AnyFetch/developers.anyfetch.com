---
title: Anyfetch projection
subtitle: Projection, you said?
layout: doc
---

Documents in Anyfetch revolve around the notion of projection, that is to display only data relevant to the context.

The best way to understand projection is by example. Let's say you have a big PDF file, hydrated with the following metadata:

```json
{
    "_type": "Document",
    "id": "5252d19a1247678905000001",
    "document_url": "/documents/5252d19a1247678905000001",
    "metadatas": {
        "title": "My big PDF",
        "path": "/home/anyfetch/big_pdf.pdf",
        "text": "Big text extract with many many characters [trunc ...]",
        "pages": [
            "<h1>Big text extract</h1><p>with many many characters, spanning across multiple pages. [trunc ...]",
            "second page [trunc ...]",
            ...
        ],
        "creation": "2013-10-08T14:59:07.895Z",
        "updated": "2013-10-09T13:01:22.783Z",
        "author": "PDF Author",
        "print_informations": "300dpi"
    }
}
```

When the user enter a search query, he'll only want a small snippet of this data. Loading everything would clutter the network and slow down your app. People would hate it, they'd leave your app, eat and get fat. We don't want that, and we sincerely hope that, as a dev, you don't want that either.

So we need to reduce the amount of data being transferred. For this, we define projections, taking the original `metadatas` object hash and generating a new, simplified hash.

For instance, take the following projector :

```javascript
// In this code snippet, `md` is the original metadata hash.
// searchQuery contains the user query.
var projector = {
    title: md.title
    text: generateSnippet(md.text, searchQuery)
}
```

When the user searches for the term "many many", we'll then generate a new, smaller object:

```json
{
    "_type": "Document",
    "id": "5252d19a1247678905000001",
    "document_url": "/documents/5252d19a1247678905000001",
    "metadatas": {
        "title": "My big PDF",
        "text": "...extract with <em>many many</em> characters...",
    }
}
```

This is the basis for projectors.

Obviously, we can't use the same projection for all document types: we don't want to project a PDF, a contact or an e- mail in the same way.
That's the basis for document types: every document has a document-type, and this document-type defines how it will be projected.

Every document-type defines three projectors:

* A projector for `title`, used to display the document in one line;
* A projector for `snippet`, used after a query to render small results;
* A projector to display the document in `full`. Note that this *does not* contain all metadata, since most of them are not relevant to the end user.

> In some cases, the document will have no document-type. In this case, the original metadata will be returned in full, without any projection.

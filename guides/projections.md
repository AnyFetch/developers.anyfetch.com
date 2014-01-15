---
title: Anyfetch projection
subtitle: Projection, you said?
layout: doc
---

Documents in Anyfetch revolves around the notion of projection, to display datas depending on the context.

The best way to understand projection is by example. Let's say you have a big PDF file, hydrated with the following metadatas:

```json
{
    "_type": "Document",
    "id": "5252d19a1247678905000001",
    "document_url": "/documents/5252d19a1247678905000001",
    "metadatas": {
        "title": "My big PDF",
        "path": "/home/papiel/big_pdf.pdf",
        "text": "Big text extract with many many characters...",
        "pages": [
            "<h1>Big text extract</h1><p>with many many characters, spanning across multiple pages.",
            "second page...",
            ...
        ],
        "creation": "2013-10-08T14:59:07.895Z",
        "updated": "2013-10-09T13:01:22.783Z",
        "author": "PDF Author",
        "print_informations": "300dpi"
    }
}
```

When the user enter a search query, he'll only want a small snippet of this data. Loading everything would clutter the network and slow down your app. People will hate it, they'll leave your app, eat and get fat. We don't want that, and we sincerely hope that, as a dev, you don't want that too.

So we need to reduce the datas being transferred. For this, we define projections, taking the original `metadatas` object hash and generating a new, simplified hash.

For instance, take the following projector :

```javascript
// In this code snippet, `md` is the original metadatas hash.
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

Obviously, we can't use the same projection for each documents : we don't want to project a PDF, a contact or a mail in the same way.
That's the basis for document-types: every document has a document-type, and this document-type defines how it will be projected.

Every document-type defines three projectors:

* A projector for snippet, used after a query to render small results;
* A projector for related documents, used when we want to display the document alongside another one;
* A projector to display the document in details. Note this is not all metadatas, since most of them won't be displayed to the end user;

> In some case, the document will have no document-type. In this case, the original metadatas will be returned, without any projection.

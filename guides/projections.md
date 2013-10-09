---
title: Cluestr projection
subtitle: Projection, you said?
layout: doc
---

Documents in Cluestr revolves around the notion of projection, to display datas depending on the context.

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

Every document-types defines three projectors:

* A projector for snippet, used after a query to render small results;
* A projector for related documents, used when we want to display the document alongside another one;
* A projector to display the document in details. Note this is not all metadatas, since most of them won't be displayed to the end user;

Last touch. We said earlier every document has a document-type. Well... we lied. In fact, a document can have 2 document-types: a semantic, and a binary.

The `binary document-type` will be used to display the file in a standard way, as you would see it when viewing the file in your PC. For a PDF, it will be a lot of pages, for an image it will be a viewer... this is the most intuitive way to view your content, but it may not be the most useful.

The `semantic document-type` will be used to display the core datas for your documents, in a semantic way: a contact, for instance, will be a semantic document-type... but so will be any structured data, such as a flight ticket.

Binary and semantic document-types are loosely coupled. For instance, a document can have a binary document-type of 'pdf' and a semantic document-type of 'invoice', and another one can have a binary_document-type of 'image' and a semantic document-type of 'invoice' too: this will affect their projections.

To sum up. A document can have up to two document-types, each document-type defining three projectors to display the data in various situations.

### Projection lookup
This section will give insight about projections and how they are used internally.

> In some case, the document will have neither a binary or a semantic document-type. In this case, the original metadatas will be returned, without any projection.

#### Snippet projection
When a document has a semantic document-type, its snippet projector will be used. Else, the binary document-type snippet projector will be used.

#### Full projection
A document full projection is a hash containing the full projection for each document-type on the document.

For instance, a document with:

```json
{
	...
    "semantic_document_type": "5252ce4ce4cfcd16f55cfa3c",
    "binary_document_type": "5252ce4ce4cfcd16f55cfa3b",
    ...
}
```

Will be projected as :

```json
{
	"5252ce4ce4cfcd16f55cfa3c": {
		"description": "Full projection for the semantic document-type"
	},
	"5252ce4ce4cfcd16f55cfa3b": {
		"description": "Full projection for the binary document-type"
	},
}
```

#### Related projection
Not used for now.

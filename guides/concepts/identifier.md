---
title: anyFetch identifier
subtitle: Mapping documents
layout: doc
---

## `id` and `identifier`
Internally, anyFetch affects an hexadecimal `id` to each document. With this `id`, you can edit, update or delete the document.

This works great for simple use cases, but it requires to maintain an index of mappings between your documents and anyFetch's `id`.

This is why you can use your own `identifier`, instead of the `id`. When sending the document for the first time, specify some string which uniquely indentifies the document in your context (a URI works fine for most cases).

The next time you want to update the document, instead of using `id`, just specify the same `identifier`.

All `/documents/` endpoints can be accessed:

* Either by `id`, for instance `GET /documents/$ID/raw`
* Or by identifier `identifier`, for instance `GET /documents/identifier/$IDENTIFIER/raw`

When using the second syntax, **don't forget to url-encode** your `identifier`, especially if you used an URI.

For convenience, this identifier is repeated in each reply from the API (even if you used the `id` syntax), allowing you to completely discard the `id` if you want to keep your own `identifier`.

## Unicity
`identifier` are unique by company. If you try to create a document with an `identifier` already provided by another `provider` on the same account, you'll get a `403 Forbidden` error.

When using the same provider, the previous document will be replaced with the new one, keeping the same `id`.

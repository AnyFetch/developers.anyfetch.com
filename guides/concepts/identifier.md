---
title: anyFetch identifier
subtitle: Mapping documents
layout: doc
---

## `id` and `identifier`
Internally, anyFetch affects an hexadecimal `id` to each document. With this `id`, you can edit, update or delete the document.

This works great for simple use cases, but it requires to maintain a mapping between your documents and anyFetch's `id`.

This is why you can use your own `identifier`, instead of the `id`. When sending the document for the first time, specify some string which uniquely indentifies the document in your context (a URI works fine for most cases).

The next time you want to update the document, instead of using `id`, just specify the same `identifier`.

All `/documents/` endpoints can be accessed:

* Either by `id`, for instance `GET /documents/$ID/raw`
* Or by identifier `identifier`, for instance `GET /documents/identifier/$IDENTIFIER/raw`

When using the second syntax, **don't forget to url-encode** your `identifier`, especially if you used an URI.

> *Warning*. You can only access your own documents by `identifier`. Other providers or tokens can't access documents from other providers using this syntax, since multiples documents may be available with the same identifier on different providers for the same user.

For convenience, this identifier is repeated in each reply from the API (even if you used the `id` syntax), allowing you to completely discard the `id` if you want to keep your own `identifier`.

Please note however that other providers will be able to see this identifier, so don't include tokens or other private content.

## Unicity
`identifier` are unique by provider. If you try to create a document with an `identifier` already provided, you'll simply update the previous document sent with this identifier, keeping the same `id`.

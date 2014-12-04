---
title: anyFetch frontend
subtitle: Information is beautiful
layout: doc
---

Creating a frontend range from very easy to incredibly hard, depending on what you want to achieve.

You'll need to read the documentation for [all endpoints](/endpoints), especially the [`/documents/`](/endpoints/#documents) one.

The [default frontend for anyFetch](https://github.com/AnyFetch/app.anyfetch.com) is open-sourced, and can be used for inspiration. You're welcome to fork.

## Web frontend
The API sends CORS header, so you can use a single page application -- no need for a server to communicate with the API.


## Mobile frontend
When using anyFetch, be wary as some endpoints may return megabytes of data. Free memory when you can, and avoid doing network operations on main thread.

## Principles
### Endpoints
The main endpoint for frontend-related queries is [`GET /documents`](/endpoints/#documents-documents-get). This lets you search in all documents, filter by document-type, provider, date...

After that, you may want to check [`GET /documents/:id`](/endpoints/#documents-document-get) which displays more data about the document than a simple snippet.

### Templating
[Templating](/guides/concepts/templating.html) will be very useful to display data.
However, if you want you can reimplement a templating system to display data the way you want.

At anyfetch, we made [a bower lib](https://github.com/AnyFetch/anyfetch-assets) containing all required assets for a basic application: document-types icons, providers, basic CSS... Feel free to reuse it, add your own images, or create a whole new experience.

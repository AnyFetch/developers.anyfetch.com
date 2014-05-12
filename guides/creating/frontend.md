---
title: Anyfetch frontend
subtitle: Information is beautiful
layout: doc
---

Creating a frontend range from very easy to incredibly hard, depending on what you want to achieve.

You'll need to read the documentation for [all endpoints](/endpoints), especially the `/documents/` one.


The [default frontend for anyFetch](https://github.com/Papiel/app.anyfetch.com) is open-sourced, and can be used for inspiration. You're welcome to fork.

## Web frontend
The API sends CORS header, so you can use a single page application -- no need for a server to communicate with the API.


## Mobile frontend
When using Fetch API, be wary as some endpoints may return megabytes of data. Free memory when you can, and avoid doing network operations on main thread.

## Principles
### Endpoints
Three endpoints are really useful for frontend-related queries:

* [`GET /documents`](/endpoints/#documents-documents-get) : to search in all documents, filter by document-type, provider, date...
* [`GET /document_types`](/endpoints/#document-types-document-types) : to retrieve templates associated with document-types
* [`GET /providers`](/endpoints/#providers-providers) : to retrieve the name of a provider, and its type

Since these 3 endpoints are available with `GET`, you may want to try [batch calls](/endpoints/#index-batch-calls).

### Templating
[Templating](/guides/concepts/templating.html) will be very useful to display data.
However, if you want you can reimplement a templating system to display data the way you want.

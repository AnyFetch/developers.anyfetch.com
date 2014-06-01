---
title: Anyfetch frontend
subtitle: Integrate AnyFetch within your apps
layout: doc
---

AnyFetch can be integrated in all your apps thanks to its complete API. You can even build a complete solution on top of it.

In this tutorial, you will see how to create a very simple Web frontend based on AnyFetch power. It will help you understand how to master AnyFetch API and take the most out of each endpoint. During this tutorial, you may refer to the [endpoints documentation](/endpoints) to have an exhaustive list.

Creating a frontend range from very easy to incredibly hard, depending on what you want to achieve. We already open-sourced a [ready-to-use front end](https://github.com/Papiel/app.anyfetch.com) using MVC concepts provided by AngularJS. You're welcome to fork it or take a look at it for inspiration.

The purpose of this tutorial being to ... That is why we will keep it simple here and focus on how javascript API calls.



You'll need to read the documentation for , especially the `/documents/` one.

The is open-sourced, and can be used for inspiration. You're welcome to fork.

## Web frontend
The API sends CORS header, so you can use a single page application -- no need for a server to communicate with the API.


## Mobile frontend
When using anyFetch, be wary as some endpoints may return megabytes of data. Free memory when you can, and avoid doing network operations on main thread.

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

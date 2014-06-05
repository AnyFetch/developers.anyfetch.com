---
title: anyFetch frontend
subtitle: Integrate AnyFetch within your apps
layout: doc
---

In this tutorial, you will see how to create a **very simple Web frontend from scratch, based on AnyFetch power**. It will help you understand how to master anyFetch API and take the most out of each endpoint.

Creating a frontend range from very easy to incredibly hard, depending on what you want to achieve. The purpose of this tutorial being to understand the anyFetch API principles, we will keep it simple and code in raw javascript. No complex framework, compiled scripts... **Only you, javascript and the anyFetch API.** *(well... to make it a bit simpler, we will still use a very famous framework: jQuery, and just for the ajax calls)*

#### Don't want to start from scratch?

We already developed in open-source a [ready-to-use front end](https://github.com/Papiel/app.anyfetch.com). It is based on AngularJS, in order to have a client-side MVC. You're welcome to fork or take a look for inspiration.

## Preparations

During this tutorial, you may refer to the [endpoints documentation](/endpoints) to have an exhaustive list. If this is the first time you are using a REST API, visit our [getting started](/getting-started.html) page.

We are going to split the work in **4 steps**. Each one of them will help you master an important concept of the API.

1. **Your first API call**: using basic authentification, you will learn what you can get from basic endpoints such as ```/company```. We will also take a look on how to do batch calls.
2. **Search for the truth**: based on a simple form and some JS code, you will be able to search for documents using the ```/document?search=(...)``` endpoint. We will cover the multiples filtering possibilities it can offer.
3. **Display documents**: we will take a look on how to display documents directly in the web app thanks to the API.
4. **Get secure**: because security is not optional, we will take it to the next step. We will learn how to use the API with tokens to implement a safer communication with the server.
5. **Your imagination is the only limit**: you are now ready to enjoy the power of anyFetch and intergrate it everywhere. Mobile, web, native... This step has to be defined by you.

All the code generated is available on [this repo](https://github.com/kimchouard/anyfetch-frontend-tuto)


# RAW

*from previous version. For inspiration, to be deleted when tutorial is over*

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

You'll need to read the documentation for , especially the `/documents/` one.
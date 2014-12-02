---
title: anyFetch example use for creating document-types
subtitle: Display documents the right way
layout: doc
---

In this guide, we'll create a new *document-type* to display a new kind of documents.

The example use case will be a store indexing "products" onto anyfetch, wishing to display them properly.

## What do I need?
To follow this guide, you need:

* An account on anyFetch, with login and password.
* `curl` binary

> We use `curl` for simplicity purpose. Of course, in a real use case, you'll need to use whatever utility your language provide (`http` for node, `curl` for php, `requests` for Python, `Net::HTTP` for Ruby)

## Setting up
Retrieve your token as described on the ["Hello world" tutorial](/guides/tutorials/hello-world.html): `GET /token`.

## What do we want to achieve?
We want to be able to index a new kind of documents on the API, and display them properly. For instance:

TODO

What is needed? For each document, we'll need to have an image, a title, a description and a price. We wish to be able to search by title and description.

## Creating the document-type
Before we get started, let's view all the document-types already available:

```sh
curl -XGET \
-H "Authorization: Bearer ${TOKEN}" \
https://api.anyfetch.com/document_types
```

The list is already quite long, and contains all the default document-type. You can find the same list in a more enjoyable format [here](resources/document-types.html).

What we want to do is add our own, to display `product` documents.

We'll have to specify many things: [how we want to display a document](/guides/concepts/templating.html) (`templates`), [which data should be transferred by the API to the enduser](](/guides/concepts/projection.html)) (`projections`) and which data should be user for searching (`esMapping`).

####

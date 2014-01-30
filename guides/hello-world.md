---
title: Fetch API example use
subtitle: Say "Hello world"!
layout: doc
---

In this guide, we'll send a document to Fetch API and retrieve it using the API endpoint.

## What do I need?
To follow this guide, you need:

* An account on anyFetch, with login and password.
* `curl` binary to send requests from the command line
* A sample file for hydration, for instance THIS ONE.

## Clean up your account
> Warning: this will remove **all datas** from this account! Only use on testing accounts.

The first step will be to clean everything that may be available on your account. To do that, we'll send a simple `DELETE` request to `/reset`:

```sh
$ curl -XDELETE http://api.anyfetch.com/reset
```

## Send a document
Before sending the file, we need to give Fetch API basic informations about our documents. We'll send the following params:

* `identifier`: this identifier must be unique across our account, and will be used again if we need to update our document in the future. For now, we'll pick something simple, like `hello-world`.
* `no_hydration`: this flag tells the fetch API we intend to send a file with the document, and it should wait before starting to hydrate the document. We'll set it to `true`.
* `metadatas`: a JSON object containing basic information about our document

```sh
$ curl

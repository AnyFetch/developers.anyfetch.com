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

## Setting up
You need to base64 encode your login and password separated with a colon.
For instance, the login `test@anyfetch.com` and password `password` will be encoded as `test@anyfetch.com:password`, which is `dGVzdEBhbnlmZXRjaC5jb206cGFzc3dvcmQ=`.
Use [this tool](http://www.base64encode.org/) if needed. For the remainder of this document, replace `${BASE64}` with your value.

You can now send requests using [basic authentication](/authentication.html): an `Authorization` header with a value of `Basic ${BASE64}`

### Clean up your account
> Warning: this will remove **all datas** from this account! Only use on testing accounts.

The first step will be to clean everything that may be available on your account. To do that, we'll send a simple `DELETE` request to `/reset`:

```sh
$ curl -XDELETE \
-H "Authorization: Basic ${BASE64}" \
http://api.anyfetch.com/reset
```

### Retrieve a token
Although you can do most things using the Basic Authentication, tokens are faster to use, and generally more secure since you can revoke them at any time
For our test, we'll use a token:

```sh
$ curl -H "Authorization: Basic ${BASE64}" \
http://api.anyfetch.com/token

{"token":"${TOKEN}"}
```

Keep this token somewhere safe.

## Providing datas
Now that we're set up, we can send our document. This requires two steps: first, sending meta-datas about our files, and then sending the actual file.

### Send a document
Before sending the file, we need to give Fetch API basic informations about our documents. We'll send the following params:

* `identifier`: this identifier must be unique across our account, and will be used again if we need to update our document in the future. For now, we'll pick something simple, like `hello-world`.
* `no_hydration`: this flag tells the fetch API we intend to send a file with the document, and it should wait before starting to hydrate the document. We'll set it to `true`.
* `metadatas`: a JSON object containing basic information about our document. For now, we'll simply send a `path` and a `title`.

```sh
$ curl
```

Fetch API will reply with the new document. Keep the `id` somewhere, we'll need it later.

### Send the file
Now that we've created the document on Fetch API, we can associate it with a file. This is a simple file upload:

```sh
$ curl
```

Once sent, your document will be hydrated. Depending on the current load, this can take a few seconds or long minutes. If you're curious about the status of your document, you can ping `http://api.anyfetch.com/documents/<document_id>/raw`: the `hydrating` and `hydrated_by` keys will help you understand which hydraters are taking too much time.

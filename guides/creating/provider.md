---
title: Anyfetch provider
subtitle: Data, data, moar data!
layout: doc
---
A **provider** is the connector that retrieves data. You can use the providers we have "pre-built" or create your own to access any source of data.

> Before reading about creating a new provider, you may be interested in [the hello world tutorial](/guides/tutorials/hello-world.html).

Creating a provider is very simple. Most anyFetch providers are open-source, [check them](https://github.com/search?q=%40AnyFetch+provider).

Basically, a provider is a simple gateway between some data-source (Dropbox, a folder on your computer, Gmail) and anyFetch. You just need to take the data and send them using the [`POST /documents`](/endpoints/#documents-documents-post) and [`POST /documents/:id/file`](/endpoints/#documents-associated-file-post) API endpoints.

## Sending document
Let's say we have a file on our local drive we want to provide.
We also have a token to communicate with anyFetch.

The first step will be to create a new document. Let's send the following JSON to [`POST /documents`](/endpoints/#documents-documents-post):

```json
{
	"identifier": "some-unique-identifier",
	"document_type": "file",
	"metadata": {
		"path": "/home/laptop/document.txt"
	},
}
```

* `identifier` is [a unique identifier of your choosing](/guides/concepts/identifier.html), which can later be used to retrieve or update the document.
* `document_type` is set to `file` (some providers may use semantic information, for instance "customer". Here, we chose not to deal with the complexity: hydration stack will retrieve relevant data from the file).

Although not mandatory, we also chose to send `metadata.path` to improve search relevance and help the hydration getting started the right way.

Alright. Anyfetch should reply with 200 and informations about our document.
Now we can send the file, using a standard multipart POST request including the file (in `file` key) and our previous `identifier`. This will be a multipart POST call on `/documents/identifier/some-unique-identifier/file` (note you can also ping `/documents/:id/file` if you want shorter url).

If everything went well, we'll get `204 No Content` -- our document was stored, and hydration has begun.

## OAuth 2.0
> You should read [how to use a provider](/guides/using/provider.html) for more details about authentication.

Before being able to send data, you need to get a provider token.
The user need to click on the name of your provider in the frontend. He'll then be redirected to the page you registered for initial setup, with a `?code` parameter. Setup everything you need to access your data (maybe there will be OAuth on the other side too, or you need to ask for some configuration).

You can then initiate the OAuth flow by trading the code for an `access_token`.
To do so, send to `POST https://manager.anyfetch.com/oauth/access_token` the following values:

```javascript
{
    client_id: appId,
    client_secret: appSecret,
    redirect_uri: redirect_uri,
    code: code,
    grant_type: 'authorization_code',
}
```

> For more details reagarding the OAuth flow on Anyfetch, see [the OAuth 2.0 guide](/guides/tutorials/oauth.html)

## Lib
Here at anyFetch, we use node.js for our providers to improve latency and send multiple files at once. You can use the [anyFetch](https://www.npmjs.org/package/anyfetch) library from npm, or [anyFetch Provider](https://www.npmjs.org/package/anyfetch-provider). You'll find additional documentation directly on those packages.

## Icons
If you want your provider to display a nice icon on your frontend, please [fork this repo](https://github.com/AnyFetch/anyfetch-assets). That way, your icon will be deployed on all frontends.

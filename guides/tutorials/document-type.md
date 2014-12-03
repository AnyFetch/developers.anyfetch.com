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

What is needed? For each document, we'll need to have a name, a description, categories, an image and a thumbnail. We wish to be able to search by name and description.

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

### ElasticSearch mapping
This one is pretty straightfoward: we just list the keys we want, and the type of data they're supposed to store.

Here is our mapping:

```json
{
  "esMapping": {
    "properties": {
      "metadata": {
        "properties": {
          "name": {
            "boost": 8,
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "categories": {
            "type": "string"
          },
          "thumbnail": {
            "type": "string",
            "index": "not_analyzed"
          }
        }
      }
    }
  }
}
```

Description is a simple string. Categories is an array of string, but is simply indicated as string. Thumbnail should not be analyzed (no search should match the URL) and we gave the name a boost (queries matching the product name will have a high score)

> Note the `image` is not here. This is because we're only describing the `metadata`, and we'll store the `image` in data. The only reason `thumbnail` is in `metadata` is we want to display it in the snippet, and `snippet` can't access `data`.

### Formatting
Now, we want to indicate which data should be returned to the user, and how. We'll have to take into account the fact that some properties may be highlighted and should be handled carefully.

We need to specify this three times: when the document is to be displayed in one line (`title`), as a snippet (`snippet`) and globally (`full`).

For the `title` projection, we'll simply return the product name:

```django
{
  "name": "{{attr "name"}}"
}
```

For `snippet`, we'll return the name, the thumbnail and the categories:

```django
{
  "name": "{{attr "name"}}",
  "thumbnail": "{{attr "thumbnail"}}",
  "categories": [
    {{#list metadata.categories}}
      "{{.}}"
    {{/list}}
  ]
}
```

And for `full`, let's display everything!

```django
{
  "name": "{{attr "name"}}",
  "description": "{{attr "description"}}",
  "image": "{{attr "image"}}",
  "categories": [
    {{#list metadata.categories}}
      "{{.}}"
    {{/list}}
  ]
}
```

This is what we get when merging everything together:

```json
TODO
```

### Templating
Finally, we need to specify how the data should be displayed.
Once again, we have to write this three times, once for each kind of projection.

For the `title`, it's really easy:

```django
{{{ name }}}
```

For `snippet`:

```django
<article class="anyfetch-document-snippet anyfetch-type-product">
  <header class="anyfetch-header">
    <figure class="anyfetch-aside-image">
      <img src="{{ image }}" alt="{{ name }}" />
    </figure>
    <hgroup class="anyfetch-title-group">
      <h1 class="anyfetch-title">{{{ name }}}</h1>
      <p class="anyfetch-title-detail">{{{ job }}}</p>
    </hgroup>
    <main class="anyfetch-content">
      <ul class="anyfetch-inline-list anyfetch-comma-list">
        {{ #email }}
          <li><span class="anyfetch-email">{{ . }}</span></li>
        {{ /email }}
      </ul>
      <ul class="anyfetch-inline-list anyfetch-comma-list">
        {{ #phone }}
          <li><span class="anyfetch-phone">{{ . }}</span></li>
        {{ /phone }}
      </ul>
      <ul class="anyfetch-inline-list anyfetch-comma-list">
        {{ #address }}
          <li><span class="anyfetch-address">{{ . }}</span></li>
        {{ /address }}
      </ul>
    </main>
  </header>
</article>

```

---
title: Creating document-types
subtitle: Display documents the right way
layout: doc
---

In this guide, we'll create a new *document-type* to display a new kind of documents.

The example use case will be a store indexing "products" onto anyfetch, wishing to display them properly.

> Grab a beer, take a seat, this is probably the hardest tutorial on the site.

## What do I need?
To follow this guide, you need:

* An account on anyFetch, with login and password.
* `curl` binary

> We use `curl` for simplicity purpose. Of course, in a real use case, you'll need to use whatever utility your language provide (`http` for node, `curl` for php, `requests` for Python, `Net::HTTP` for Ruby)

## Setting up
Retrieve your token as described on the ["Hello world" tutorial](/guides/tutorials/hello-world.html): `GET /token`.

## Visualizing the final result
We want to be able to index a new kind of documents on the API, and display them properly. For instance, **products** from a database:

![Snippet view](/images/tutorials/document-type/snippet.png)

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

We'll have to specify many things: [how we want to display a document](/guides/concepts/templating.html) (`templates`), [which data should be transferred by the API to the enduser](](/guides/concepts/projection.html)) (`projections`) and which data should be user for searching (`es_mapping`).

### ElasticSearch mapping
This one is pretty straightfoward: we just list the keys we want, and the type of data they're supposed to store.

Here is our mapping:

```json
{
  "es_mapping": {
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

### Projections
Now, we want to indicate which data should be returned to the user, and how. We'll have to take into account the fact that some properties may be highlighted and should be handled carefully.

We need to specify this three times: when the document is to be displayed in one line (`title`), as a snippet (`snippet`) and globally (`full`).

For the `title` projection, we'll simply return the product name:

```django
{%raw%}
{
  "name": "{{attr "name"}}"
}
{%endraw%}
```

For `snippet`, we'll return the name, the thumbnail and the categories:

```django
{%raw%}
{
  "name": "{{attr "name"}}",
  "thumbnail": "{{attr "thumbnail"}}",
  "categories": [
    {{#list metadata.categories}}
      "{{.}}"
    {{/list}}
  ]
}
{%endraw%}
```

And for `full`, let's display everything!

```django
{%raw%}
{
  "name": "{{attr "name"}}",
  "description": "{{attr "description"}}",
  "image": "{{attr "image"}}",
  "categories": [²
    {{#list metadata.categories}}
      "{{.}}"
    {{/list}}
  ]
}
{%endraw%}
```

This is what we get when we merge everything together:

```json
{%raw%}
{
  "projections": {
    "full": "{\n  \"name\": \"{{attr \"name\"}}\",\n  \"description\": \"{{attr \"description\"}}\",\n  \"image\": \"{{attr \"image\"}}\",\n  \"categories\": [\n    {{#list metadata.categories}}\n      \"{{.}}\"\n    {{/list}}\n  ]\n}",
    "snippet": "{\n  \"name\": \"{{attr \"name\"}}\",\n  \"thumbnail\": \"{{attr \"thumbnail\"}}\",\n  \"categories\": [\n    {{#list metadata.categories}}\n      \"{{.}}\"\n    {{/list}}\n  ]\n}",
    "title": "{\n  \"name\": \"{{attr \"name\"}}\"\n}\n"
  }
}
{%endraw%}
```

> You can test your projection with the [anyfetch-handlebars](https://github.com/AnyFetch/anyfetch-handlebars) library.

### Templating
Finally, we need to specify how the data should be displayed.
Once again, we have to write this three times, once for each kind of projection.

For the `title`, it's really easy:

```html
{%raw%}
{{{ name }}}
{%endraw%}
```

For `snippet` (we can only use the `name`, `thumbnail` and `categories` defined earlier):

```html
{%raw%}
<article class="anyfetch-document-snippet anyfetch-type-product">
  <header class="anyfetch-header">
    <figure class="anyfetch-aside-image">
      <img src="{{ thumbnail }}" alt="{{ name }}" />
    </figure>
    <hgroup class="anyfetch-title-group">
      <h1 class="anyfetch-title">{{{ name }}}</h1>
      {{ #categories.length }}
      <ul class="anyfetch-title-detail anyfetch-inline-list anyfetch-comma-list">
      {{ #categories }}
        <li>{{ . }}</li>
      {{ /categories }}
      </ul>
      {{ /categories.length }}
    </hgroup>
  </header>
</article>
{%endraw%}
```

For `full` (where we can use `name`, `description`, `image`, `categories`):

```html
{%raw%}
<article class="anyfetch-document-full anyfetch-type-contact">
  <header class="anyfetch-header">
    <figure class="anyfetch-aside-image">
      <img src="{{ image }}" alt="{{ name }}" />
    </figure>
    <hgroup class="anyfetch-title-group">
      <h1 class="anyfetch-title">{{{ name }}}</h1>
      {{ #categories.length }}
      <ul class="anyfetch-title-detail anyfetch-inline-list anyfetch-comma-list">
      {{ #categories }}
        <li>{{ . }}</li>
      {{ /categories }}
      </ul>
      {{ /categories.length }}
    </hgroup>
  </header>
  <main class="anyfetch-content">
      <p>{{{ description }}}</p>
  </main>
</article>

{%endraw%}
```

And when merging all the templates together:

```json
{%raw%}
{
  "templates": {
    "full": "<article class=\"anyfetch-document-full anyfetch-type-contact\">\n  <header class=\"anyfetch-header\">\n    <figure class=\"anyfetch-aside-image\">\n      <img src=\"{{ image }}\" alt=\"{{ name }}\" />\n    </figure>\n    <hgroup class=\"anyfetch-title-group\">\n      <h1 class=\"anyfetch-title\">{{{ name }}}</h1>\n      {{ #categories.length }}\n      <ul class=\"anyfetch-title-detail anyfetch-inline-list anyfetch-comma-list\">\n      {{ #categories }}\n        <li>{{ . }}</li>\n      {{ /categories }}\n      </ul>\n      {{ /categories.length }}\n    </hgroup>\n  </header>\n  <main class=\"anyfetch-content\">\n      <p>{{{ description }}}</p>\n  </main>\n</article>\n",
    "snippet": "<article class=\"anyfetch-document-snippet anyfetch-type-product\">\n  <header class=\"anyfetch-header\">\n    <figure class=\"anyfetch-aside-image\">\n      <img src=\"{{ thumbnail }}\" alt=\"{{ name }}\" />\n    </figure>\n    <hgroup class=\"anyfetch-title-group\">\n      <h1 class=\"anyfetch-title\">{{{ name }}}</h1>\n      {{ #categories.length }}\n      <ul class=\"anyfetch-title-detail anyfetch-inline-list anyfetch-comma-list\">\n      {{ #categories }}\n        <li>{{ . }}</li>\n      {{ /categories }}\n      </ul>\n      {{ /categories.length }}\n    </hgroup>\n  </header>\n</article>\n",
    "title": "{{{ name }}}"
  }
}
{%endraw%}
```

> You can test your templates with the [anyfetch-assets](https://github.com/AnyFetch/anyfetch-assets) bower package.

### Wrapping up
We can now create our document-type (don't get scared, this is just a merge from all our previous JSON):

```sh
{%raw%}
curl -XPOST \
-H "Authorization: Bearer ${TOKEN}" \
-H "Content-Type:application/json" \
https://api.anyfetch.com/document_types \
-d '{"name":"product","description":"A product in our database","es_mapping":{"properties":{"metadata":{"properties":{"name":{"boost":8,"type":"string"},"description":{"type":"string"},"categories":{"type":"string"},"thumbnail":{"type":"string","index":"not_analyzed"}}}}},"templates":{"full":"<article class=\"anyfetch-document-full anyfetch-type-contact\">\n  <header class=\"anyfetch-header\">\n    <figure class=\"anyfetch-aside-image\">\n      <img src=\"{{ image }}\" alt=\"{{ name }}\" />\n    </figure>\n    <hgroup class=\"anyfetch-title-group\">\n      <h1 class=\"anyfetch-title\">{{{ name }}}</h1>\n      {{ #categories.length }}\n      <ul class=\"anyfetch-title-detail anyfetch-inline-list anyfetch-comma-list\">\n      {{ #categories }}\n        <li>{{ . }}</li>\n      {{ /categories }}\n      </ul>\n      {{ /categories.length }}\n    </hgroup>\n  </header>\n  <main class=\"anyfetch-content\">\n      <p>{{{ description }}}</p>\n  </main>\n</article>\n","snippet":"<article class=\"anyfetch-document-snippet anyfetch-type-product\">\n  <header class=\"anyfetch-header\">\n    <figure class=\"anyfetch-aside-image\">\n      <img src=\"{{ thumbnail }}\" alt=\"{{ name }}\" />\n    </figure>\n    <hgroup class=\"anyfetch-title-group\">\n      <h1 class=\"anyfetch-title\">{{{ name }}}</h1>\n      {{ #categories.length }}\n      <ul class=\"anyfetch-title-detail anyfetch-inline-list anyfetch-comma-list\">\n      {{ #categories }}\n        <li>{{ . }}</li>\n      {{ /categories }}\n      </ul>\n      {{ /categories.length }}\n    </hgroup>\n  </header>\n</article>\n","title":"{{{ name }}}"},"projections":{"full":"{\n  \"name\": \"{{attr \"name\"}}\",\n  \"description\": \"{{attr \"description\"}}\",\n  \"image\": \"{{attr \"image\"}}\",\n  \"categories\": [\n    {{#list metadata.categories}}\n      \"{{.}}\"\n    {{/list}}\n  ]\n}","snippet":"{\n  \"name\": \"{{attr \"name\"}}\",\n  \"thumbnail\": \"{{attr \"thumbnail\"}}\",\n  \"categories\": [\n    {{#list metadata.categories}}\n      \"{{.}}\"\n    {{/list}}\n  ]\n}","title":"{\n  \"name\": \"{{attr \"name\"}}\"\n}\n"}}'
{%endraw%}
```

> Don't forget the document-type name must be unique. If you're following along on this tutorial, you'll need to update the name, or you'll get an `InvalidContent` error.

## Display document
We now need to create a document on the API using our new document-type:

Here is the JSON we'll use (update `document_type` to use your document-type name):

```json
{
  "identifier": "my-product",
  "user_access": [
    "83c26a310d43f9a67d99f917832cad212907e54630f9df99dca1dff5d8b51a50"
  ],
  "document_type": "product",
  "data": {
    "image": "http://developers.anyfetch.com/images/tutorials/document_type/phone.png"
  },
  "metadata": {
    "name": "Nexus 5",
    "description": "Nexus 5 helps you capture the everyday and the epic in fresh new ways. The slimmest and fastest Nexus phone ever made, powered by Android.",
    "categories": [
      "phone",
      "android",
      "nexus"
    ],
    "thumbnail": "http://developers.anyfetch.com/images/tutorials/document-type/phone_thumbnail.png"
  }
}
```

And the resulting curl call:

```sh
curl -XPOST \
-H "Authorization: Bearer ${TOKEN}" \
-H "Content-Type:application/json" \
https://api.anyfetch.com//documents \
-d '{"identifier":"my-product","user_access":["83c26a310d43f9a67d99f917832cad212907e54630f9df99dca1dff5d8b51a50"],"document_type":"product","data":{"image":"http://developers.anyfetch.com/images/tutorials/document_type/phone.png"},"metadata":{"name":"Nexus 5","description":"Nexus 5 helps you capture the everyday and the epic in fresh new ways. The slimmest and fastest Nexus phone ever made, powered by Android.","categories":["phone","android","nexus"],"thumbnail":"http://developers.anyfetch.com/images/tutorials/document-type/phone_thumbnail.png"}}'
```

And *voilà*, we're done! You can try to display `GET /documents/identifier/my-product?render_templates=1` or simply use any frontend:

![Snippet view](/images/tutorials/document-type/snippet.png)

And the full view:

![Full view](/images/tutorials/document-type/full.png)

## What's next?
* You can polish your HTML templates and JSON projections at any time
* You may want to fork 

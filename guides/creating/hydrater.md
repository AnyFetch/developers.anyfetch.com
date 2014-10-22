---
title: anyFetch hydrater
subtitle: Transforming...
layout: doc
---
Documents are enhanced with data on the fly: an image with OCR, a document with full-text extraction. This process is achieved using **hydraters**.

> Before reading about creating a new hydrater, you may be interested in [how to use a hydrater](/guides/using/hydrater.html).

Creating a hydrater is very simple. Most AnyFetch hydraters are open-source, [check them](https://github.com/search?q=%40AnyFetch+hydrater).

A hydrater needs to be registered on AnyFetch using [`POST /hydraters`](endpoints/#hydraters-hydraters-post). When registering your hydrater, you will specify the endpoint to reach and the constraints describing the documents it can handle.

Every time a provider sends data matching those constraints, the hydrater's endpoint will be pinged with the JSON document, a `file_path` parameter with the url to the file and a `callback` url to ping with the new document data.
The hydrater should immediately reply with `202 Accepted` status code, indicating the task has been acknowledged and will be handled in the future.

Don't keep alive this initial request. Reply immediately, close the connection and store tasks in a queue.
You can then take nearly as long as you want to hydrate the document and send your reply to the `callback` URL.

## Specifying constraints
In most cases, you only want to run your hydrater on a specific kind of file. You can specify multiple `filters` in your hydrater configuration: if at least one matches, your hydrater will be called. Here is an example to handle csv files:

```javascript
{
  filters: [
    {
      metadata: {
        path: /\.csv$/i
      },
      documentType: {
        name: 'file'
      },
      filePath: /^./
    },
]
}
```

> Contraints are specified using [this syntax](https://www.npmjs.org/package/match-constraints).

This filter require a `metadata.path` ending with a csv extension, with a `documentType` of `file` and an associated file (`filePath` is empty when the document has no associated file).

### Dependencies
Dependencies indicates that your hydrater requires another hydrater to complete before being able to work. AnyFetch will call the hydrater you depend upon, and after completion calls your hydrater. For instance, to indicate you want to run after the plaintext hydrater (which takes as input any kind of file, and extracts a textual representation from it), you can specify:

```javascript
{
  filters: [
    {
      hydratedBy: {
        $contains: 'https://plaintext.anyfetch.com/hydrate',
      },
      metadata: {
        path: /\.(doc|docx|odt|rtf|ods|xls|xlsx|ppt|pps|pptx|ppsx|odp|key)$/i
      },
      documentType: {
        name: 'document'
      },
      filePath: /^./,
    },
    {
      hydratedBy: {
        $contains: 'https://plaintext.anyfetch.com/hydrate',
      },
      data: {
        "content-type": /^(application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document|application\/vnd\.ms-excel|application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet|application\/vnd\.ms-powerpoint|application\/vnd\.openxmlformats-officedocument\.presentationml\.presentation|application\/vnd\.openxmlformats-officedocument\.presentationml\.slideshow)$/i
      },
      documentType: {
        name: 'document'
      },
      filePath: /^./
    }
  ]
}
```

In this example, all Office files (detected either by extension or by MIME-type) will be hydrated after they've been hydrated by `https://plaintext.anyfetch.com/hydrate`.


### Priority
You can specify a `priority` for your hydrater. Three states are at the moment available:

* Positive number: High priority
* Zero or not specified: Normal priority
* Negative number: Low priority

When several hydraters are matching the document, hydraters having the higher priority will be run before the others. This means for example that low priority hydraters will be run in parallel after every high and normal priority hydraters are successfuly run.

Let's say for instance we want to hydrate `eml` files. The `plaintext` hydrater would return the raw content, which is clearly not interesting. To prevent this behaviour, set a positive priority for the `eml` hydrater, therefore preventing `plaintext`:

```javascript
  priority: 1,
  filters: [
    {
      metadata: {
        path: /\.eml$/i
      },
      documentType: {
        name: 'file'
      },
      filePath: /^./
    },
  ]
```

On the next hdyration round, the document will not match `plaintext` anymore, and the hdyration process will continue.

## Hydrating and providing
In some (rare) cases, you may need to access other documents from the same account (for instance, a zip hydrater creating new documents for each file in the archive). To do this, you are entrusted with the `access_token` used by the provider, so you can create, update or delete other documents on the account.

## Registering a hydrater
To create a hydrater, you can `POST /hydraters` with your hydrater data; for instance:

```javascript
{
  shortName: 'markdown',
  description: 'AnyFetch Hydrater for markdown files.',
  url: 'https://markdown.anyfetch.com/hydrate',
  excludes: ['https://plaintext.anyfetch.com/hydrate'],
  filters: [
    {
      metadata : {
        path: /\.(md|mkd|markdown)$/i,
      },
      documentType: {
        name: 'file'
      },
      filePath: /^./
    },
  ]
}
```

## Lib
Here at AnyFetch, we use Node.js for our hydraters to improve latency and hydrate multiple files at once. You can use the [AnyFetch](https://npmjs.org/package/anyfetch) library from npm, or [AnyFetch Hydrater](https://npmjs.org/package/anyfetch-hydrater). You'll find additional documentation directly on those repos.

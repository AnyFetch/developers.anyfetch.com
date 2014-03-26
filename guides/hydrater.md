---
title: Anyfetch hydrater
subtitle: Transforming...
layout: doc
---

> Before reading about creating a new hydrater, you may be interested in [how to use an hydrater](/guides/using/hydrater.html)

Just like providers, creating an hydrater is quite simple. Most of the anyFetch default hydraters are open-source: you can take a [quick peek at them](https://github.com/search?q=%40Papiel+hydrater) if you have any trouble.

An hydrater needs to be registered on anyFetch, with an endpoint and some constraints for the documents it wants to handle.
Every time a provider sends datas matching those constraints, the endpoint will be pinged with the JSON document, a `file_path` parameter with the url to the file and a `callback` url to ping with the new document.
The hydrater should immediately reply with `202 Accepted` status code, indicating the task has been acknowledged and will be handled in the future.

Don't keep alive this initial request. Reply immediately, close the connection and store tasks in a queue.
You can then take nearly as long as you want to hydrate the document and send your reply to the `callback` URL.

## Specifying constraints
You can add two type of constraints : formatting constraints, and dependencies.

### Dependencies
Dependencies indicates your hydrater require another hydrater to complete before being able to work. The Fetch API will call the hydrater you depend upon, and after completion call your hydrater. For instance, to indicate you want to run after the plaintext hydrater (which takes as input any kind of file, and extracts a textual representation from it), you can say:

```javascript
{
  dependencies: ['http://tikahydrater.anyfetch.com/hydrate'],
}
```

### Formatting constraints
In most of the cases, you only want to run your hydrater on specific kind of file. You can specify multiple `filters` in your hydrater configuration: if at least one match, your hydrater will be called. Here is our previous example, refined to only handle `.csv` files:

```javascript
{
  dependencies: ['http://tikahydrater.anyfetch.com/hydrate'],
  filters: [
    {
      metadatas: {
        path: '\\.csv$'
      },
      document_type: 'document',
    }
]
}
```

## Hydrating and providing
In some (rare) cases, you may need to access other documents (for instance, a zip hydrater creating new documents for each file in the archive). To do this, you are entrusted with the `access_token` used by the provider, so you can create, update or delete other documents on the account.

## Registering an hydrater
Sadly, for now registration must occur at the anyFetch level; please send us your configuration (config object + public url).

## Lib
Here at anyFetch, we use Node.JS for our hydraters to improve latency and hydrate multiple files at once. You can use the [Anyfetch](https://npmjs.org/package/anyfetch) library from npm, or [Anyfetch Hydrater](https://npmjs.org/package/anyfetch-file-hydrater). You'll find additional documentation directly on those repos.

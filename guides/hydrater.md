---
title: Anyfetch hydrater
subtitle: Transforming...
layout: doc
---

Just like providers, creating an hydrater is quite simple. Most of the anyFetch default hydraters are open-source: you can take a quick [peek at them](https://github.com/search?q=%40Papiel+hydrater) if you have any trouble.

An hydrater needs to be registered on anyFetch, with an endpoint and some constraints for the documents it wants to handle.
Every time a provider sends datas matching those constraints, the endpoint will be pinged with the JSON document, a `file_path` parameter with the url to the file and a `callback` url to ping with the new document.
The hydrater should immediately reply with `202 Accepted` status code, indicating the task has been acknowledged and will be handled in the future.

Don't keep alive this initial request. Reply immediately, close the connection and store tasks in a queue.
You can then take nearly as long as you want to hydrate the document and send your reply to the `callback` URL.

## Hydrating and providing
In some (rare) cases, you may need to access other documents (for instance, a zip hydrater creating new documents for each file in the archive). To do this, you are entrusted with the `access_token` from the provider, so you can create, update or delete other documents on the account.

## Lib
Here at anyFetch, we use Node.JS for our hydraters to improve latency and hydrate multiple files at once. You can use the [Anyfetch](https://npmjs.org/package/anyfetch) library from npm, or [Anyfetch Hydrater](https://npmjs.org/package/anyfetch-file-hydrater). You'll find additional documentation directly on those repos.

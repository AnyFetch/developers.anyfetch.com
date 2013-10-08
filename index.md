---
title: Cluestr API documentation
layout: doc
---

This describes the resources that make up the Papiel Client API.
If you have any problems or requests please contact [support](mailto:support@papiel.fr).

> First time using a REST API? Visit our [getting started](getting-started) page.

> In a hurry? Just read [this quick tour](quick-tour) for a fast introduction to Cluestr API.

Cluestr concepts
----------------
Cluestr aggregates documents from multiples sources (so-called *providers*). Datas are then enhanced using *hydraters*, and searchable with the frontend APIs.

For instance, the default Cluestr setup will retrieve datas from Dropbox (the provider), use Apache Tika to read the binary files (pdf, doc, etc.) and extract textual informations (the hydraters) and gives access to this cluster of datas through a simple search API.

The term document is abstract, and can represent a file, a contact or a huge pile of data from some analytics.

To display this variety of sources, the document is affected up to 2 document-types : a *binary document type* (pdf, doc, ppt, html, png, jpg...) and a *semantic document type* (invoice, plane ticket, contact, point of interest...)

APIs Endpoints
--------------
* [Frontend endpoints](/endpoints/frontend) : search documents, find users, access company informations
* [Providers endpoints](/endpoints/providers) : create a new document or update a document previously provided
* [Hydraters endpoints](/endpoints/hydraters) : asynchronously add datas to an existing documents

Guides
-----
* How to create my own frontend? (soon)
* How to create my own provider? (soon)
* How to create my own hydrater? (soon)

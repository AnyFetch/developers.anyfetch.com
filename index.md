---
title: Cluestr API documentation
subtitle: This describes the resources that make up the Papiel Client API.
layout: doc
---

If you have any problems or requests please contact [support](mailto:support@papiel.fr).

> First time using a REST API? Visit our [getting started](/cluestr-doc/getting-started.html) page.

> In a hurry? Just read [this quick tour](/cluestr-doc/quick-tour.html) for a fast introduction to Cluestr API.

Cluestr concepts
----------------
Cluestr aggregates documents from multiples sources (so-called *providers*). Datas are then enhanced using *hydraters*, and searchable with the frontend APIs.

For instance, the default Cluestr setup will retrieve datas from Dropbox (the provider), use Apache Tika to read the binary files (pdf, doc, etc.) and extract textual informations (the hydraters) and gives access to this cluster of datas through a simple search API.

The term document is abstract, and can represent a file, a contact or a huge pile of data from some analytics.

To display this variety of sources, the document is affected up to 2 document-types : a *binary document type* (pdf, doc, ppt, html, png, jpg...) and a *semantic document type* (invoice, plane ticket, contact, point of interest...)

*Projectors* define how to translate raw metadatas to document-types.

APIs Endpoints
--------------
* [Frontend endpoints](/cluestr-doc/endpoints/frontend.html) : search documents, find users, access company informations
* [Providers endpoints](/cluestr-doc/endpoints/providers.html) : create a new document or update a document previously provided
* [Hydraters endpoints](/cluestr-doc/endpoints/hydraters.html) : asynchronously add datas to an existing documents

Guides
-----
* [About projections](/cluestr-doc/guides/projections.html)
* How to create my own frontend? (soon)
* How to create my own provider? (soon)
* How to create my own hydrater? (soon)
* How to create my own document-type? (soon)


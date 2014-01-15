---
title: Anyfetch API documentation
subtitle: This describes the resources that make up the Papiel Client API.
layout: doc
---

If you have any problems or requests please contact [support](mailto:support@papiel.fr).

> First time using a REST API? Visit our [getting started](/anyfetch-doc/getting-started.html) page.

> In a hurry? Just read [this quick tour](/anyfetch-doc/quick-tour.html) for a fast introduction to Anyfetch API.

Anyfetch concepts
----------------
Anyfetch aggregates documents from multiples sources (so-called *providers*). Datas are then enhanced using *hydraters*, and searchable with the frontend APIs.

For instance, the default Anyfetch setup will retrieve datas from Dropbox (the provider), use Apache Tika to read the binary files (pdf, doc, etc.) and extract textual informations (the hydraters) and gives access to this cluster of datas through a simple search API.

The term document is abstract, and can represent a file, a contact or a huge pile of data from some analytics.

To display this variety of sources, the document is affected a *document type* (text_document, image, mail, contact, invoice...).

*Projectors* defines how to translate raw metadatas to document-type. For instance, when we search for an image we don't need all the metadatas : projection is then used to restrict and transform datas to be sent.

APIs Endpoints
--------------
{% include endpoints.md %}

Guides
-----
{% include guides.md %}


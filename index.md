---
title: Anyfetch API documentation
subtitle: Introducing Anyfetch.
layout: doc
---

> If you have any problems or requests please contact [support](mailto:support@papiel.fr).

Anyfetch concepts
----------------
Anyfetch aggregates documents from multiples sources (so-called *providers*). Datas are then enhanced using *hydraters*, and searchable with the *frontend* API.

![Anyfetch workflow](/anyfetch-doc/images/workflow.png)

### Providers and hydraters
Providers and hydraters are the "back-part" from the Fetch API. This is where we'll take raw datas and transform them to something we can use later.

An example workflow would be to connect datas from Dropbox.
This provider will send datas from Dropbox to the Fetch API.

The Fetch API will then redispatch documents to hydration servers.
A dependency graph indicates which hydraters is available for this document.
Every time an hydrater finish its task, a new hydration round is started with new hydraters.

For instance, in the default setup, we use [plaintext.hydrater](https://github.com/Papiel/plaintext.hydrater.anyfetch.com) to read basic information about the document (is it a text document ? an image ?) and extract metadatas. Then, depending on the returned metadatas, Fetch API will send the document with the new metadatas to other hydraters (if it is an image, we'll then apply [ocr.hydrater](https://github.com/Papiel/ocr.hydrater.anyfetch.com), if it is a document we will apply [office hydrater](https://github.com/Papiel/office.hydrater.anyfetch.com), and so on).
Once all available hydraters have yielded their results, the document is indexed and made available for search.

### Document-type
The term document is abstract, and can represent a file, a contact or a huge pile of data from some analytics.

To display this variety of sources, the document is affected a *document type* (text_document, image, mail, contact, invoice...).
This `document-type` can be modified by hydraters.

The default document-type is `file`, but a document-type can also be something less concrete, for instance `mail`, `contact` or `invoice`.

#### Projectors

*Projectors* defines how to transform the raw metadatas to something useful for the user.

For instance, when we search for an image we don't need all the metadatas : projection is then used to restrict, transform, and display the datas to be sent.

### Frontend
Frontends gets access to a search interface across all documents.
Using the `document-type`, they can also format the document the right way to be displayed in a useful way to the user.

Fetch API
--------------
> First time using a REST API? Visit our [getting started](/anyfetch-doc/getting-started.html) page.

Now that we've covered the main principles from Anyfetch, let's get technical and [list the endpoints](/anyfetch-doc/endpoints).


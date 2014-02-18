---
title: Anyfetch API documentation
subtitle: Introducing Anyfetch.
layout: doc
---

> If you have any problems or requests please contact [support](mailto:support@anyfetch.com).

Anyfetch concepts
----------------
Anyfetch aggregates documents from multiples sources (so-called *providers*). Data is then enhanced using *hydraters*, and made searchable through the *frontend* API.

![Anyfetch workflow](/images/workflow.png)

### Providers and hydraters

Providers and hydraters constitute the Fetch API "back-part".
Providers retrieve raw data and send it to the Fetch API.
Hydraters transform and improve this raw data.

#### Providers
An example workflow could start with a provider extracting data from Dropbox, and sending it to the Fetch API.

#### Hydraters
Fetch API would then redispatch documents to the hydration servers.
Hydraters extract metadata from documents.

A dependency graph indicates which hydraters are available for a given document.
Every time a hydrater finishes its task, a new hydration round is started with new hydraters.

#### Example
For instance, in the default setup, we use [plaintext.hydrater](https://github.com/Papiel/plaintext.hydrater.anyfetch.com) to read basic information about the document (is it a text document? an image?) and extract metadata. Then, depending on the returned metadata, the Fetch API will send the document along with this new metadata to other hydraters. If it is image, we would then apply [ocr.hydrater](https://github.com/Papiel/ocr.hydrater.anyfetch.com), if it is an Office document we would apply [office.hydrater](https://github.com/Papiel/office.hydrater.anyfetch.com), and so on.
Once all available hydraters have yielded their results, the document is indexed and made available for search.

### Document-type
The word *document* is used here as an abstract term, and can represent a file, a contact, as well as a huge pile of analytics data.

To reflect this variety of possible sources, the document is affected a *document type* (`text_document`, `image`, `mail`, `contact`, `invoice`...).
This `document-type` can be modified by any of the hydraters along the hydration chain.

The default document-type is `file`, but a document-type can also be something more abstract, for instance `mail`, `contact` or `invoice`.

#### Projectors
*Projectors* define how to transform raw metadata into something useful for the user.

For instance, when we search for an image, we don't need *all* the metadata: projection is then used to restrict, transform, and display the data to be sent.

### Frontend
Frontends get access to a search interface across all documents.
Using the `document-type`, they format the document in order to be usefully displayed to the user.

Fetch API
--------------
> First time using a REST API? Visit our [getting started](/getting-started.html) page.

Now that we have covered the main principles from Anyfetch, let's get technical and [discover the endpoints](/endpoints) exposed by the Fetch API.

Guides
------
{% include guides.md %}

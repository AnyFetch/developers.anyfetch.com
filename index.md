---
title: anyFetch API documentation
subtitle: Introducing anyFetch.
layout: doc
---

> If you have any problems or requests please contact [support](mailto:support@anyfetch.com).
> 
> Note this documentation is still a work in progress. Don't hesitate to contact us with feedbacks or question, we're delighted to help.

anyFetch concepts
----------------
anyFetch aggregates documents from multiples sources (so-called *providers*). Data is then enhanced using *hydraters*, and made searchable through the *frontend* API.

![anyFetch workflow](/images/workflow.png)

### Providers and hydraters
Providers retrieve raw data and send it to anyFetch.
Hydraters transform and improve this raw data.

An example workflow could start with a provider extracting data from Dropbox, and sending it to anyFetch.

anyFetch would then redispatch documents to the hydration servers.
Hydraters extract metadata from documents.

A dependency graph indicates which hydraters are available for a given document.
Every time some hydrater finishes its task, a new hydration round is started with new hydraters.

As an example, in the default setup, we use [plaintext.hydrater](https://github.com/Papiel/plaintext.hydrater.anyfetch.com) to read basic information about the document (is it a text document? an image?) and extract metadata. Then, depending on the returned metadata, anyFetch will send the document along with this new metadata to other hydraters. If it is an image, we would then apply [ocr.hydrater](https://github.com/Papiel/ocr.hydrater.anyfetch.com), if it is an Office document we would apply [office.hydrater](https://github.com/Papiel/office.hydrater.anyfetch.com), and so on.
Once all available hydraters have yielded their results, the document is indexed and made available for search.

> Get more details regarding the use of a [provider](/guides/using/provider.html) or an [hydrater](/guideS/using/hydrater.html).

### Companies and subcompanies
A company holds documents, which can be shared amongst users of the same company. Two companies can never share documents between themselves.

An admin user from a company can create a subcompany, which will hold other documents just like any other company ; however the parent company can delete the subcompany anytime.

### Document-type
The word *document* is used here as an abstract term, and can represent a file, a contact, as well as a huge pile of analytics data.

To reflect this variety of possible sources, each document is affected a *document type* (`text_document`, `image`, `mail`, `contact`, `invoice`...).
This `document-type` can be modified by any of the hydraters along the hydration chain.

The default document-type is `file`, but a document-type can also be something more abstract, for instance `mail`, `contact` or `invoice`.

#### Projectors
*Projectors* define how to transform raw metadata into something useful for the user.

For instance, when we search for an image, we don't need *all* the metadata: projection is then used to restrict, transform, and display the data to be sent.

> Get more details about [projection](/guides/concepts/projection.html).

### Frontend
Frontends get access to a search interface across all documents.
Using the `document-type`, they format the document in order to be usefully displayed to the user.

> Get more details about [templating](/guides/concepts/templating.html) and [frontends](/guides/creating/frontend.html).

anyFetch API
--------------
> First time using a REST API? Visit our [getting started](/getting-started.html) page.

We hope you now grasp the basic ideas surrounding anyFetch. Let's get technical and [discover the endpoints](/endpoints).

Guides
------
{% include guides.md %}

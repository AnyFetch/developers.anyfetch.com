---
title: AnyFetch document-types resources
layout: doc
---

You'll find here the list of default document-types and their expectations.
Don't forget [/resources/hydraters.html](many hydraters can change the `document_type` during the hydration phase).

If you're not satisfied with the default presentation or you find some data are missing:

* You can always add more `metadata`. Even though they won't be shown to the user, the document will still be returned to the user for a relevant query.
* You can create your own document type and make a simple hydrater updating the "old" document-type to the new one.

## File
> ID: 5252ce4ce4cfcd16f55cfa3b

Most basic document type for any kind of binary content.
When a provider sends data without any additional information, it will use this `document_type`.

### Projections
* Snippet
  - title
  - path
  - extension
* Full
  - title
  - path
  - extension

## Document
> ID: 5252ce4ce4cfcd16f55cfa3c

A document with a clean HTML representation: text, doc, xls...

### Projections
* Snippet
  - title
  - path
  - snippet
* Full
  - title
  - path
  - content

## Image
> ID: 5252ce4ce4cfcd16f55cfa3d

Display thumbnail and preview data encoded in base64.

### Projections
* Snippet
  - title
  - thumb
* Full
  - title
  - display

## Contact
> ID: 5252ce4ce4cfcd16f55cfa3a

A person, somewhere. (contact, client, ...)

### Projections
* Snippet
  - name
  - image
  - job
* Full
  - name
  - job
  - phone
  - email
  - image

## EMail
> ID: 5252ce4ce4cfcd16f55cfa3f

An email.

### Projections
* Snippet
  - from
  - to
  - subject
  - snippet
  - date
  - attachmentCount
* Full
  - from
  - to
  - labels
  - subject
  - html
  - date

## Event
> ID: 5252ce4ce4cfcd16f55cfa40

An event, from a calendar for instance.

### Projections
* Snippet
  - name
  - startDate
  - endDate
* Full
  - startDate
  - endDate
  - name
  - description
  - attendee

## Task
> ID: 5252ce4ce4cfcd16f55cfa41

A task, in a TODO app for instance.

### Projections
* Snippet
  - subject
  - description
  - status
* Full
  - subject
  - description
  - assignedTo
  - dueDate

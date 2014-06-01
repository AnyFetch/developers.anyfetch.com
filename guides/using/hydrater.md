---
title: How to use an anyFetch hydrater?
layout: doc
---

Let's say you have an image and you want to extract text from it.
You'll then need [the OCR hydrater](https://github.com/Papiel/ocr.hydrater.anyfetch.com).

Here is the detailed overview of how this will work.

## Hydration workflow
#### Starting a new hydration
To hydrate a document, you need to specify two parameters : the `file_path`, and the `callback` (both URLs).
When you send the request to `/hydrate`, it will be queued on the hydrater's pending tasks queue.
The hydrater will reply with `202 Accepted` and nothing else; the hydration results will later be sent to `callback`.

#### Hydration
When it is your turn, the hydrater will download the file (so it needs to be available from Internet; sending the file as `multipart` on the first call is not allowed, as it would totally explode the hydrater queue).

Hydration will then occur. Once completed, the endpoint you specified as `callback` will be pinged with an `application/json` payload and your hydrated document.

#### Testing
Sometime, you want to test the results and you don't want to ping another adress with the result.
You can then use the `long_poll` option. This is not for production use, and only for testing purposes (anyway, in production, if the hydrater is busy, your request will be dropped). The `long_poll` option returns the result with the request (instead of returning instantly 202).

```sh
$ curl --header "Content-Type:application/json" --data '{"file_path":"https://raw2.github.com/Papiel/ocr.hydrater.anyfetch.com/763ca1c77b33451de3fff733ad850287b48d2f96/test/samples/sample.png", "long_poll":true}' http://ocr.hydrater.anyfetch.com/hydrate
```

```json
{
    "metadatas": {
        "text":"Tesseract sample image. The quick brown fox jumps over the lazy dog.\n\n"
    },
    "document_type":"image"
}
```

### Real hydration workflow
Although this workflow works fine for most hydraters, you'll often need more advanced metadata. Anyfetch often distinguish between a file and a document (a file is a file on a hard drive somewhere, a document is a JSON object with data). Hydraters use the same scheme, and allows you to send a document "to start with". Returned data will be merged with the current data.
To keep going with our previous example, here is a more complex call to the OCR with an initial document:

```sh
$ curl --header "Content-Type:application/json" --data '{"file_path":"https://raw2.github.com/Papiel/ocr.hydrater.anyfetch.com/763ca1c77b33451de3fff733ad850287b48d2f96/test/samples/sample.png", "callback":"http://example.com","long_poll":true, "metadatas": {"previous-datas":"something"}}' http://ocr.hydrater.anyfetch.com/hydrate
```

```json
{
    "metadatas": {
        "previous-datas":"something",
        "text":"Tesseract sample image. The quick brown fox jumps over the lazy dog.\n\n"
    },
    "document_type":"image"
}
```

Any parameter differing from `file_path`, `callback` and `long_poll` will be part of the result document. This behavior allows to "chain" hydraters, which is very useful for some file types.

#### Hydrater status
Hydrater queue can get quite long sometimes. You may want to check the status of an hydrater using `/status` endpoint:

```sh
$ curl http://ocr.hydrater.anyfetch.com/status
```

```json
{
    "status":"ok",
    "queued_items":0
}
```

## Sample hydraters
Anyfetch ships with some default hydraters you may want to check:

* `plaintext.hydrater.anyfetch.com`: retrieve basic information about a file (word, pdf, ppt, txt, rtf, png...). Will extract text if available. [Source](https://github.com/Papiel/plaintext.hydrater.anyfetch.com)
* `ocr.hydrater.anyfetch.com`: retrieve textual information from an image. [Source](https://github.com/Papiel/ocr.hydrater.anyfetch.com)
* `pdf.hydrater.anyfetch.com`: transform a PDF file to HTML. [Source](https://github.com/Papiel/pdf.hydrater.anyfetch.com)
* `office.hydrater.anyfetch.com`: transform an office file to PDF, inject it back onto anyFetch. [Source](https://github.com/Papiel/office.hydrater.anyfetch.com)
* `eml.hydrater.anyfetch.com`: retrieve data from eml files, hydrate mail data and save back the attachments as files on anyFetch. [Source](https://github.com/Papiel/eml.hydrater.anyfetch.com)
* `image.hydrater.anyfetch.com`: generate thumbnails from an image. [Source](https://github.com/Papiel/image.hydrater.anyfetch.com)

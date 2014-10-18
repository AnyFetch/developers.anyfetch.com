---
title: How to use an anyFetch hydrater?
layout: doc
---

Let's say you have an image and you want to extract text from it.
You'll then need [the OCR hydrater](https://github.com/AnyFetch/ocr.hydrater.anyfetch.com).

Here is the detailed overview of how this will work.

## Hydration workflow
#### Starting a new hydration
To hydrate a document, you need to specify two parameters : the `file_path` (an URL to download the file you wish to hydrate), and the `callback` (an URL where you want the hydrater to send the results).
When you send the request to `/hydrate`, it will be queued on the hydrater's pending tasks queue.
The hydrater will immediately reply with `202 Accepted` and nothing else; the hydration results will later be sent to `callback` URL.

#### Hydration
Once previous tasks are finished, the hydrater will download the file from `file_path`.

Hydration will then occur. Once completed, the endpoint you specified as `callback` will be pinged with a `PATCH` verb and a json payload.

#### Testing
For cases where you want to test the results and don't want to ping another adress with the result, you can then use the `long_poll` option. This is not for production use, and only for testing purposes (anyway, in production, if the hydrater is busy, your request will be dropped). The `long_poll` option returns the result with the request (instead of instantly returning 202).

```sh
$ curl --header "Content-Type:application/json" --data '{"file_path":"https://raw2.github.com/AnyFetch/ocr.hydrater.anyfetch.com/763ca1c77b33451de3fff733ad850287b48d2f96/test/samples/sample.png", "long_poll":true}' https://ocr.anyfetch.com/hydrate
```

```json
{
    "metadata": {
        "text":"Tesseract sample image. The quick brown fox jumps over the lazy dog.\n\n"
    },
    "document_type":"image"
}
```

### Real hydration workflow
Although this workflow works fine for most hydraters, you'll often need more advanced metadata. Anyfetch often distinguish between a file and a document (a file is a file on a hard drive somewhere, a document is a JSON object with data). Hydraters use the same scheme, and allows you to send a document "to start with". To keep going with our previous example, here is a more complex call to the OCR with an initial document:

```sh
$ curl --header "Content-Type:application/json" --data '{"file_path":"https://raw2.github.com/AnyFetch/ocr.hydrater.anyfetch.com/763ca1c77b33451de3fff733ad850287b48d2f96/test/samples/sample.png", "callback":"http://example.com","long_poll":true, "metadata": {"previous-data":"something"}}' https://ocr.anyfetch.com/hydrate
```

```json
{
    "metadata": {
        "text":"Tesseract sample image. The quick brown fox jumps over the lazy dog.\n\n"
    },
    "document_type":"image"
}
```

In this particular case, nothing was changed, but some hydraters can use the initial data to compute and improve their results.

#### Hydrater status
Hydrater queue can get quite long sometimes. You may want to check the status of a hydrater using `/status` endpoint:

```sh
$ curl https://ocr.anyfetch.com/status
```

```json
{
    "status":"ok",
    "queued_items":0
}
```

## Sample hydraters
Anyfetch ships with some default hydraters you may want to check, see the [hydrater resource section](/resources/hydraters.html).

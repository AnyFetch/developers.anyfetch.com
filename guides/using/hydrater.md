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
When you POST the request to `/hydrate`, it will be queued on the hydrater's pending tasks queue.
The hydrater will immediately reply with `202 Accepted` and nothing else; the hydration results will later be sent to `callback` URL.

#### Hydration
Once previous tasks are finished, the hydrater will download the file from `file_path`.

Hydration will then occur. Once completed, the endpoint you specified as `callback` will be pinged with a `PATCH` verb and a json payload.

#### Testing
For cases where you want to test the results and don't have another adress to ping, you can use the `http://echo.anyfetch.com` server. This server will simply "echo" back the requests it receives. For instance, you can call the OCR with this:

```sh
$ curl --header "Content-Type:application/json" --data '{"file_path":"https://raw.githubusercontent.com/AnyFetch/ocr-hydrater.anyfetch.com/2552ef2e683020e80884bdb7b339b64f81d25ad3/test/samples/sample.png", "callback":"http://echo.anyfetch.com/sample_ocr_hydration"}' https://ocr.anyfetch.com/hydrate
```

And then, you can view `http://echo.anyfetch.com/sample_ocr_hydration` (the interesting part is under the `body` key):

```json
{
   "url":"/sample_ocr_hydration",
   "headers":{
      "host":"echo.anyfetch.com",
      "connection":"close",
      "accept-encoding":"gzip, deflate",
      "cookie":"",
      "user-agent":"node-superagent/0.18.0",
      "content-type":"application/json",
      "x-request-id":"fd2e36f6-3b59-449a-b32b-aa0fa0e306a4",
      "x-forwarded-for":"87.98.216.35",
      "x-forwarded-proto":"http",
      "x-forwarded-port":"80",
      "via":"1.1 vegur",
      "connect-time":"1",
      "x-request-start":"1417099491530",
      "total-route-time":"0",
      "content-length":"120"
   },
   "query":{

   },
   "body":{
      "metadata":{
         "text":"Tesseract sample image. The quick brown fox jumps over the lazy dog.\n\n"
      },
      "document_type":"image"
   },
   "date":"2014-11-27T14:44:51.551Z"
}
```

You may have to refresh this page multiple times before seeing the content, depending on the hydrater load (that's why hydraters are asynchronous by design, and why you should only use this solution for testing.)

Of course, replace `/sample_ocr_hydration` with any endpoint name you want.

> *Tip*: You can call `GET /status` on any hydrater (e.g. https://ocr.anyfetch.com/status) to see how many tasks are queued.

> *Tip*: If you need your own `echo` server, [fork this project](https://github.com/AnyFetch/echo-server).

### Real hydration workflow
Although this workflow works fine for most hydraters, you'll often need more advanced metadata. Anyfetch often distinguish between a file and a document (a file is a file on a hard drive somewhere, a document is a JSON object with data). Hydraters use the same scheme, and allows you to send a document "to start with". To keep going with our previous example, here is a more complex call to the OCR with an initial document:

```sh
$ curl --header "Content-Type:application/json" --data '{"file_path":"https://raw2.github.com/AnyFetch/ocr.hydrater.anyfetch.com/763ca1c77b33451de3fff733ad850287b48d2f96/test/samples/sample.png", "callback":"http://example.com","metadata": {"previous-data":"something"}}' https://ocr.anyfetch.com/hydrate
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
Hydrater queue can get quite long sometimes. You can check the status of a hydrater using `/status` endpoint:

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

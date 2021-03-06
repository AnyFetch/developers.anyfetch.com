---
title: Getting started with anyfetch
subtitle: The client API is designed to let your app access documents and metadata on anyfetch after processing.
layout: doc
---

The API is standard REST. This page will guide you through all the basics, if you're already familiar with APIs you can skip it and head to the [guides](/guides) ;)

> All examples in this documentation will use CURL. You can find the CURL binary in any UNIX system.

## Schema

All API access is over HTTPS, and accessed from the `api.anyfetch.com` domain. All data is sent and received as JSON.

```sh
$ curl -v -X GET \
https://api.anyfetch.com/status

HTTP/1.1 200 OK
Server: nginx/1.4.2
Date: Tue, 08 Oct 2013 08:59:48 GMT
Content-Type: application/json
Content-Length: 28
Connection: keep-alive
Access-Control-Allow-Headers: Accept, Accept-Version, Authorization, Content-Type, Api-Version, X-Requested-With
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Origin: *

{
	"status": "ok",
	"message": ""
}
```

> Note: throughout this guide, we've left out the `-v` flag. Add it when you want to see the headers.

## JSON extension
All timestamps are returned in ISO 8601 format: `YYYY-MM-DDTHH:MM:SSZ`.

> In Javascript, you can use `new Date(value)` to retrieve the value of a Date Object.

## Parameters

Many API methods take optional parameters. For GET requests, any parameter not specified as a segment in the path can be passed as an HTTP query string parameter:

```sh
$ curl -X GET \
 -H "Authorization: Bearer ${OAUTH-TOKEN}" \
"https://api.anyfetch.com/documents?search=${query}"
```

For POST, PATCH, PUT, and DELETE requests, parameters not included in the URL can be encoded as JSON with a Content-Type of `application/x-www-form-urlencoded`, or sent as a standard HTTP form.

## Client Errors

Expect to receive errors when you send invalid requests. The return code will include a `code` key, and a `message` to help you debug your application.

> In some cases, you'll only get a `4XX` HTTP status. This will happen, for instance, when your `Content-Length` header is invalid, when you try to send a request too large, or when your JSON can't be parsed.

Standard errors include :

* `401 UnauthorizedError`: you did not specify any credentials, or you're using an unsupported `Authorization` scheme
* `401 InvalidCredentialsError`: you did not specify a token, or your token is invalid / has been revoked.
* `403 ForbiddenError`: you are not allowed to access the resource
* `404 ResourceNotFoundError`: you are trying to access a non existing or out-of-scope object.
* `405 MethodNotAllowedError`: you used a POST instead of a GET, or vice versa.
* `409 InvalidArgumentError`: you used a non existing argument.
* `409 MissingParameterError`: you forgot a mandatory parameter.
* `413 Request Entity Too Large`: you are trying to send a document exceeding our capacity (multi giga-byte file anyone?)
* `500 InternalServerError`: we are currently upgrading or experiencing trouble; please try again in a few minutes or read the message for more information.


## HTTP Redirects

anyFetch API uses HTTP redirection where appropriate. Clients should assume that any request may result in a redirection. Receiving an HTTP redirection is not an error and clients should follow that redirect. Redirect responses will have a `Location` header field which contains the URI of the resource to which the client should repeat the requests.

- __301__ Permanent redirection. The URI you requested has been superseded by the one specified in the `Location` header field. This and all future requests to this resource should be directed to the new URI.
- __302, 307__ Temporary redirection. The request should be repeated verbatim to the URI specified in the `Location` header field but clients should continue using the original URI for future requests.


Other redirection status codes may be used in accordance with the HTTP 1.1 spec.

## HTTP Verbs

Where possible, anyfFetch API strives to use appropriate HTTP verbs for each action.

- __HEAD__ Can be issued against any resource to get just the HTTP header info.
- __GET__ Used for retrieving resources.
- __POST__ Used for creating resources, or performing custom actions.
- __PATCH__ Used for updating resources with partial JSON data. For instance, to add a metadata to a document without removing other data, use PATCH on `/providers/documents/`. A PATCH request may accept one or more of the attributes to update the resource. PATCH is a relatively new and uncommon HTTP verb, so resource endpoints also accept POST requests.
- __PUT__ Used for replacing resources or collections. For PUT requests with no `body` attribute, be sure to set the `Content-Length` header to zero.
- __DELETE__ Used for deleting resources.
- __OPTIONS__ Used to request informations.

## Authentication
See [authentication](/authentication.html) for information about authenticating your requests.

## Hypermedia
All resources may have one or more `*_url` properties linking to other resources. These are meant to provide explicit URLs so that proper API clients don’t need to construct URLs on their own. It is highly recommended that API clients use these. Doing so will make future API upgrades easier for developers. All URLs are expected to be proper [RFC 6570](http://tools.ietf.org/html/rfc6570) URI templates.

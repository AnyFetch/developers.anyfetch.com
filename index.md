---
title: Papiel Client API v1.0
layout: doc
---

This describes the resources that make up the Papiel Client API. If you have any problems or requests please contact [support](mailto:support@papiel.fr).

The client API is designed to let your app access documents and metadata on Papiel after processing.

## Schema

All API access is over HTTPS, and accessed from the `api.papiel.fr` domain (or through `yourdomain.com/api` for Papiel Virtual Appliance). All data is sent and received as JSON.


    $ curl -i https://api.papiel.fr/status

    HTTP/1.1 200 OK
    Server: nginx
    Date: Fri, 26 Jun 2013 13:36:17 GMT
    Content-Type: application/json; charset=utf-8
    Connection: keep-alive
    Status: 200 OK

    {
    	"status": "ok"
    }


All timestamps are returned in ISO 8601 format:

`YYYY-MM-DDTHH:MM:SSZ`

## Parameters

Many API methods take optional parameters. For GET requests, any parameters not specified as a segment in the path can be passed as an HTTP query string parameter:


    $ curl -i "https://api.papiel.fr/users?admin=true"

For POST, PATCH, PUT, and DELETE requests, parameters not included in the URL should be encoded as JSON with a Content-Type of `application/x-www-form-urlencoded`:

```
TODO
```

## Client Errors

There are three possible types of client errors on API calls that receive request bodies:

##### Sending invalid JSON will result in a `400 Bad Request` response.

    HTTP/1.1 400 Bad Request
    Content-Length: 35

    {"message":"Problems parsing JSON"}


##### Sending the wrong type of JSON values will result in a `400 Bad Request` response.

    HTTP/1.1 400 Bad Request
    Content-Length: 40

    {"message":"Body should be a JSON Hash"}


##### Sending invalid fields will result in a `422 Unprocessable Entity` response.

    HTTP/1.1 422 Unprocessable Entity
    Content-Length: 149

    {
      "message": "Validation Failed",
      "errors": [
        {
          "resource": "Company",
          "field": "title",
          "code": "missing_field"
        }
      ]
    }

All error objects have resource and field properties so that your client can tell what the problem is. There’s also an error code to let you know what is wrong with the field. These are the possible validation error codes:

- __missing__ This means a resource does not exist.
- __missing_field__ This means a required field on a resource has not been set.
- __invalid__ This means the formatting of a field is invalid. The documentation for that resource should be able to give you more specific information.
- __already_exists__ This means another resource has the same value as this field. This can happen in resources that must have some unique key (such as User name).

If resources have custom validation errors, they will be documented with the resource.

## HTTP Redirects

Papiel API uses HTTP redirection where appropriate. Clients should assume that any request may result in a redirection. Receiving an HTTP redirection is not an error and clients should follow that redirect. Redirect responses will have a `Location` header field which contains the URI of the resource to which the client should repeat the requests.

- __301__ Permanent redirection. The URI you used to make the request has been superseded by the one specified in the `Location` header field. This and all future requests to this resource should be directed to the new URI.
- __302, 307__ Temporary redirection. The request should be repeated verbatim to the URI specified in the `Location` header field but clients should continue to use the original URI for future requests.

Other redirection status codes may be used in accordance with the HTTP 1.1 spec.

## HTTP Verbs

Where possible, Papiel API strives to use appropriate HTTP verbs for each action.

- __HEAD__ Can be issued against any resource to get just the HTTP header info.
- __GET__ Used for retrieving resources.
- __POST__ Used for creating resources, or performing custom actions.
- __PATCH__ Used for updating resources with partial JSON data. For instance, an User resource has `first_name` and `last_name` attributes. A PATCH request may accept one or more of the attributes to update the resource. PATCH is a relatively new and uncommon HTTP verb, so resource endpoints also accept POST requests.
- __PUT__ Used for replacing resources or collections. For PUT requests with no `body` attribute, be sure to set the `Content-Length` header to zero.
- __DELETE__ Used for deleting resources.

## Authentication

There are three ways to authenticate through Papiel Client API.

### Basic authentication
    $ curl -u "username:password" https://api.papiel.fr


### OAuth2 Token (sent in a header)
    $ curl -H "Authorization: token OAUTH-TOKEN" https://api.papiel.fr


### OAuth2 Token (sent as a parameter)
    $ curl https://api.papiel.fr?access_token=OAUTH-TOKEN

Read more about [OAuth2](http://oauth.net/2/). Note that OAuth2 tokens can be acquired programmatically, for applications that are not websites.

## Hypermedia

All resources may have one or more `*_url` properties linking to other resources. These are meant to provide explicit URLs so that proper API clients don’t need to construct URLs on their own. It is highly recommended that API clients use these. Doing so will make future upgrades of the API easier for developers. All URLs are expected to be proper [RFC 6570](http://tools.ietf.org/html/rfc6570) URI templates.

## Pagination

Requests that return multiple items will be paginated to 30 items by default. You can specify further pages with the `?page` parameter. For some resources, you can also set a custom page size up to 100 with the `?per_page` parameter. Note that for technical reasons not all endpoints respect the `?per_page` parameter.

    $ curl https://api.papiel.fr/users?page=2&per_page=100

## Rate limiting

We limit requests to 60 per hour for unauthenticated requests. For requests using Basic Authentication or OAuth, we limit requests to 5,000 per hour. You can check the returned HTTP headers of any API request to see your current status:

    $ curl -i https://api.papiel.fr/foobar/users

    HTTP/1.1 200 OK
    Status: 200 OK
    X-RateLimit-Limit: 60
    X-RateLimit-Remaining: 56

You can also check your rate limit status without incurring an API hit.

    $ curl -i https://api.papiel.fr/rate_limit

    Status: 200 OK
    X-RateLimit-Limit: 5000
    X-RateLimit-Remaining: 4999
    {
      "rate": {
        "remaining": 4999,
        "limit": 5000
      }
    }

---
title: AnyFetch authentication
subtitle: How to authenticate with the API
layout: doc
---

## Authentication
### Authentication types
There are three ways to authenticate with AnyFetch.

#### Basic authentication
```sh
$ curl -H "Authorization: Basic ${BASE64}" \
https://api.anyfetch.com
```

Where `${BASE64}` is the base64 encoding for `user:password`

#### OAuth2 Token (sent in a header)
```sh
$ curl -H "Authorization: Bearer ${OAUTH-TOKEN}" \
https://api.anyfetch.com
```
This is the best way to use your token.

For simple use, you can find a token on [`GET /token`](/endpoints/#account-token).

#### OAuth2 Token (sent as a parameter)
```sh
$ curl "https://api.anyfetch.com?oauth_access_token=${OAUTH-TOKEN}"
```

> Please note: this is really insecure. Anyone with the URL can view the token and reuse it. This should only be used for testing purposes.

### Error codes

* Using no authentication in a request will result in `401 Authorization Required`
* Using invalid authentication will result in `401 InvalidCredentialsError`
* When trying to access a resource that is not part of your current scope, you may get a `404 Not Found` for security reasons

For each endpoint, an exhaustive list of possible errors is described in the doc.

## Request Error
If request is not wellformed, this will result `400 Bad Request` responce.

```http
HTTP/1.1 400 Bad Request
Content-Length: 35

{"message":"Problems parsing JSON"}
```

## Rate Limiting
Most requests are not rate limited for now.

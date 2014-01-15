---
title: Cluestr API authentication
subtitle: How to authenticate with the API
layout: doc
---

There are three ways to authenticate through Cluestr Client API.

### Basic authentication
```sh
$ curl -H "Authorization: Basic ${BASE64}" \
https://api.cluestr.com
```

Where `${BASE64}` is the base64 encoding for `user:password`

### OAuth2 Token (sent in a header)
```sh
$ curl -H "Authorization: token OAUTH-TOKEN" \
https://api.cluestr.com
```
This is the best way to use your token.

### OAuth2 Token (sent as a parameter)
```sh
$ curl https://api.cluestr.com?access_token=OAUTH-TOKEN
```

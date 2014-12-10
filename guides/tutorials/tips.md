---
title: Get the most out of AnyFetch
subtitle: Pro Tips
layout: doc
---

A list of "pro-tips" to improve your usage of the API.

## Batch querying
If you need to chain multiple `GET` calls, you can use [the `GET /batch` endpoint](/endpoints/#misc-batch-calls) to retrieve multiples URLs in one request.

## Output filtering
You can minimize data-transfer on every endpoint of the API by adding `&fields=` to your call.

For instance, [the default `GET /user`](/endpoints/#users-current-user-get) call will render:

```json
{
    "_type": "User",
    "id": "53e0b2257976bdce1f250f93",
    "email": "matthieu@anyfetch.com",
    "name": "Matthieu Bacconnier",
    "is_admin": true,
    "user_url": "https://api-staging.anyfetch.com/users/53e0b2257976bdce1f250f93"
}
```

You can filter this to only retrieve the important stuff, for instance `GET /user?fields=email` and get the following result:

```json
{
    "email": "matthieu@anyfetch.com"
}
```

This also works on sub-objects, see [this readme](https://github.com/AnyFetch/restify-json-filtering#restify-json-filtering) for details.

## Basic authentication
Whenever possible, avoid using `Basic` authentication. It is way slower than `Bearer`, and can lead to security problem.
You can create anonymous tokens from [the manager](https://manager.anyfetch.com).

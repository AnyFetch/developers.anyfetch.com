---
title: Anyfetch frontend
subtitle: Information is beautiful
layout: doc
---

Creating a frontend ranges from very easy to incredibly hard, depending on what you want to achieve.

You'll need to read the documentation for [all endpoints](/endpoints), especially the `/documents/` one.


The [default frontend for anyFetch](https://github.com/Papiel/anyfetch.com) is opensourced, and can be used for inspiration.

## Web frontend
The API sends CORS header, so you can use a single page application -- no need for a server to communicate with the API.

> In the future, you will be able to retrieve a token to avoid storing credentials in cookies.

## Mobile frontend
When using Fetch API, be wary as some endpoints may return megabytes of data. Free memory when you can, and avoid doing network operations on main thread.

---
title: Anyfetch frontend
subtitle: Information is beautiful
layout: doc
---

Creating a frontend range from very easy to incredibly hard, depending on what you want to achieve.

You'll need to read the documentation for [all endpoints](/endpoints), especially the `/documents/` one.


The [default frontend for anyFetch](https://github.com/Papiel/anyfetch.com) is open-sourced, and can be used for inspiration. You're welcome to fork.

## Web frontend
The API sends CORS header, so you can use a single page application -- no need for a server to communicate with the API.


## Mobile frontend
When using Fetch API, be wary as some endpoints may return megabytes of data. Free memory when you can, and avoid doing network operations on main thread.

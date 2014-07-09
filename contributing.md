---
title: Guidestyle
subtitle: Coding convention
layout: doc
---

All projects follow the same convention.
> Before trying to apply this, make sure the linter `npm run-script lint` passes ok.

## File structure
* First line of any file must be `"use strict";` to enable strict mode.
* Then comes the `require`s. All requires must be here, except for circular-dependencies edge cases.
    * First requires are for npm libraries (in `node_modules`)
    * Then a new line
    * Then internal files.

```javascript
'use strict';

var fs = require('fs');

var auth = require('../helpers/auth.js');
var buildQuery = require('../helpers/query-builder.js');
```

* Top-level functions are separated with two new lines. This is the only case where there is two consecutive blank lines.

```javascript
function a() {
}


function b() {
  function c() {
  }

  function d() {
  }
}
```

* Use `module.exports` and not `exports` or `this.`.
* Do not define global function, use `var name = function() {}`.

## Code structure
* Variable names are `lowerCamelCase`, class names are `UpperCamelCase`, constants are `UPPER_CASE`.
* Opening braces are on the same line as the statement
* One variable per `var` statement, making it easier to reorder the lines.
* No space before parenthesis
* No parenthesis around JS keywords (`delete`, `typeof`, ...)
* Returns function values as soon as possible (minimize indentation!)

```javascript
function isPercentage(val) {
  if(val < 0) {
    return false;
  }
  if(val > 100) {
    return false;
  }

  // Do something complicated
  return true;
}
```

* Comments starts with a space
* Ternary operator `:` is used with a space before and after
* Don't use a space after a space (unless for indentation of course)

## Application Packaging

For easier deployment we need the AnyFetch Applications to follow a few conventions to have things running smoothly.

### Executables

- `bin/server` your main http server endpoint
- `bin/init/*` any indempotent script you want to add to initialize your application (ex: seeding)

### Environment Variables

- `NODE_ENV` either set as `production`, `development` or `test`, default should be `development`
- `PORT` the port to expose your app, default should be `8000`
- `REDIS_URL` (optional) the redis url, default should be `redis://localhost`
- `API_URL` (optional) when you rely on an anyfetch api address, expose this address, default should be `https://api.anyfetch.com`
- `MANAGER_URL` (optional) when you rely on anyfetch manager/oauth address, expose this address, default should be `https://manager.anyfetch.com`
- `NEW_RELIC_LICENSE_KEY` (optional) the newrelic licence key
- `NEW_RELIC_NO_CONFIG_FILE` (optional) the new relic config file relative to the project root
- `NEW_RELIC_APP_NAME` (optional) The app name for new relic

#### Provider specific

- `ANYFETCH_API_ID` the oauth anyfetch api client id (available on the manager)
- `ANYFETCH_API_SECRET` the oauth anyfetch api client secret (available on the manager)
- `<provider>_API_ID` the oauth provider api client id
- `<provider>_API_SECRET` the oauth provider api client secret
- `<provider>_URL` the url to access the provider

## Contributing workflow
* Do not merge into `master` directly unless you're project owner and you know what you're doing. Always do a pull request.
* Use CI everywhere. Test new features.

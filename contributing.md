---
title: Guidestyle
subtitle: Coding convention
layout: doc
---

All projects follow the same convention.
> Before trying to apply this, make sure the linter `npm run-script lint` passes ok.

## File structure
* First line of any file must be `"use strict";` to enable strict mode.
* Then comes documentation for the current file, JSDoc style.
* Then comes the requires. All requires must be here, except for circular-dependencies edge cases.
    * First requires are for npm librarires (in `node_modules`).*
    * Then a new line
    * Then inner libraries.
    * Then outer libraries.

```javascript
'use strict';
/**
 * @file Define handlers for documents
 *
 * This is the core handler for this API.
 */

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
* Every function is documented using JSDoc style

```javascript
/**
 * Retrieve a single document from its ID.
 *
 * @param {string} id id to be retrieved
 * @param {model/User} user User asking for the document
 * @param {Function} cb Callback to call once document is retrieved. First argument is the error (if any), second is the document.
 */
var documentFromId = function(id, user, cb) {
}
```

* Variable names are `lowerCamelCase`, class names are `UpperCamelCase`, constants are `UPPER_CASE`.
* Opening braces are on the same line as the statement
* One variable per var statement, making it easier to reorder the lines.
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

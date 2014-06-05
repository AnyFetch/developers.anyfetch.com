---
title: anyFetch frontend
subtitle: Integrate AnyFetch within your apps
layout: doc
---

In this tutorial, you will see how to create a **very simple Web frontend from scratch, based on AnyFetch power**. It will help you understand how to master anyFetch API and take the most out of each endpoint.

Creating a frontend range from very easy to incredibly hard, depending on what you want to achieve. The purpose of this tutorial being to understand the anyFetch API principles, we will keep it simple and code in raw javascript. No complex framework, compiled scripts... **Only you, javascript and the anyFetch API.** *(well... to make it a bit simpler, we will still use 2 very famous framework: jQuery for simple ajax calls and Bootstrap for building quick and simple mockups)*

#### Don't want to start from scratch?

We already developed in open-source a [ready-to-use front end](https://github.com/Papiel/app.anyfetch.com). It is based on AngularJS, in order to have a client-side MVC. You're welcome to fork or take a look for inspiration.

## Preparations

During this tutorial, you may refer to the [endpoints documentation](/endpoints) to have an exhaustive list. If this is the first time you are using a REST API, visit our [getting started](/getting-started.html) page.

We are going to split the work in **5 steps**. Each one of them will help you master an important concept of the API.

1. **Your first API calls**: using basic authentication, you will learn what you can get from basic endpoints such as ```/company```. We will also take a look on how to do batch calls.
2. **Search for the truth**: based on a simple form and some JS code, you will be able to search for documents using the ```/document?search=(...)``` endpoint. We will cover the multiples filtering possibilities it can offer.
3. **Display documents**: we will take a look on how to display documents directly in the web app thanks to the API.
4. **Get secure**: because security is not optional, we will take it to the next step. We will learn how to use the API with tokens to implement a safer communication with the server.
5. **Your imagination is the only limit**: you are now ready to enjoy the power of anyFetch and intergrate it everywhere. Mobile, web, native... This step has to be defined by you.

All the code generated is available on [this repo](https://github.com/anyfetch/anyfetch-frontend-tuto).

Ready to go? :)

## 1. Your first API calls

### First bootstrap

Let's start by bootstraping a very simple environement, with 3 main files:

```
index.html
¦ scripts/
¦ ¦ anyfetch.js
¦ styles/
¦ ¦ main.css
```

The `index.html` file is linked to the [Bootstrap](http://getbootstrap.com/) and [jQuery](http://jquery.com/) source code from a CDN ; to our empty (for now ;) stylesheet and our JS script file:

```html
<html>
	<head>
		<title>My awesome anyFetch frontend</title>
		<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
		<link rel="stylesheet" type="text/css" href="styles/main.css">
	</head>
	<body>
		<h1>Hello anyFetch</h1>

		<script src="//code.jquery.com/jquery-2.1.1.min.js"></script>
		<script src="scripts/anyfetch.js"></script>
	</body>
</html>
```

### First API call on /status

Our first API calls will be a GET on `/status`. It will return the global status for the API and will be a way to make sure it is up and running. There is no need to be authentificated to call this endpoint, we will just need a simple ajax call:

```javascript
// Get the API status
var jqxhr = $.ajax({
		type: 'GET',
		dataType: 'json',
		url: 'https://api.anyfetch.com/status'
	})
	// All went well
  .done(function(data) {
    console.log( data );
  })
  // An error occured
  .fail(function(jqXHR, textStatus) {
    console.log("An error occured: ", textStatus, jqXHR );
  });
```

You should now see a `{status: "ok", message: ""}` in your browser console when you are loading index.html. Let's modify our html a bit in order to be able to display the API status right away:

```html
<h1>Hello anyFetch! It seems like your are <span id="apiStatus">loading...</span></h1>
```

Then, we just need to update `#apiStatus` when our ajax call is `done`:

```javascript
$('#apiStatus').html(data.status);
```

### Basic Authentication

If we want to make more interesting API calls, we need now to authenticate. In the first 3 parts of this tutorials, we will use a Basic Authentication to make our calls. You need to base64 encode your login and password separated with a colon, and include it in the header. For instance, the login `test@anyfetch.com` and password `password` will be encoded as `test@anyfetch.com:password`, which is `dGVzdEBhbnlmZXRjaC5jb206cGFzc3dvcmQ=`.

It is pretty straight forward to do so in javascript, just use the function `btoa`:

```javascript
var login64 = btoa('test@anyfetch.com:password');
```

The encoded login need to be added on the `Authorization` header, after the `Basic ` mention. 

```javascript
headers: {
	'Authorization': 'Basic '+login64
}
```

We will do API calls pretty often, so let's refactor a bit and create an `apiCall` function:

```javascript
var apiCall = function(endpoint, callback) {
	$.ajax({
			type: 'GET',
			dataType: 'json',
			url: 'https://api.anyfetch.com'+endpoint,
			// Basic Authentication
			headers: {
				'Authorization': 'Basic '+login64
			}
		})
		// All went well
	  .done(function(data) {
	    callback(data, null);
	  })
	  // An error occured
	  .fail(function(jqXHR, textStatus) {
	    console.log("An error occured: ", textStatus, jqXHR );
	    callback(null, textStatus);
	  });
}
```

It will do a authentificated API call on the `endpoint` sent in parameter and trigger the `callback` function when it is done. It has 2 parameters: data, error.

The code to get the API status is a bit simpler now:

```javascript
apiCall('/status', function(data, err) {
	if (err) {
		return err;
	}

	// Update API status on index.html
	$('#apiStatus').html(data.status);
});
```

### Call on /company

The `/company` endpoint will provide you with the company ID, name and a list of hydraters your company is using. Let's create a sidebar in our homepage to put various interesting information:

```html
<div class="container">
	<div class="col-sm-8">
		<!-- This will contain main content -->
	</div>
	<div class="col-sm-4 sidebar">
		<h4>Logged as <span id="companyName">loading...</span></h4>
		<p>The API is: <span id="apiStatus">loading...</span></p>
	</div>
</div>
```

With a couple lines of CSS:

```css
.sidebar {
	border-left: #ddd 1px solid;
}
```

We are just missing the JS script to load the company information:

```javascript
apiCall('/company', function(data, err) {
	if (err) {
		return err;
	}

	$('#companyName').html(data.name);
});
```

# RAW

*from previous version. For inspiration, to be deleted when tutorial is over*

## Web frontend
The API sends CORS header, so you can use a single page application -- no need for a server to communicate with the API.


## Mobile frontend
When using anyFetch, be wary as some endpoints may return megabytes of data. Free memory when you can, and avoid doing network operations on main thread.

## Principles
### Endpoints
Three endpoints are really useful for frontend-related queries:

* [`GET /documents`](/endpoints/#documents-documents-get) : to search in all documents, filter by document-type, provider, date...
* [`GET /document_types`](/endpoints/#document-types-document-types) : to retrieve templates associated with document-types
* [`GET /providers`](/endpoints/#providers-providers) : to retrieve the name of a provider, and its type

Since these 3 endpoints are available with `GET`, you may want to try [batch calls](/endpoints/#index-batch-calls).

### Templating
[Templating](/guides/concepts/templating.html) will be very useful to display data.
However, if you want you can reimplement a templating system to display data the way you want.

You'll need to read the documentation for , especially the `/documents/` one.

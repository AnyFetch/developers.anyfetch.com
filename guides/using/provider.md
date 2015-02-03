---
title: How to use an anyFetch provider?
layout: doc
---

Unlike [hydraters](/guides/using/hydrater.html), you'll probably never need to use a provider on its own -- you'll always let anyFetch handle all communication.

Still, here's a quick overview of what's happening when you're using a provider.

# Provider workflow
## Init
For security reasons, [the manager](https://manager.anyfetch.com) is the only app which let users add providers. When the user requests a new connection, the manager will call `/init/connect` on the provider server. This request will include a `?code` parameter, which is an `authorization_grant` that will later be traded for an OAuth token.
This endpoint will (often) display some setup page or redirect to another provider page to get a grant.

The Dropbox provider, for instance, will create a Dropbox token and redirect the user to the Dropbox consentment page.
The GMail provider will redirect to Google consentment page, storing the `code` for later use.
The local provider will display a HTML form asking you for informations about the data you wish to provide.

Once provider setup is completed (authorization has been granted, ...), the user will be redirected to `/init/callback`. Most often, the initial `?code` parameter will still be there (sometimes the provider will store this in a cookie, although this is not a good REST practice).

From there, the `code` will be traded for an actual anyFetch OAuth token by calling `POST https://manager.anyfetch.com/access_token` with `client_id`,
`client_secret`, `code` and `grant_type` (with a value of 'authorization_code')

The provider will then store both data (anyFetch token and configuration settings) for later use, and is ready to update.

## Update (pull new documents)
When a call to `POST /update` is made (with a parameter specifying the `access_token` to update), the provider will retrieve a list of documents to send.

> The API has a convenience helper: calling `POST /company/update` will update all providers from the company.

An http status code of `202 Accepted` will be immediately returned, while the provider gathers a list of resource to send.
If an update of the `access_token` is already pending, the status will be `429 Too Many Requests`.

The provider will then asynchronously send documents to anyFetch.

## Delete provider
When an authorization is revoked, the manager will automatically call `DELETE /token` to remove tokens.

## Creating my own provider
Anyone can create a new provider on Anyfetch. See [How do I create my own provider?](/creating/provider.html) for more details.

## Sample providers
anyFetch ships with some default providers you may want to check:

* `dropbox.anyfetch.com`: connect a Dropbox account. [Source](https://github.com/AnyFetch/dropbox-provider.anyfetch.com)
* `gmail.anyfetch.com`: connect a GMail account. [Source](https://github.com/AnyFetch/gmail-provider.anyfetch.com)
* `gdrive.anyfetch.com`: connect a Google Drive account. [Source](https://github.com/AnyFetch/gdrive-provider.anyfetch.com)
* `local.anyfetch.com`: sync a local directory with anyFetch. [Source](https://github.com/AnyFetch/local-provider.anyfetch.com)
* `salesforce.anyfetch.com`: connect a Salesforce account. [Source](https://github.com/AnyFetch/salesforce-provider.anyfetch.com)
* `evernote.anyfetch.com`: connect an Evernote account. [Source](https://github.com/AnyFetch/evernote-provider.anyfetch.com)
* `linkedin.anyfetch.com`: connect a Linkedin account. [Source](https://github.com/AnyFetch/linkedin-provider.anyfetch.com)
* `box.anyfetch.com`: connect a Box account. [Source](https://github.com/AnyFetch/box-provider.anyfetch.com)

> Why don't you create your own? See [How do I create my own provider?](/creating/provider.html) for more details.

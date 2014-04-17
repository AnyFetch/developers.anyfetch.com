---
title: How to use an Anyfetch provider?
layout: doc
---

Unlike [hydraters](/guides/using/hydrater.html), you'll probably never need to use a provider on its own -- you'll always let the Fetch API handle all communication.

Here is however a quick overview of the basic workflow for a provider.

# Provider workflow
## Init
The first endpoint will be `/init/connect`. This call should include a `?code` parameter, which is an `authorization_grant` to be used later on the OAuth flow for authentication on the Fetch API servers.
This endpoint will (often) display some setup page or redirect to another provider page to get a grant.

The Dropbox provider, for instance, will create a token and redirect the user to the Dropbox consentment page.
The local provider will display a HTML form asking you for informations about the datas you wish to provide.

Once setup is completed (authorization has been granted, ...), the provider will then redirect the user to `/init/callback`. Most often, the `?code` parameter will still be there (sometimes the provider will store this in a cookie, although this is not a good REST practice).

From there, the `code` will be traded for an actual Fetch API OAuth token.

The provider is now ready for use.

## Update (pull new documents)
When a call to `/update` is made (with a POST parameter specifying the `access_token` to update), the provider will retrieve a list of documents to send.

An http status code of `202 Accepted` will be immediately returned, while the provider gathers a list of resource to send.
If an update of the `access_token` is already pending, the status will be `204 No Content`.

The provider will then asynchronously send documents to Fetch API.

## Sample providers
Anyfetch ships with some default providers you may want to check:

* `dropbox.provider.anyfetch.com`: connect a Dropbox account. [Source](https://github.com/Papiel/dropbox.provider.anyfetch.com)
* `gmail.provider.anyfetch.com`: connect a GMail account. [Source](https://github.com/Papiel/gmail.provider.anyfetch.com)
* `gdrive.provider.anyfetch.com`: connect a Google Drive account. [Source](https://github.com/Papiel/gdrive.provider.anyfetch.com)
* `dropbox.provider.anyfetch.com`: connect a Dropbox account. [Source](https://github.com/Papiel/dropbox.provider.anyfetch.com)
* `local.provider.anyfetch.com`: sync a local directory with anyFetch. [Source](https://github.com/Papiel/local.provider.anyfetch.com)
* `salesforce.provider.anyfetch.com`: connect a Salesfetch account. [Source](https://github.com/Papiel/salesforce.provider.anyfetch.com)
* `evernote.provider.anyfetch.com`: connect an Evernote account. [Source](https://github.com/Papiel/evernote.provider.anyfetch.com)
* `box.provider.anyfetch.com`: connect a Box account. [Source](https://github.com/Papiel/box.provider.anyfetch.com)

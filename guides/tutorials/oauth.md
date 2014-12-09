---
title: Creating a OAuth application
subtitle: OAuth2 flow on AnyFetch
layout: doc
---

AnyFetch implements OAuth2 flow.
OAuth lets you request token on behalf of a user, and use the associated AnyFetch account according to the `scopes` you required (reading documents, writing documents...)

## Concepts
The OAuth flow is not handled from the usual `https://api.anyfetch.com` host, but from `https://manager.anyfetch.com`.

AnyFetch does not implement `refresh_token`. The delivered `access_token` are long-lived and can be reused confidently.

Apart from that, the OAuth flow follows the [RFC6749 specification](https://tools.ietf.org/html/rfc6749).

## Creating an application
From your AnyFetch account, visit the "[Developers](https://manager.anyfetch.com/developers)" page on the manager website, and click on "[Create a new application](https://manager.anyfetch.com/developers/new)".

You need to fill-in some values:

* **Application name**: the name of your Application. It will be used when the user is prompted to grant authorization on his account
* **Description**: A few lines of description
* **Callback URI**: a URL where the user will be transported back after giving consent. TODO: urn?
* **OAuth application**: leave this unchecked if you're making a provider, else keep it on!
* **Required scopes**: check all the scopes required by your application. The [endpoint list](/endpoints) indicates the required scope for each endpoint, just hover the lock icon.

You will be able to edit those values later. For now, click on OK.

You should see you application `app_id` and `app_secret`, keep the last one somewhere safe and private!

![App credentials](/images/tutorials/oauth/app_credentials.png)

## Requesting a new token for a user
Now that you have a new application, you probably want users.

### Grant access
To authorize a user, you need to redirect him to `https://manager.anyfetch.com/oauth/authorize?client_id={CLIENT_ID}&redirect_uri={ENCODED_REDIRECT_URI}`.

> Redirect URI must match exactly the value you entered earlier.

You may add optional parameters:

* **replace_existing_token**: when the user is accessing your application for the first time, this parameter is ignored. Else, set this value to `true` to remove the previous token, skip the grant part and redirect automatically with a new code to your `redirect_uri`.
* **approval_prompt**: when used with `replace_existing_token`, set the value to `true` to re-display the grant. For security reasons, if you updated your application scope, the grant page will always be displayed.

The user will be prompted to authenticate, and should then see the following grant page:

![Grant page](/images/tutorials/oauth/grant.png)

When the user clicks "Allow", he will be redirected to your `redirect_uri` with a few querystring parameters:

* **code**: an oauth code, to be traded later, the most important parameter
* **return_to** the URL where the initial application required to be sent back once the OAuth flow complete. This is mostly used for providers, and can safely be ignored for OAuth applications.

### Exchange code for access_token
You now need to send a HTTP POST request to `https://manager.anyfetch.com/oauth/access_token`, with the following parameters:

* **client_id**: your `app_id`, created on the first section
* **client_secret**: your `app_secret`, created on the first section
* **code**: thoe `code` sent to your `redirect_uri`. Be careful, the `code` is only valid for a few minutes.
* **grant_type** should be "authorization_code", according to the spec.

With curl:

```sh
curl -XPOST \
https://manager.anyfetch.com/oauth/access_token \
--data "client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET&code=$CODE&grant_type=authorization_code"
```

You should now be able to retrieve your user token:

```json
{
    "token_type": "bearer",
    "access_token": "02f24ba563915e1cb93dcaf8beffa10766db2467"
}
```

### Use the API on behalf of the user
Congratulations, you're done!

You can check everything worked:

```sh
curl \
-H "Authorization: Bearer $TOKEN" \
https://api.anyfetch.com
```

You should see the following (the `/` endpoint require no scope):

```json
{
    "user_email": "matthieu.bacconnier@anyfetch.com",
    "user_id": "547c7674c73384fa1615b3b7",
    "documents_url": "https://api.anyfetch.com/documents/",
    "document_types_url": "https://api.anyfetch.com/document_types/",
    "providers_url": "https://api.anyfetch.com/providers/",
    "users_url": "https://api.anyfetch.com/users/",
    "current_user_url": "https://api.anyfetch.com/users/547c7674c73384fa1615b3b7",
    "update_url": "https://api.anyfetch.com/company/update",
    "reset_url": "https://api.anyfetch.com/company/reset",
    "token_url": "https://api.anyfetch.com/token",
    "server_time": "2014-12-09T09:32:21.874Z"
}
```

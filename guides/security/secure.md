---
title: Securing companies
subtitle: Toggling the `secure` flag
layout: doc
---

When POSTing / PATCHing a company or POSTing / PATCHing a subcompany, admin users can update the company's `secure` flag.

This flag is a company-wide status to activate strict mode on the company.

The default `secure` value is inherited from the parent company.

Admins can toggle this flag on and off, please note however that switching from `false` to `true` does not discard previous documents; so the admin may first need to send a `DELETE /company/reset` and clean up the whole company after toggling the flag to ensure that all documents are secure.

## What is `secure` mode?
When `secure` is true, only trusted providers will be able to POST / PATCH documents. Other attempts will results in a `403 InsecureOperation` error.

This ensure absolutely no XSS can happen on the company.

## When should I activate `secure` mode?
If you're embedding AnyFetch in critical pieces (for instance in a CRM), you should enable the `secure` flag to ensure no secure content is leaked through a crafted attack.

If some of your users owns critical documents and the AnyFetch token is sent in clear form on your frontend, you may need to `secure` your company too.

All in all, you should balance the risks for XSS attacks with the benefits of non-trusted providers.

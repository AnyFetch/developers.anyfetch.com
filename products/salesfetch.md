---
title: Installing and configuring Salesfetch
subtitle: How to use Salesfetch
layout: doc
---

Welcome to Salesfetch!

This guide will get you started on installing and configuring Salesfetch for Salesforce.

## Pre-requisites
First and foremost, you'll need to be an admin of your Salesforce account, or at least to be permitted to install a new package.

We recommend you to try the package installation on a test organization before changing anything in your production setup. Salesforce makes it easy [to create sandbox environment](https://help.salesforce.com/HTViewHelpDoc?id=create_test_instance.htm&language=en_US) mimicking your current setup.

## Installation
You should have received a link to install Salesfetch.
Paste this link into your browser while logged in.

You should see the following:

![Package installation](/images/products/salesfetch/package-installation.png)

Click on "Continue".
A new window will prompt you to allow the app to communicate with our servers.
Those servers are hosted on Heroku, and no Salesforce data is exported beyond those servers.

![Approve third party access](/images/products/salesfetch/approve-third-party.png)

On the next screen, the permission used by the package will be displayed. Salesfetch only use `read` access to your objects.

![API access](/images/products/salesfetch/package-api-access.png)

If your Salesforce Edition is Enterprise or Unlimited, you will see an option to select a security level. We recommend Grant access to all users.

![Security Level](/images/products/salesfetch/security-level.png)

You're nearly done! Click on "Install".

![Install complete](/images/products/salesfetch/install-complete.png)

Don't leave now! You need to click on the small "[View](https://anyfetch.eu3.visual.force.com/apex/FirstRun)":

![Install complete](/images/products/salesfetch/post-install.png)

Leave the setting untouched, unless explicitly asked otherwise by AnyFetch -- just click "Complete package installation":

![First run](/images/products/salesfetch/first-run.png)

Installation is now complete, you can add Salesfetch to your Salesforce objects. Keep reading!


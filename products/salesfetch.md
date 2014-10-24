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
Paste this link into your browser while logged in to Salesforce.

You should see the following:

![Package installation](/images/products/salesfetch/package-installation.png)

Click on **"Continue"**.
A new window will prompt you to allow the app to communicate with our servers.
Those servers are hosted on Heroku, and no Salesforce data is exported beyond those servers.

![Approve third party access](/images/products/salesfetch/approve-third-party.png)

On the next screen, the permission used by the package will be displayed. Salesfetch only use `read` access to your objects.

![API access](/images/products/salesfetch/package-api-access.png)

If your Salesforce Edition is Enterprise or Unlimited, you will see an option to select a security level. We recommend **"Grant access to all users"**.

![Security Level](/images/products/salesfetch/security-level.png)

You're nearly done! Click on **"Install"**.

![Install complete](/images/products/salesfetch/install-complete.png)

Don't leave now! You need to click on the small **"View**":

![Install complete](/images/products/salesfetch/post-install.png)

Leave the setting untouched, unless explicitly asked otherwise by AnyFetch -- just click **"Complete package installation"**:

![First run](/images/products/salesfetch/first-run.png)

> Do *not* use the "clear master key" button, you'd lose all your data on Anyfetch.

Installation is now complete, you can add Salesfetch to your Salesforce objects. Keep reading!

## Configuring Salesfetch
### For desktop
Let's say you want to display a Salesfetch timeline next to your contacts in the desktop edition of Salesforce.

To do so, we need to create a Visual Force Page.
Move to your VisualForce Pages administration panel in **App Setup > Develop > Pages** and create a new one by clicking on the **New** button on top of the page list.

This page will be inserted in the Contact layout.
Add in the Label input: "`Context Contact`" and in the Name input: "`ContextContact`". You can now fill the Visualforce Markup text area with this code:

```html
<apex:page StandardController="Contact">
    <anyfetch:IframeComponent Query="{!Contact.Name}" 
        SFDCId="{!Contact.Id}" 
        Display="{!Contact.Name}" 
        Type="Contact">
    </anyfetch:IframeComponent>
</apex:page>
```

![Visual Force Page for contact](/images/products/salesfetch/force-page.png)

When you're done, click on **Save** on the top menu.

Then go to the Contact Page Layout, in **App Setup > Customize > Contacts > Page Layouts**. If you have more than one layout, execute the following instruction on each layout to allow all users to access the context panel. Click on **Edit** next to the layout.

Click and drag on **Visualforce Pages > Section** and drop it just after your custom link section. The following panel should be displayed.

![Layout properties](/images/products/salesfetch/layout-properties.png)

Name the newly created section `Context`, deselect `Edit Page` and select `1-Column Layout` (required). Then click on **Ok**.

![Section properties](/images/products/salesfetch/section-properties.png)

On the top of the page drag the **ContextContact** in **Visualforce Pages > ContextContact** and drop it in your **Context Panel**. A small wrench icon should be displayed on the top-right hand corner of the ContextContact panel, click on it to display the following modal panel. You can now adjust the size of the context page. Check that the Width property is set to `100%` and set the Height to at least `400px`. Then click on **Ok**.

![Visual force page properties](/images/products/salesfetch/visualforce-page-property.png)

Your Context is now integrated in your layout, you can save this layout by clicking on **Save** on the top of your window. Check your integration by going to the **Contact Tab** and scrolling down to the **Context Section**. The users are now ready to connect their data sources to add documents in the context.

![Mike Smith](/images/products/salesfetch/mike-smith.png)

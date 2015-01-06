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

On the next screen, the permission used by the package will be displayed.

![API access](/images/products/salesfetch/package-api-access.png)

If your Salesforce Edition is Enterprise or Unlimited, you will see an option to select a security level. We recommend **"Grant access to all users"**.

![Security Level](/images/products/salesfetch/security-level.png)

You're nearly done! Click on **"Install"**.

![Install complete](/images/products/salesfetch/install-complete.png)

Don't leave now! You need to click on the small **"View**":

![Install complete](/images/products/salesfetch/post-install.png)

Leave the setting untouched, unless explicitly asked otherwise by AnyFetch -- just click **"Complete package installation"**:

![First run](/images/products/salesfetch/first-run.png)

> **Note:** Do *not* use the "clear master key" button, you'd lose all your data on Anyfetch.

Installation is now complete, you can add Salesfetch to your Salesforce objects. Keep reading!

## Configuring Salesfetch
### For desktop
Let's say you want to display a Salesfetch timeline next to your contacts in the desktop edition of Salesforce.

To do so, we need to create a Visual Force Page.

![Build > Develop > Pages](/images/products/salesfetch/build-develop-pages.png)

Move to your VisualForce Pages administration panel in **Build > Develop > Pages** and create a new one by clicking on the **New** button on top of the page list.


This page will be inserted in the Contact layout.
Add in the Label input: "`Context Contact`" and in the Name input: "`ContextContact`".

![Visual Force Page for contact](/images/products/salesfetch/force-page.png)

You can now fill the Visualforce Markup text area with this code:

```html
<apex:page StandardController="Contact" standardStylesheets="false" showheader="false" sidebar="false">
    <anyfetch:IframeComponent Query="{!Contact.Name}" 
        SFDCId="{!Contact.Id}" 
        Display="{!Contact.Name}" 
        Type="Contact">
    </anyfetch:IframeComponent>
</apex:page>
```


When you're done, click on **Save** on the top menu.

>**Note**: `standardStylesheets`, `showheader`, `sidebar` must be `false` to avoid property overriding by Salesforce stylesheets. Enabling or removing those options can lead to unpredictable behaviours.

Then go to the Contact Page Layout, in **Build > Customize > Contacts > Page Layouts**. If you have more than one layout, execute the following instruction on each layout to allow all users to access the context panel. Click on **Edit** next to the layout.

Click and drag on **Visualforce Pages > Section** and drop it just after your custom link section. The following panel should be displayed.

![Layout properties](/images/products/salesfetch/layout-properties.png)

Name the newly created section `Context`, deselect `Edit Page` and select `1-Column Layout` (required). Then click on **Ok**.

![Section properties](/images/products/salesfetch/section-properties.png)

On the top of the page drag the **ContextContact** in **Visualforce Pages > ContextContact** and drop it in your **Context Panel**. A small wrench icon should be displayed on the top-right hand corner of the ContextContact panel, click on it to display the following modal panel. You can now adjust the size of the context page. Check that the Width property is set to `100%` and set the Height to at least `400px`. Then click on **Ok**.

![Visual force page properties](/images/products/salesfetch/visualforce-page-property.png)

Your Context is now integrated in your layout, you can save this layout by clicking on **Save** on the top of your window. Check your integration by going to the **Contact Tab** and scrolling down to the **Context Section**. The users are now ready to connect their data sources to add documents in the context.

![Mike Smith](/images/products/salesfetch/mike-smith.png)

### For Salesforce1
Let's say you want to display a Salesfetch timeline next to your contacts in the mobile Salesforce1 app.

To do so, we need to create a new Visual Force Page.
Move to your VisualForce Pages administration panel in **Build > Develop > Pages** and create a new one by clicking on the **New** button on top of the page list.

This page will be inserted in the Contact layout.
Add in the Label input: "`Mobile Context Contact`" and in the Name input: "`MobileContextContact`". Don't forget to check "Available for Salesforce mobile apps".

![Visual Force Page for mobile contact](/images/products/salesfetch/mobile-force-page.png)

You can now fill the Visualforce Markup text area with this code:

```html
<apex:page StandardController="Contact" standardStylesheets="false" showheader="false" sidebar="false">
    <anyfetch:IframeComponent Query="{!Contact.Name}" 
        SFDCId="{!Contact.Id}" 
        Display="{!Contact.Name}" 
        Type="Contact">
    </anyfetch:IframeComponent>
</apex:page>
```


Save the page, and now click on **Customize > Contacts > Buttons, Links, and Actions** and select **New Button or Link**.

![Button](/images/products/salesfetch/button-link.png)

Then go to the Contacts Page Layout, in **Build > Customize > Contacts > Page Layouts**. If you have more than one layout, execute the following instruction on each layout to allow all users to access the context panel. Click on **Edit** next to the layout

Click on **Buttons**, then drag and drop the "Show Context" button onto "Custom buttons".

![Mobile layout properties](/images/products/salesfetch/mobile-layout-properties.png)

![Show context button](/images/products/salesfetch/mobile-custom-buttons.png)


Hit save, and reload your salesforce1:

![Mobile layout properties](/images/products/salesfetch/salesforce1.png)

Of course, this is just samples of whant you can do to integrate Salesfetch onto your Salesforce. You may change the described workflow to display the timeline directly in Salesforce1, in a custom tab...

## Adding new content sources
Each user can now add its own providers.

To do so, while using the desktop version of Salesfetch, click on the "+" tab and connect your data sources:

![Add documents to Salesfetch](/images/products/salesfetch/add-provider.png)

## Further customisation
The Context Panel configuration offers you the possibility to create context fitting your business needs. Both `anyfetch:IframeComponent` and `anyfetch:ContextButtonComponent` need several information to execute a consistent search into your documents.


|  Name       | Description          |
| ----------- | -------------------- |
| Type        | Concerned Salesforce record type (eg. Contact, Lead, Account or a CustomObject ...). |
| SFDCId      | Concerned Salesforce record Id.  |
| Display     | Display string displayed on the top of the Context Panel.  |
| Query       | Actual query executed on your documents.  |


Knowing that Salesforce dynamically generate each Visualforce Page, you'll need to use Visualforce Page markup to bind each context page with the selected record. In fact, `SFDCId`, `Display` and `Query` parameters should be passed as `{![object type].[field name]}` to be evaluated by Salesforce.

### Examples
#### On standard objects
The following code let you attach a context to a **Lead** record. The displayed context will be the `Lead.Name` and the provided context will return all your documents containing the `Lead.Name` field.

```html
<apex:page StandardController="Lead" standardStylesheets="false" showheader="false" sidebar="false">
    <anyfetch:IframeComponent
        Query="{!Lead.Name}"
        SFDCId="{!Lead.Id}"
        Display="{!Lead.Name}"
        Type="Lead">
    </anyfetch:IframeComponent>
</apex:page>
```

The `Display` and `Query` parameters don't need to have the same value, `Display` let you create a user-friendly context. For instance, if you want to attach a context to your **Contracts** knowing that your contracts follow the `Contract-[Contract Number]` naming standard, the resulting Context configuration will be:

```html
<apex:page StandardController="Contract" standardStylesheets="false" showheader="false" sidebar="false">
    <anyfetch:IframeComponent
        Query="Contract-{!Contract.ContractNumber}"
        SFDCId="{!Contract.Id}"
        Display="{!Contract.Name}"
        Type="Contract">
    </anyfetch:IframeComponent>
</apex:page>
```

#### On custom objects
The idea is the same. However, you need to add `__c` to the name of your controllers to use the automatically generated Controller.

```html
<apex:page StandardController="MyCustomObject__c" standardStylesheets="false" showheader="false" sidebar="false">
    <anyfetch:IframeComponent Query="{!MyCustomObject__c.Name}" 
        SFDCId="{!MyCustomObject__c.Id}" 
        Display="{!MyCustomObject__c.Name}" 
        Type="MyCustomObject">
    </anyfetch:IframeComponent>
</apex:page>
```

To update a custom object layout, display one of them an click on the small "Edit layout" link on the top right corner.

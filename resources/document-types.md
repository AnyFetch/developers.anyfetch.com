---
title: AnyFetch document-types resources
layout: doc
---

You'll find here the list of default document-types and their expectations.
Don't forget that [many hydraters can change the `document_type` during the hydration phase](/resources/hydraters.html).

If you're not satisfied with the default presentation or you find some data is missing, you can create your own document-type and make a simple hydrater updating the "old" document-type to the new one.

Default document-types have no "owner", meaning only the AnyFetch organization is able to update them.

{% raw  %}
## Contact
> ID: `5252ce4ce4cfcd16f55cfa3a`

A person (contact, client, ...)

### Projections
#### Snippet

```jinja
{
  "name": {{> contact-name}},
  "image":
    {{#if metadata.image}}
      "{{attr 'image'}}"
    {{else}}
      {{#first metadata.email}}
        "{{gravatar email}}"
      {{/first}}
      {{#unless metadata.email}}
        "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&s=96"
      {{/unless}}
    {{/if}},
  "birthday": "{{attr 'birthday'}}",
  "job": "{{attr 'jobTitle'}} {{attr 'worksFor'}}",
  "phone": [ {{#list metadata.phone}}"{{#escapeQuotes .}}{{phone}}{{/escapeQuotes}}"{{/list}} ],
  "email": [ {{#list metadata.email}}"{{#escapeQuotes .}}{{email}}{{/escapeQuotes}}"{{/list}} ],
  "address": [ {{#list metadata.address}}"{{#escapeQuotes .}}{{address}}{{/escapeQuotes}}"{{/list}} ],
  "website": [ {{#list metadata.website}}"{{#escapeQuotes .}}{{.}}{{/escapeQuotes}}"{{/list}} ]
}

```
#### Full

```jinja
{
  "name": {{> contact-name}},
  "image":
    {{#if metadata.image}}
      "{{attr 'image'}}"
    {{else}}
      {{#first metadata.email}}
        "{{gravatar email}}"
      {{/first}}
      {{#unless metadata.email}}
        "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&s=96"
      {{/unless}}
    {{/if}},
  "birthday": "{{attr 'birthday'}}",
  "job": "{{attr 'jobTitle'}} {{attr 'worksFor'}}",
  "phone": [ {{#list metadata.phone}}"{{#escapeQuotes .}}{{phone}}{{/escapeQuotes}}"{{/list}} ],
  "email": [ {{#list metadata.email}}"{{#escapeQuotes .}}{{email}}{{/escapeQuotes}}"{{/list}} ],
  "address": [ {{#list metadata.address}}"{{#escapeQuotes .}}{{address}}{{/escapeQuotes}}"{{/list}} ],
  "website": [ {{#list metadata.website}}"{{#escapeQuotes .}}{{.}}{{/escapeQuotes}}"{{/list}} ]
}

```
#### Title

```jinja
{ "name": {{> contact-name}} }
```

### Templates
Snippet:

```html
<article class="anyfetch-document-snippet anyfetch-type-contact">
  <header class="anyfetch-header">
    <figure class="anyfetch-aside-image">
      <img src="{{ image }}" alt="{{ name }}" />
    </figure>
    <hgroup class="anyfetch-title-group">
      <h1 class="anyfetch-title">{{{ name }}}</h1>
      <p class="anyfetch-title-detail">{{{ job }}}</p>
    </hgroup>
    <main class="anyfetch-content">
      <ul class="anyfetch-inline-list anyfetch-comma-list">
        {{ #email }}
          <li><span class="anyfetch-email">{{ . }}</span></li>
        {{ /email }}
      </ul>
      <ul class="anyfetch-inline-list anyfetch-comma-list">
        {{ #phone }}
          <li><span class="anyfetch-phone">{{ . }}</span></li>
        {{ /phone }}
      </ul>
      <ul class="anyfetch-inline-list anyfetch-comma-list">
        {{ #address }}
          <li><span class="anyfetch-address">{{ . }}</span></li>
        {{ /address }}
      </ul>
    </main>
  </header>
</article>

```
Full:

```html
<article class="anyfetch-document-full anyfetch-type-contact">
  <header class="anyfetch-header">
    <figure class="anyfetch-aside-image">
      <img src="{{ image }}" alt="{{ name }}" />
    </figure>
    <hgroup class="anyfetch-title-group">
      <h1 class="anyfetch-title">{{{ name }}}</h1>
      <p class="anyfetch-title-detail">{{{ job }}}</p>
    </hgroup>
  </header>
  <main class="anyfetch-content">
    {{ #phone.length }}
      <h4 class="anyfetch-section-title">Phone numbers:</h4>
      <ul class="anyfetch-list-no-bullet">
        {{ #phone }}
          <li class="anyfetch-phone"><a href="tel:{{ . }}">{{ . }}</a></li>
        {{ /phone }}
      </ul>
    {{ /phone.length }}
    {{ #email.length }}
      <h4 class="anyfetch-section-title">Email addresses:</h4>
      <ul class="anyfetch-list-no-bullet">
        {{ #email }}
          <li class="anyfetch-email"><a href="mailto:{{ . }}">{{ . }}</a></li>
        {{ /email }}
      </ul>
    {{ /email.length }}
    {{ #address.length }}
      <h4 class="anyfetch-section-title">Addresses:</h4>
      <ul class="anyfetch-list-no-bullet">
        {{ #address }}
          <li class="anyfetch-address">{{ . }}</li>
        {{ /address }}
      </ul>
    {{ /address.length }}
    {{ #website.length }}
      <h4 class="anyfetch-section-title">Websites:</h4>
      <ul class="anyfetch-list-no-bullet">
        {{ #website }}
          <li class="anyfetch-website"><a href="{{ . }}">{{ . }}</a></li>
        {{ /website }}
      </ul>
    {{ /website.length }}
    {{ #birthday }}
      <h4 class="anyfetch-section-title">Birthday:</h4>
      <time class="anyfetch-date anyfetch-birthday" data-moment-format="LL">{{{ birthday }}}</time>
    {{ /birthday }}
  </main>
</article>

```
## File
> ID: `5252ce4ce4cfcd16f55cfa3b`

Most basic document type for any kind of binary content. When a provider sends data without any additional information, it will use this document_type.

### Projections
#### Snippet

```jinja
{
  "title": {{> title}},
  "path": "{{attr 'path'}}",
  "extension": "{{extractExtension metadata.path}}"
}

```
#### Full

```jinja
{
  "title": {{> title}},
  "path": "{{attr 'path'}}",
  "extension": "{{extractExtension metadata.path}}"
}

```
#### Title

```jinja
{ "title": {{> title}} }
```

### Templates
Snippet:

```html
<article class="anyfetch-document-snippet anyfetch-type-file">
  <header class="anyfetch-header">
    <hgroup class="anyfetch-title-group">
      <h1 class="anyfetch-title">{{{ title }}}</h1>
      <code class="anyfetch-title-detail">{{{ path }}}</code>
    </hgroup>
  </header>
</article>

```
Full:

```html
<article class="anyfetch-document-full anyfetch-type-file">
  <header class="anyfetch-header">
    <hgroup class="anyfetch-title-group">
      <h1 class="anyfetch-title">{{{ title }}}</h1>
      <code class="anyfetch-title-detail">{{{ path }}}</code>
    </hgroup>
  </header>
</article>

```
## Document
> ID: `5252ce4ce4cfcd16f55cfa3c`

A document from which we were able to extract a clean HTML representation: text, doc, xls, epub...

### Projections
#### Snippet

```jinja
{
  "title": {{> title}},
  "path": "{{attr 'path'}}",
  "snippet": "{{#trim .}}{{shortAttr 'text'}}{{/trim}}"
}

```
#### Full

```jinja
{
  "title": {{> title}},
  "path": "{{attr 'path'}}",
  "content": {{> data}}
}

```
#### Title

```jinja
{ "name": {{> title}} }
```

### Templates
Snippet:

```html
<article class="anyfetch-document-snippet anyfetch-type-document">
  <header class="anyfetch-header">
    <h1 class="anyfetch-title">{{{ title }}}</h1>
  </header>
  <main class="anyfetch-content">
    <p>{{{ snippet }}}</p>
  </main>
</article>

```
Full:

```html
<article class="anyfetch-document-full anyfetch-type-document">
  <header class="anyfetch-header">
    <hgroup class="anyfetch-title-group">
      <h1 class="anyfetch-title">{{{ title }}}</h1>
      <code class="anyfetch-title-detail">{{ path }}</code>
    </hgroup>
  </header>

  <main class="anyfetch-content">
    {{{ content }}}
  </main>
</article>

```
## Image
> ID: `5252ce4ce4cfcd16f55cfa3d`

Display thumbnail and preview data encoded in base64.

### Projections
#### Snippet

```jinja
{
  "title": {{> title}},
  "thumb": "{{{attr 'thumb'}}}"
}

```
#### Full

```jinja
{
  "title": {{> title}},
  "display": "{{{attr 'display'}}}",
  "author": "{{attr 'author'}}",
  "description": "{{attr 'description'}}",
  "keywords": "{{attr 'keywords'}}"
}

```
#### Title

```jinja
{ "title": {{> title}} }
```

### Templates
Snippet:

```html
<article class="anyfetch-document-snippet anyfetch-type-image">
  <header class="anyfetch-header">
    {{#thumb}}
      <figure class="anyfetch-aside-image">
        <img src="{{ thumb }}" alt="{{ title }}" />
      </figure>
    {{/thumb}}
    <hgroup class="anyfetch-title-group">
      <h1 class="anyfetch-title">{{{ title }}}</h1>
      {{#author}}
        <p class="anyfetch-title-detail anyfetch-person">{{.}}</p>
      {{/author}}
      <ul class="anyfetch-pill-list anyfetch-participants">
      {{#keywords}}
        <li class="anyfetch-pill anyfetch-name">{{.}}</li>
      {{/keywords}}
      </ul>
    </hgroup>
  </header>
</article>

```
Full:

```html
<article class="anyfetch-document-full anyfetch-type-image">
  <header class="anyfetch-header">
    <hgroup class="anyfetch-title-group">
      <h1 class="anyfetch-title">{{{ title }}}</h1>
      {{#author}}
        <p class="anyfetch-title-detail anyfetch-person">{{.}}</p>
      {{/author}}
    </hgroup>
    <ul class="anyfetch-pill-list">
      {{#keywords}}
        <li class="anyfetch-pill anyfetch-label">{{.}}</li>
      {{/keywords}}
    </ul>
  </header>

  <main class="anyfetch-content">
    <figure class="anyfetch-full-image">
      {{#display}}
        <img src="{{.}}" alt="{{{ title }}}" />
      {{/display}}
      {{#description}}
        <figcaption class="anyfetch-image-caption">{{{description}}}</figcaption>
      {{/description}}
    </figure>
  </main>

</article>

```
## Trello-card
> ID: `5252ce4ce4cfcd16f55cfa3e`

Display Trello cards

### Projections
#### Snippet

```jinja
{
  "title": "{{attr 'title'}}",
  "board": "{{attr 'board'}}",
  "list": "{{attr 'list'}}",
  "date": "{{dateRfc metadata.dateLastActivity}}",
  "description": "{{attr 'description'}}",
  "members": [
    {{#list metadata.members}}
      "{{.}}"
    {{/list}}
  ],
  "labels": [
    {{#list metadata.labels}}
      {
        "name": "{{#escapeQuotes .}}{{name}}{{/escapeQuotes}}",
        "color": "{{#escapeQuotes .}}{{color}}{{/escapeQuotes}}"
      }
    {{/list}}
  ]
}

```
#### Full

```jinja
{
  "title": "{{attr 'title'}}",
  "board": "{{attr 'board'}}",
  "list": "{{attr 'list'}}",
  "date": "{{dateRfc metadata.dateLastActivity}}",
  "description": "{{attr 'description'}}",
  "members": [
    {{#list metadata.members}}
      "{{.}}"
    {{/list}}
  ],
  "labels": [
    {{#list metadata.labels}}
      {
        "name": "{{#escapeQuotes .}}{{name}}{{/escapeQuotes}}",
        "color": "{{#escapeQuotes .}}{{color}}{{/escapeQuotes}}"
      }
    {{/list}}
  ],
  "comments": [
    {{#list metadata.comments}}
      {
        "text": "{{#escapeQuotes .}}{{text}}{{/escapeQuotes}}",
        "creator": "{{#escapeQuotes .}}{{creator}}{{/escapeQuotes}}"
      }
    {{/list}}
  ],
  "checklists": [
    {{#list metadata.checklists}}
      {
        "name": "{{#escapeQuotes .}}{{name}}{{/escapeQuotes}}",
        "checkItems": [
          {{#list checkItems}}
            {
              "name": "{{#escapeQuotes .}}{{name}}{{/escapeQuotes}}",
              "completed": {{#escapeQuotes .}}{{completed}}{{/escapeQuotes}}
            }
          {{/list}}
        ]
      }
    {{/list}}
  ]
}

```
#### Title

```jinja
{ "title": {{> title}} }
```

### Templates
Snippet:

```html
<article class="anyfetch-document-snippet anyfetch-type-trello-card">
  <header class="anyfetch-header">
    <hgroup class="anyfetch-title-group">
      <h1 class="anyfetch-title">
        {{{title}}}
      </h1>
      <p class="anyfetch-title-detail">
        <span>{{ board }}</span>
        <span class="anyfetch-right-arrow"></span>
        <span>{{ list }}</span>
        <time class="anyfetch-date">{{ date }}</time>
      </p>

      <ul class="anyfetch-pill-list">
        {{ #members }}
          <li class="anyfetch-pill {{#highlight}}anyfetch-hlt{{/highlight}}">
            <span class="anyfetch-name">{{ . }}</span>
          </li>
        {{ /members }}
      </ul>
    </hgroup>
  </header>
</article>

```
Full:

```html
<article class="anyfetch-document-full anyfetch-type-trello-card">
  <header class="anyfetch-header">
    <hgroup class="anyfetch-title-group">
      <h1 class="anyfetch-title">
        {{{title}}}
      </h1>
      <p class="anyfetch-title-detail">
        <span>{{ board }}</span>
        <span class="anyfetch-right-arrow"></span>
        <span>{{ list }}</span>
        <time class="anyfetch-date">{{ date }}</time>
      </p>

      <ul class="anyfetch-pill-list">
        {{ #members }}
          <li class="anyfetch-pill {{#highlight}}anyfetch-hlt{{/highlight}}">
            <span class="anyfetch-name">{{ . }}</span>
          </li>
        {{ /members }}
      </ul>
    </hgroup>
  </header>
  <main class="anyfetch-content">
    <p>{{{description}}}</p>
    <ul class="anyfetch-check-list">
      {{ #checklists }}
        <li>
          <h3 class="anyfetch-title-list">{{ name }}</h3>
          <ul class="anyfetch-check-list">
            {{ #checkItems }}
              <li>{{#completed}}<span>✓</span>{{/completed}}{{^completed}}<span>✕</span>{{/completed}} {{ name }}</li>
            {{ /checkItems }}
          </ul>
        </li>
      {{ /checklists }}
    </ul>

    <ul class="anyfetch-comment-list">
      {{ #comments }}
        <li>{{ text }} <span class="anyfetch-comment-author"> {{ creator }}</span></li>
      {{ /comments }}
    </ul>

  </main>
</article>

```
## Email
> ID: `5252ce4ce4cfcd16f55cfa3f`

An email

### Projections
#### Snippet

```jinja
{
  "subject": "{{attr 'subject'}}",
  "from": [
    {{#list from}}
      {
        {{#if name}}"name": "{{#escapeQuotes .}}{{name}}{{/escapeQuotes}}",{{/if}}
        "address": "{{hideDomainEmail address}}",
        "highlight": {{isHighlight .}}
      }
    {{/list}}
  ],
  "to": [
    {{#list to}}
      {
        {{#if name}}"name": "{{#escapeQuotes .}}{{name}}{{/escapeQuotes}}",{{/if}}
        "address": "{{#escapeQuotes .}}{{address}}{{/escapeQuotes}}",
        "highlight": {{isHighlight .}}
      }
    {{/list}}
  ],
  "date": "{{dateRfc metadata.date}}",
  "snippet": "{{#trim .}}{{shortAttr 'text'}}{{/trim}}",
  "attachmentCount": {{metadata.attachmentsCount}}
}

```
#### Full

```jinja
{
  "subject": "{{attr 'subject'}}",
  "from": [
    {{#list from}}
      {
        {{#if name}}"name": "{{#escapeQuotes .}}{{name}}{{/escapeQuotes}}",{{/if}}
        "address": "{{#escapeQuotes .}}{{address}}{{/escapeQuotes}}",
        "highlight": {{isHighlight .}}
      }
    {{/list}}
  ],
  "to": [
    {{#list to}}
      {
        {{#if name}}"name": "{{#escapeQuotes .}}{{name}}{{/escapeQuotes}}",{{/if}}
        "address": "{{#escapeQuotes .}}{{address}}{{/escapeQuotes}}",
        "highlight": {{isHighlight .}}
      }
    {{/list}}
  ],
  "date": "{{dateRfc metadata.date}}",
  "html": {{> data}},
  "attachmentCount": {{metadata.attachmentsCount}},
  "labels": [ {{#list labels}}"{{#escapeQuotes .}}{{.}}{{/escapeQuotes}}"{{/list}} ]
}

```
#### Title

```jinja
{ "subject": "{{attr "subject"}}" }
```

### Templates
Snippet:

```html
<article class="anyfetch-document-snippet anyfetch-type-email">
  <header class="anyfetch-header">
    <h1 class="anyfetch-title">{{{subject}}}</h1>
    <ul class="anyfetch-pill-list">
      {{#from}}
       <li class="anyfetch-pill {{#highlight}}anyfetch-hlt{{/highlight}}">
          <span class="anyfetch-name">{{{name}}}</span>
          <span class="anyfetch-email">{{{address}}}</span>
        </li>
      {{/from}}
      <li class="anyfetch-right-arrow"></li>
      {{#to}}
       <li class="anyfetch-pill {{#highlight}}anyfetch-hlt{{/highlight}}">
          <span class="anyfetch-name">{{{name}}}</span>
          <span class="anyfetch-email">{{{address}}}</span>
        </li>
      {{/to}}
    </ul>
  </header>

  <main class="anyfetch-content">
    <p>{{{snippet}}}</p>
  </main>
</article>

```
Full:

```html
<article class="anyfetch-document-full anyfetch-type-email">
  <header class="anyfetch-header">
    <hgroup class="anyfetch-title-group">
      <h1 class="anyfetch-title">{{{subject}}}</h1>
      <p class="anyfetch-title-detail"><time class="anyfetch-date">{{ date }}</time></p>
    </hgroup>
    <ul class="anyfetch-pill-list">
      {{#from}}
        <li class="anyfetch-pill {{#highlight}}anyfetch-hlt{{/highlight}}">
          <span class="anyfetch-name">{{{name}}}</span>
          <span class="anyfetch-email">{{{address}}}</span>
        </li>
      {{/from}}
      <li class="anyfetch-right-arrow"></li>
      {{#to}}
        <li class="anyfetch-pill {{#highlight}}anyfetch-hlt{{/highlight}}">
          <span class="anyfetch-name">{{{name}}}</span>
          <span class="anyfetch-email">{{{address}}}</span>
        </li>
      {{/to}}
    </ul>
  </header>

  <main class="anyfetch-content">
    {{{html}}}
  </main>
</article>

```
## Event
> ID: `5252ce4ce4cfcd16f55cfa40`

An event, from a calendar for instance.

### Projections
#### Snippet

```jinja
{
  "eventName": "{{attr 'name'}}",
  "startDate": "{{dateRfc metadata.startDate}}",
  "endDate": "{{dateRfc metadata.endDate}}",
  "description": "{{attr 'description'}}",
  "organizer": "{{#if name}}{{#escapeQuotes .}}{{name}}{{/escapeQuotes}}{{/if}} &lt;{{#escapeQuotes .}}{{mail}}{{/escapeQuotes}}&gt;",
  "attendee": [
    {{#list metadata.attendee}}
      {
        {{#if name}}"name": "{{#escapeQuotes .}}{{name}}{{/escapeQuotes}}",{{/if}}
        "address": "{{#escapeQuotes .}}{{mail}}{{/escapeQuotes}}",
        "highlight": {{isHighlight .}}
      }
    {{/list}}
  ],
  "location" : "{{#if metadata.location}}{{attr 'location'}}{{/if}}"
}

```
#### Full

```jinja
{
  "eventName": "{{attr 'name'}}",
  "startDate": "{{dateRfc metadata.startDate}}",
  "endDate": "{{dateRfc metadata.endDate}}",
  "description": "{{attr 'description'}}",
  "organizer": "{{#if name}}{{#escapeQuotes .}}{{name}}{{/escapeQuotes}}{{/if}} &lt;{{#escapeQuotes .}}{{mail}}{{/escapeQuotes}}&gt;",
  "attendee": [
    {{#list metadata.attendee}}
      {
        {{#if name}}"name": "{{#escapeQuotes .}}{{name}}{{/escapeQuotes}}",{{/if}}
        "address": "{{#escapeQuotes .}}{{mail}}{{/escapeQuotes}}",
        "highlight": {{isHighlight .}}
      }
    {{/list}}
  ],
  "location" : "{{#if metadata.location}}{{attr 'location'}}{{/if}}"
}

```
#### Title

```jinja
{ "name": "{{attr "name"}}" }
```

### Templates
Snippet:

```html
<article class="anyfetch-document-snippet anyfetch-type-event">
  <header class="anyfetch-header">
    <hgroup class="anyfetch-title-group">
      <h1 class="anyfetch-title">
        {{#eventName}}
          {{{eventName}}}
        {{/eventName}}
        {{^eventName}}
          (untitled event)
        {{/eventName}}
      </h1>
      <p class="anyfetch-title-detail anyfetch-date-span">
        <time class="anyfetch-date">{{ startDate }}</time>
        <span class="anyfetch-right-arrow"></span>
        <time class="anyfetch-date">{{ endDate }}</time>
      </p>
      <ul class="anyfetch-pill-list anyfetch-participants">
        {{#attendee}}
          <li class="anyfetch-pill anyfetch-name {{#highlight}}anyfetch-hlt{{/highlight}}">
            {{#name}}
              {{{.}}}
            {{/name}}
            {{^name}}
              {{{address}}}
            {{/name}}
          </li>
        {{/attendee}}
      </ul>
    </hgroup>
  </header>
</article>

```
Full:

```html
<article class="anyfetch-document-full anyfetch-type-event">
  <header class="anyfetch-header">
    <hgroup class="anyfetch-title-group">
      <h1 class="anyfetch-title">
        {{#eventName}}
          {{{eventName}}}
        {{/eventName}}
        {{^eventName}}
          (untitled event)
        {{/eventName}}
      </h1>
      <p class="anyfetch-title-detail">
        <time class="anyfetch-date">{{ startDate }}</time>
        <span class="anyfetch-right-arrow"></span>
        <time class="anyfetch-date">{{ endDate }}</time>
      </p>
      {{#location}}
        <p>
          {{{location}}}
        </p>
      {{/location}}
    </hgroup>
  </header>
  <main class="anyfetch-content">
    <h4 class="anyfetch-section-title">Attendees</h4>
    {{ #attendee.length }}
      <ul class="anyfetch-list-no-bullet">
        {{ #attendee }}
          <li>
            <span class="anyfetch-icon-people"></span>
            <span class="anyfetch-pill anyfetch-person {{#highlight}}anyfetch-hlt{{/highlight}}">
              {{#name}}{{{name}}}{{/name}} &lt;{{{address}}}&gt;
            </span>
          </li>
        {{ /attendee }}
      </ul>
    {{ /attendee.length }}
    {{ ^attendee.length }}
      <p>
        (no attendees to this event)
      </p>
    {{ /attendee.length }}

    <h4 class="anyfetch-section-title">Description</h4>
    <p>
      {{#description}}
        {{{description}}}
      {{/description}}
      {{^description}}
        (no description)
      {{/description}}
    </p>
  </main>
</article>

```
## Email-thread
> ID: `656d61696c2d746872656164`

An email thread or conversation

### Projections
#### Snippet

```jinja
{
  "subject": "{{attr 'subject'}}",
  "date": "{{dateRfc metadata.date}}",
  "participants": [
    {{#list metadata.participants l=3}}
      {
        {{#if name}}"name": "{{#escapeQuotes .}}{{name}}{{/escapeQuotes}}",{{/if}}
        "address": "{{hideDomainEmail address}}",
        "highlight": {{isHighlight .}}
      }
    {{/list}}
  ],
  "labels": [ {{#list metadata.labels}}"{{.}}"{{/list}} ],
  "snippet":
    {{#contextLookup highlight field='messages.text'}}
      {{#if looked}}
        "{{#escapeQuotes .}}{{{looked}}}{{/escapeQuotes}}"
      {{else}}
        {{#if highlight.text}}
          "{{#escapeQuotes .}}{{{highlight.text}}}{{/escapeQuotes}}"
        {{else}}
          {{#last metadata.messages}}
            "{{#escapeQuotes .}}{{#shorten .}}{{text}}{{/shorten}}{{/escapeQuotes}}"
          {{else}}
            ""
          {{/last}}
        {{/if}}
      {{/if}}
    {{/contextLookup}},
  "attachmentCount": {{metadata.attachmentsCount}},
  "participantsCount": {{metadata.participants.length}},
  "messagesCount": {{metadata.messages.length}},
  "singleEmail":
    {{#if metadata.messages.[1]}}
      false
    {{else}}
      true
    {{/if}}
}

```
#### Full

```jinja
{
  "subject": "{{attr 'subject'}}",
  "date": "{{dateRfc metadata.date}}",
  "participants": [
    {{#list metadata.participants}}
      {
        {{#if name}}"name": "{{#escapeQuotes .}}{{name}}{{/escapeQuotes}}",{{/if}}
        "address": "{{#escapeQuotes .}}{{address}}{{/escapeQuotes}}",
        "highlight": {{isHighlight .}}
      }
    {{/list}}
  ],
  "labels": [ {{#list metadata.labels}}"{{#escapeQuotes .}}{{.}}{{/escapeQuotes}}"{{/list}} ],
  "messages": [
    {{#reverseList metadata.messages sibling=data.messages}}
      {
        "subject": "{{#escapeQuotes .}}{{subject}}{{/escapeQuotes}}",
        {{#if date}}
          "date": "{{dateRfc date}}",
        {{/if}}
        "from": [
          {{#list from}}
            {
              {{#if name}}"name": "{{#escapeQuotes .}}{{name}}{{/escapeQuotes}}",{{/if}}
              "address": "{{#escapeQuotes .}}{{address}}{{/escapeQuotes}}",
              "highlight": {{isHighlight .}}
            }
          {{/list}}
        ],
        "to": [
          {{#list to}}
            {
              {{#if name}}"name": "{{#escapeQuotes .}}{{name}}{{/escapeQuotes}}",{{/if}}
              "address": "{{#escapeQuotes .}}{{address}}{{/escapeQuotes}}",
              "highlight": {{isHighlight .}}
            }
          {{/list}}
        ],
        "html":
          {{#contextLookup ../data.messages reverse=true field=@index}}
            {{#if looked.html}}
              "{{htmlHighlighter looked.html}}"
            {{else}}
              "{{textHighlighter text}}"
            {{/if}}
          {{/contextLookup}}
      }
    {{/reverseList}}
  ],
  "attachmentCount": {{metadata.attachmentsCount}},
  "messagesCount": {{metadata.messages.length}},
  "participantsCount": {{metadata.participants.length}},
  "singleEmail":
    {{#if metadata.messages.[1]}}
      false
    {{else}}
      true
    {{/if}}

}

```
#### Title

```jinja
{ "subject": "{{attr "subject"}}" }
```

### Templates
Snippet:

```html
<article class="anyfetch-document-snippet anyfetch-type-email-thread">
  <header class="anyfetch-header">
    <h1 class="anyfetch-title">
    {{^singleEmail}}
      <span class="anyfetch-number anyfetch-message-count">{{messagesCount}}</span>
    {{/singleEmail}}
    {{#subject}}
      {{{subject}}}
    {{/subject}}
    {{^subject}}
      (no subject)
    {{/subject}}
    </h1>
    <ul class="anyfetch-pill-list anyfetch-participants">
      <li class="anyfetch-title-detail">{{participantsCount}} <span class="anyfetch-icon-people"></li>
      {{#participants}}
        <li class="anyfetch-pill anyfetch-name {{#highlight}}anyfetch-hlt{{/highlight}}">
          {{#name}}
            {{{.}}}
          {{/name}}
          {{^name}}
            {{{address}}}
          {{/name}}
        </li>
      {{/participants}}
    </ul>
  </header>
  <main class="anyfetch-content">
    <p>{{{snippet}}}</p>
  </main>
</article>

```
Full:

```html
{{^singleEmail}}
<article class="anyfetch-document-full anyfetch-type-email-thread">
  <header class="anyfetch-header">
    <hgroup class="anyfetch-title-group">
      <h1 class="anyfetch-title">
        <span class="anyfetch-number anyfetch-message-count">{{messagesCount}}</span>
        {{#subject}}
          {{{subject}}}
        {{/subject}}
        {{^subject}}
          (no subject)
        {{/subject}}
      </h1>
    </hgroup>
    <ul class="anyfetch-pill-list anyfetch-participants">
      <li class="anyfetch-title-detail">{{participantsCount}}<span class="anyfetch-icon-people"></span></li>
      {{#attachmentCount}}
        <li class="anyfetch-title-detail">{{attachmentCount}}<span class="anyfetch-icon-attachment"></span></li>
      {{/attachmentCount}}
      {{#participants}}
        <li class="anyfetch-pill anyfetch-name {{#highlight}}anyfetch-hlt{{/highlight}}">
          {{#name}}
            {{{.}}}
          {{/name}}
          {{^name}}
            {{{address}}}
          {{/name}}
        </li>
      {{/participants}}
    </ul>
  </header>
  <main class="anyfetch-content">
{{/singleEmail}}
  {{#messages}}
    <article class="{{#singleEmail}}anyfetch-document-full anyfetch-type-email{{/singleEmail}}{{^singleEmail}}anyfetch-thread-part{{/singleEmail}}">
      <header class="anyfetch-header">
        <hgroup class="anyfetch-title-group">
          {{#singleEmail}}
            <h1 class="anyfetch-title">
              {{#subject}}
                {{{subject}}}
              {{/subject}}
              {{^subject}}
                (no subject)
              {{/subject}}
            </h1>
          {{/singleEmail}}
          <p class="anyfetch-title-detail">
            {{#singleEmail}}
              {{#attachmentCount}}
                {{attachmentCount}}<span class="anyfetch-icon-attachment"></span>
              {{/attachmentCount}}
            {{/singleEmail}}
            <time class="anyfetch-date">{{date}}</time>
          </p>
        </hgroup>
        <ul class="anyfetch-pill-list">
          {{#from}}
            <li class="anyfetch-pill {{#highlight}}anyfetch-hlt{{/highlight}}">
              <span class="anyfetch-name">{{{name}}}</span>
              <span class="anyfetch-email">{{{address}}}</span>
            </li>
          {{/from}}
          <li class="anyfetch-right-arrow"></li>
          {{#to}}
            <li class="anyfetch-pill {{#highlight}}anyfetch-hlt{{/highlight}}">
              <span class="anyfetch-name">{{{name}}}</span>
              <span class="anyfetch-email">{{{address}}}</span>
            </li>
          {{/to}}
        </ul>
      </header>
      <main class="anyfetch-content">
        {{{html}}}
      </main>
    </article>
  {{/messages}}
{{^singleEmail}}
  </main>
</article>
{{/singleEmail}}




```

{% endraw %}

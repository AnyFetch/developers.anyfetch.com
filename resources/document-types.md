---
title: AnyFetch document-types resources
layout: doc
---
{% raw  %}

You'll find here the list of default document-types and their expectations.
Don't forget that [/resources/hydraters.html](many hydraters can change the `document_type` during the hydration phase).

If you're not satisfied with the default presentation or you find some data is missing:

* You can always add more `metadata`. Even though it won't be shown to the user, the document will still be returned to the user for a relevant query, as all metadata keys are used in search.
* You can create your own document type and make a simple hydrater updating the "old" document-type to the new one.

## File
> ID: 5252ce4ce4cfcd16f55cfa3b

Most basic document type for any kind of binary content.
When a provider sends data without any additional information, it will use this `document_type`.

### Projections
* Snippet
  - title
  - path
  - extension
* Full
  - title
  - path
  - extension

### Templates
Snippet:

```html
<article>
  <h1>{{{ title }}}</h1>
  <code>{{{ path }}}</code>
</article>
```

Full:

```html
<article>
  <h1>{{{ title }}}</h1>
  <code>{{{ path }}}</code>
</article>
```

## Document
> ID: 5252ce4ce4cfcd16f55cfa3c

A document from which we were able to extract a clean HTML representation: text, doc, xls, epub...

### Projections
* Snippet
  - title
  - path
  - snippet
* Full
  - title
  - path
  - content

### Templates
Snippet:

```html
<article>
  <h1>{{{ title }}}</h1>
  <blockquote>
    {{{ snippet }}}
  </blockquote>
</article>
```

Full:

```html
<article>
  <section>
    <h1>{{{ title }}}</h1>
    <code>{{ path }}</code>
  </section>

  <section>
    {{{ content }}}
  </section>
</article>
```

## Image
> ID: 5252ce4ce4cfcd16f55cfa3d

Display thumbnail and preview data encoded in base64.

### Projections
* Snippet
  - title
  - thumb
* Full
  - title
  - display

### Templates
Snippet:

```html
<article>
  <h1>{{{ title }}}</h1>

  <img src="{{ thumb }}" />
</article>

```

Full:

```html
<article>
  <h1>{{{ title }}}</h1>

  <img src="{{ display }}" />
</article>

```

## Contact
> ID: 5252ce4ce4cfcd16f55cfa3a

A person (contact, client, ...)

### Projections
* Snippet
  - name
  - image
  - job
* Full
  - name
  - job
  - phone
  - email
  - image

### Templates
Snippet:

```html
<article class="two-columns">
  <aside>
    <img src="{{ image }}" />
  </aside>
  <section>
    <h1>{{{ name }}}</h1>
    <span>{{{ job }}}</span>
  </section>
</article>

```

Full:

```html
<article>

  <section class="two-columns">
    <aside>
      <img src="{{ image }}"/>    
    </aside>
    <section>
      <h1><a href="anyfetch://search/{{name}}">{{{ name }}}</a></h1>
      <span>{{{ job }}}</span>   
    </section>
  </section>

  <section>
    {{#phone.length}}
    <h2>Phones:</h2>
    <ul>
      {{ #phone }}
      <li>{{ phone }} ( {{ type }} )</li>
      {{ /phone }}
    </ul>
    {{/phone.length}}

    {{#email.length}}
    <h2>Emails:</h2>
    <ul>
      {{ #email }}
      <li>{{ email }} ( {{ type }} )</li>
      {{ /email }}
    </ul>
    {{/email.length}}

    {{#address.length}}
    <h2>Address:</h2>
    <ul>
      {{ #address }}
      <li>{{ address }} ( {{ type }} )</li>
      {{ /address }}
    </ul>
    {{/address.length}}

    {{#website.length}}
    <h2>Website:</h2>
    <ul>
      {{ #website }}
      <li>{{{ website }}}</li>
      {{ /website }}
    </ul>
    {{/website.length}}


    {{#birthday}}
    <h2>Birthday:</h2>
    <span>{{birthday}}</span>
    {{/birthday}}

  </section>

</article>
```

## EMail
> ID: 5252ce4ce4cfcd16f55cfa3f

An email.

### Projections
* Snippet
  - from
  - to
  - subject
  - snippet
  - date
  - attachmentCount
* Full
  - from
  - to
  - labels
  - subject
  - html
  - date

### Templates
Snippet:

```html
<article>
  <h1>{{{subject}}}</h1>
  <div class="two-columns">
    <span>{{ date }}</span>
    <span><small>{{{from}}} &rarr; {{{to}}}</small></span>
  </div>
  <blockquote>{{{snippet}}}</blockquote>
</article>

```

Full:

```html
<article class="email-projection">
 <header>
     <h1>{{{subject}}}</h1>
     <small>{{ date }}</small>
     <small>From: <strong>{{{from}}}</strong></small>
     <small>To: <strong>{{{to}}}</strong></small>
 </header>

 <main>
       {{{html}}}
 </main>
</article>

```

## Event
> ID: 5252ce4ce4cfcd16f55cfa40

An event, from a calendar for instance.

### Projections
* Snippet
  - name
  - startDate
  - endDate
* Full
  - startDate
  - endDate
  - name
  - description
  - attendee

### Templates
Snippet:

```html
<article>
  <h1>{{{name}}}</h1>
  <span>{{startDate}}&mdash;{{endDate}}</span>
</article>
```

Full:

```html
<article>
  <section>
    <h1>{{name}}</h1>
    <span>{{startDate}}&mdash;{{endDate}}</span>
  </section>

  {{ #attendee.length }}
    <h2>Attendees:</h2>
    {{ #attendee }}
    <li>{{.}}</li>
    {{ /attendee }} 
  {{ /attendee.length }}

  <p>{{description}}</p>
</article>
```

## Task
> ID: 5252ce4ce4cfcd16f55cfa41

A task, in a TODO app for instance.

### Projections
* Snippet
  - subject
  - description
  - status
* Full
  - subject
  - description
  - assignedTo
  - dueDate

### Templates
Snippet:

```html
<article>
  <h1>{{{subject}}}</h1>
  <span>Status: {{status}}</span>
  <p>{{{description}}}</p>
</article>
```

Full:

```html
<article>
  <section>
    <h1>{{{subject}}}</h1>
    <span>Status: {{status}}</span>
  </section>

  <p>{{{description}}}</p>
</article>
```
{% endraw %}

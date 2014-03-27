# Documentation for anyFetch API

Please visit [developers.anyfetch.com](http://developers.anyfetch.com) to read the documentation.

This repository should not be used for browsing, but to update the doc.

## How to update?

### Jekyll
Jekyll is used to serve the HTML.

Install Jekyll with `sudo gem install jekyll`, then use `jekyll serve --watch`.
Access the application on `http://localhost:4000/`.

### Aglio
Aglio is used to re-generate `endpoints/index.html` from `blueprint.md`.

```sh
npm install -g aglio
```

Then update the HTML after modifying `blueprint.md`:

```sh
aglio -i blueprint.md -o endpoints/index.html
```

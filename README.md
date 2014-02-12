# Documentation for anyFetch API

Please visit http://papiel.github.io/developers.anyfetch.com to read the documentation.

This repository should not be used for browsing, but to update the doc.

## How to update?

### Jekyll
Jekyll is used to serve the HTML.

Install Jekyll with `sudo gem install jekyll`, then use `jekyll serve --watch`.
Access the application on `http://localhost:4000/`.

### Hiro
Hiro is used to re-generate `endpoints/index.html` from `blueprint.md`.
Git it from `https://github.com/peterhellberg/hiro`.

Then update the file after modifying `blueprint.md`:

```sh
hiro -input blueprint.md -output endpoints/tmp.html && sed 's/\/\//http:\/\//g' endpoints/tmp.html > endpoints/index.html && rm endpoints/tmp.html
```

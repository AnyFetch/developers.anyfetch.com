# Documentation for Anyfetch API (*aka Cluestr*)

Please visit http://papiel.github.io/cluestr-doc/ to view the documentation.

This repo should not be used for browsing, but for updating the doc.

## How to update?

### Jekyll
Jekyll is used to serve the HTML

Install with `sudo gem install jekyll`, then use `jekyll serve --watch`.
You can access the pplication on `http://localhost:4000/anyfetch-doc`

### Hiro
Hiro is used for the endpoint HTML generation from the blueprint file.
Git it from `https://github.com/peterhellberg/hiro`.

Then update the file after modifying `blueprint.md`:

```sh
hiro -input blueprint.md -output endpoints/tmp.html && sed 's/\/\//http:\/\//g' endpoints/tmp.html > endpoints/index.html && rm endpoints/tmp.html
```

## TODO
* About the Core API
    - Contributing guidelines       MAT
    - Endpoints                     KIM / PMD
    - Authentication                ROB
* Create a new project              ROB

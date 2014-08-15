---
title: Playground
no_toc: true
layout: doc
---

The Playground lets you experiment with how content is returned by the API


<div id="errors">
</div>
<article id="form">
  <h3>Prepare your file:</h3>
  <form id="playground" role="form" method="post" enctype="multipart/form-data">
    <div class="form-group" id="token-form-group">
      <label class="control-label">Your token:</label>
      <input type="text" name="name" id="token" class="form-control">
    </div>
    <div class="form-group">
      <label class="control-label">Your file:</label>
      <input type="file" name="file" id="file">
    </div>
    <div class="form-group">
      <input type="submit" id="submit-button" value="Upload to API" class="btn btn-orange" data-loading-text="Working...">
    </div>
  </form>
</article>

<div class="panel panel-default">
  <!-- Nav tabs -->
  <ul class="nav nav-pills panel-heading no-smooth" role="tablist" id="tabnav">
    <li><a href="#status-tab" role="tab" data-toggle="tab">Status</a></li>
    <li><a href="#result-tab" role="tab" data-toggle="tab">Results</a></li>
    <li><a href="#iframe-tab" role="tab" data-toggle="tab">HTML Render</a></li>
    <li><a href="#image-tab" role="tab" data-toggle="tab">Image Render</a></li>
  </ul>

  <!-- Tab panes -->
  <div class="tab-content panel-body">
    <article class="tab-pane" id="status-tab">
      <h5>Hydrating by:</h5>
      <pre id="status-hydrating">None</pre>
      <h5>Hydrated by:</h5>
      <pre id="status-hydrated">None</pre>
      <h5>Errored hydraters:</h5>
      <pre id="status-errored">None</pre>
      <h5>Hydration errors:</h5>
      <pre id="status-errors">None</pre>
    </article>
    <article class="tab-pane" id="result-tab">
      <pre id="result">None</pre>
    </article>
    <article class="tab-pane" id="iframe-tab">

    </article>
    <article class="tab-pane" id="image-tab">

    </article>
  </div>
</div>
<script type="text/javascript" src="/javascripts/async.js"></script>
<script type="text/javascript" src="/javascripts/playground.js"></script>

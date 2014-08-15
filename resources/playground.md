---
title: Playground
no_toc: true
layout: doc
---

The Playground lets you experiment with how content is returned by the API

<link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.1/styles/default.min.css">

<div id="errors">
</div>
<article id="form">
  <h3>Prepare your file:</h3>
  <form id="playground" role="form" method="post" enctype="multipart/form-data">
    <div class="form-group" id="token-form-group">
      <label class="control-label">Your token:</label>
      <input type="text" name="name" id="token" class="form-control"/>
    </div>
    <div class="form-group">
      <label class="control-label">Your file:</label>
      <input type="file" name="file" id="file"/>
    </div>
    <div class="form-group">
      <label class="control-label">Identifier:</label>
      <a href="/guides/concepts/identifier.html"><span class="glyphicon glyphicon-question-sign form-control-feedback"></span></a>
      <input type="text" name="identifier" id="identifier" class="form-control" placeholder="The identifier will be generated automatically when you choose your file"/>
    </div>
    <div class="form-group">
      <input type="submit" id="submit-button" value="Upload to API" class="btn btn-orange" data-loading-text="Working..."/>
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
      <h5>Id:</h5>
      <pre id="status-id">None</pre>
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
      <iframe id="iframe-render" style="position: relative; height: 100%; width: 100%; border: none; min-height: 500px;"></iframe>
    </article>
    <article class="tab-pane" id="image-tab">
      <div id="image-render" style="position: relative; height: 100%; width: 100%; min-height: 500px;"></div>
    </article>
  </div>
</div>
<script type="text/javascript" src="/javascripts/async.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.1/highlight.min.js"></script>
<script type="text/javascript" src="/javascripts/playground.js"></script>
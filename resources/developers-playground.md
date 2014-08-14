---
title: Developers Playground
layout: doc
---

The Playground lets you experiment with how content is returned by the API


<div id="errors">
</div>
<article>
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
      <input type="submit" value="Upload to API" class="btn btn-default">
    </div>
  </form>
  <hr>
  <h3>Status:</h3>
  <h5>Hydrating by:</h5>
  <pre id="status-hydrating">None</pre>
  <h5>Hydrated by:</h5>
  <pre id="status-hydrated">None</pre>
  <h5>Errored hydraters:</h5>
  <pre id="status-errored">None</pre>
  <h5>Hydration errors:</h5>
  <pre id="status-errors">None</pre>
  <h3>Result:</h3>
  <pre id="result">None</pre>
</article>
<script type="text/javascript" src="/javascripts/async.js"></script>
<script type="text/javascript" src="/javascripts/playground.js"></script>

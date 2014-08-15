(function () {
  'use strict';
  /*jslint indent: 2 */
  /*global $: true */
  /*global window: true */
  /*global document: true */
  /*global console: true */
  /*global localStorage: true */
  /*global async: true */
  /*global FormData: true */

  var apiUrl = 'https://api-staging.anyfetch.com';
  var userToken = '';

  var makeAlert = function makeAlert(type, message) {
    $('#errors').append('<div class="alert alert-' + type + ' alert-dismissible" role="alert">' +
      '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
      message +
      '</div>');
    $('.alert').alert();
  };

  var escapeHtml = function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  var checkStorage = function checkStorage() {
    try {
      return 'localStorage' in window && window.localStorage !== null;
    } catch(e) {
      return false;
    }
  };

  var setAuthorization = function(xhr) {
    xhr.setRequestHeader("Authorization", "Bearer " + userToken);
  };

  var checkToken = function checkToken(token) {
    if(token === '') {
      $('#token-form-group').removeClass('has-success').removeClass('has-error');
      userToken = '';
      return;
    }
    userToken = token;
    $.ajax({
      url: apiUrl + '/status',
      beforeSend: setAuthorization,
      error: function() {
        $('#token-form-group').removeClass('has-success').addClass('has-error');
      },
      success: function() {
        $('#token-form-group').removeClass('has-error').addClass('has-success');
        // set valid token in localStorage for later sessions
        if(checkStorage()) {
          localStorage.token = userToken;
        }
      }
    });
  };

  var createDocument = function createFileRequest(cb) {
    $.ajax({
      url: apiUrl + '/documents',
      type: "POST",
      data: {document_type: "file"},
      beforeSend: setAuthorization,
      success: function(response) {
        makeAlert('success', 'Document created');
        cb(null, response.id);
      },
      error: function(response) {
        makeAlert('danger', response.responseText);
        cb(response.responseText);
      }
    });
  };

  var sendDocument = function sendDocument(id, data, cb) {
    $.ajax({
      url: apiUrl + '/documents/' + id + '/file',
      type: "POST",
      data: data,
      cache: false,
      contentType: false,
      processData: false,
      beforeSend: setAuthorization,
      success: function(response) {
        makeAlert('success', 'Document uploaded');
        cb(null, id);
      },
      error: function(response) {
        makeAlert('danger', response.responseText);
        cb(response.responseText);
      }
    });
  };

  var getRaw = function getRaw(id, cb) {
    $.ajax({
      url: apiUrl + '/documents/' + id + '/raw',
      type: "GET",
      beforeSend: setAuthorization,
      success: function(response) {
        $('#status-hydrating').html(response.hydrating.length ? response.hydrating.join('<br>') : 'None');
        $('#status-hydrated').html(response.hydrated_by.length ? response.hydrated_by.join('<br>') : 'None');
        $('#status-errored').html(response.hydrater_errored ? response.hydrater_errored.join('<br>') : 'None');
        $('#status-errors').html(response.hydration_error || 'None');
        if(response.hydrating.length) {
          window.setTimeout(function() {
            cb(null, false);
          }, 500);
        }
        else {
          cb(null, true);
        }
      },
      error: function(response) {
        makeAlert('danger', response.responseText);
        cb(response.responseText);
      }
    });
  };

  var watchState = function watchState(id, cb) {
    var test = false;

    async.until(
      function() { return test; },
      function getRawWrapper(cb) {
        getRaw(id, function(err, state) {
          test = state;
          cb(null);
        });
      },
      function(err) {
        cb(err, id);
      }
    );
  };

  var finalDisplay = function finalDisplay(id, cb) {
    $.ajax({
      url: apiUrl + '/documents/' + id,
      type: "GET",
      beforeSend: setAuthorization,
      success: function(response) {
        $('#result').html(escapeHtml(JSON.stringify(response, undefined, 2).replace(/(\\n)/gm, "\n")));
        cb(null, id);
      },
      error: function(response) {
        makeAlert('danger', response.responseText);
        cb(response.responseText);
      }
    });
  };

  var checkApi = function checkApi() {
    $.ajax({
      url: apiUrl + '/status',
      error: function() {
        makeAlert('danger', 'The API at ' + apiUrl + ' seems unreachable');
      },
    });
  };

  $(document).ready(function() {
    // enable tabs
    $('#tabnav a:first').tab('show');
    $('#tabnav a').click(function(event) {
      event.preventDefault();
      $(this).tab('show');
    });

    checkApi();

    // restore token from previous session
    if(checkStorage() && localStorage.token) {
      $("#token").val(localStorage.token);
      checkToken(localStorage.token);
    }

    $("#token").bind('change paste keyup', function(event) {
      checkToken($(this).val());
    });

    $("#playground").submit(function(event) {
      event.preventDefault();
      var data = new FormData(event.target);

      $(".alert").alert('close');
      async.waterfall([
        createDocument,
        function sendDocumentWrapper(id, cb) {
          sendDocument(id, data, cb);
        },
        watchState,
        finalDisplay
      ]);
    });
  });
}());

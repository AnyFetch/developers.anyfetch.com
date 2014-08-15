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

  var cleanUpError = function cleanUpError(error) {
    $("#submit-button").button('loading');
    makeAlert('danger', error);
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

  var createDocument = function createDocument(identifier, cb) {
    $.ajax({
      url: apiUrl + '/documents',
      type: "POST",
      data: {identifier: identifier, document_type: "file"},
      beforeSend: setAuthorization,
      success: function(response) {
        $('#status-id').html(response.id || 'None');
        makeAlert('success', 'Document created');
        cb(null, response.identifier);
      },
      error: function(response) {
        cleanUpError(response.responseText);
        cb(response.responseText);
      }
    });
  };

  var sendDocument = function sendDocument(identifier, data, cb) {
    $.ajax({
      url: apiUrl + '/documents/identifier/' + encodeURIComponent(identifier) + '/file',
      type: "POST",
      data: data,
      cache: false,
      contentType: false,
      processData: false,
      beforeSend: setAuthorization,
      success: function(response) {
        makeAlert('success', 'Document uploaded');
        cb(null, identifier);
      },
      error: function(response) {
        cleanUpError(response.responseText);
        cb(response.responseText);
      }
    });
  };

  var getRaw = function getRaw(identifier, cb) {
    $.ajax({
      url: apiUrl + '/documents/identifier/' + encodeURIComponent(identifier) + '/raw',
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
        cleanUpError(response.responseText);
        cb(response.responseText);
      }
    });
  };

  var watchState = function watchState(identifier, cb) {
    var test = false;

    async.until(
      function() { return test; },
      function getRawWrapper(cb) {
        getRaw(identifier, function(err, state) {
          test = state;
          cb(null);
        });
      },
      function(err) {
        cb(err, identifier);
      }
    );
  };

  var jsonDisplay = function jsonDisplay(identifier, cb) {
    $.ajax({
      url: apiUrl + '/documents/identifier/' + encodeURIComponent(identifier) + '?render_templates=true',
      type: "GET",
      beforeSend: setAuthorization,
      success: function(response) {
        $('#result').html(escapeHtml(JSON.stringify(response, undefined, 2).replace(/(\\n)/gm, "\n")));
        $('#iframe-render').contents().find('html').html(response.data.content);
        cb(null, identifier);
      },
      error: function(response) {
        cleanUpError(response.responseText);
        cb(response.responseText);
      }
    });
  };

  var imageDisplay = function imageDisplay(identifier, cb) {
    var img = apiUrl + '/documents/identifier/' + encodeURIComponent(identifier);
    img += '?oauth_access_token=' + userToken; // authentification
    $('#image-render').html('<img scr="' + img + '"/>');
    cb(null, identifier);
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

    $('#file').bind('change', function(event) {
      $('#identifier').val($(this).val());
    });

    $("#playground").submit(function(event) {
      event.preventDefault();

      $("#submit-button").button('loading');
      $(".alert").alert('close');
      async.waterfall([
        function getIdentifier(cb) {
          cb(null, $('#identifier').val() || '');
        },
        createDocument,
        function getData(identifier, cb) {
          cb(null, identifier, new FormData(event.target));
        },
        sendDocument,
        watchState,
        jsonDisplay,
        imageDisplay
      ], function(err) {
        if(err) {
          return cleanUpError(err);
        }
        $("#submit-button").button('reset');
      });
    });
  });
}());

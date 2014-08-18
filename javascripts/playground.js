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

  var apiUrl = 'https://api.anyfetch.com';
  var userToken = '';
  var working = false;

  var makeAlert = function makeAlert(type, message) {
    $('#errors').append('<div class="alert alert-' + type + ' alert-dismissible" role="alert">' +
      '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
      message +
      '</div>');
    $('.alert').alert();
  };

  var setProgress = function setProgress(percentage, label, type) {
    $('#progress')
      .attr('aria-valuenow', percentage)
      .attr('style', 'width: ' + percentage + '%');
    if(label) {
      $('#progress-label').html('Progress: ' + label);
    }
    if(type) {
      $('#progress')
        .removeClass('progress-bar-info')
        .removeClass('progress-bar-success')
        .removeClass('progress-bar-warning')
        .removeClass('progress-bar-danger')
        .addClass('progress-bar-' + type);
    }
  };

  var cleanUpError = function cleanUpError(error) {
    $("#submit-button").button('reset');
    $("#delete-button").button('reset');
    makeAlert('danger', error);
    setProgress(100, error, 'danger');
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
    setProgress(0, 'Creating document');
    $.ajax({
      url: apiUrl + '/documents',
      type: "POST",
      data: {identifier: identifier, document_type: "file"},
      beforeSend: setAuthorization,
      success: function(response) {
        $('#status-id').html(response.id || 'None');
        cb(null, response.identifier);
      },
      error: function(response) {
        cleanUpError(response.responseText);
        cb(response.responseText);
      }
    });
  };

  var sendDocument = function sendDocument(identifier, data, cb) {
    setProgress(10, 'Uploading file (0%)');
    $.ajax({
      url: apiUrl + '/documents/identifier/' + encodeURIComponent(identifier) + '/file',
      type: "POST",
      data: data,
      cache: false,
      contentType: false,
      processData: false,
      beforeSend: setAuthorization,
      success: function(response) {
        setProgress(50, 'Uploading file (100%)');
        cb(null, identifier);
      },
      error: function(response) {
        cleanUpError(response.responseText);
        cb(response.responseText);
      },
      xhr: function(){
        // get the native xhr object
        var xhr = $.ajaxSettings.xhr();
        xhr.upload.onprogress = function onprogress(progress) {
          var percentage = progress.loaded / progress.total;
          setProgress(10 + Math.floor(percentage * 40), 'Uploading file (' + Math.floor(percentage * 100) + '%)');
        };
        return xhr;
      },
    });
  };

  var getRaw = function getRaw(identifier, cb) {
    $.ajax({
      url: apiUrl + '/documents/identifier/' + encodeURIComponent(identifier) + '/raw',
      type: "GET",
      beforeSend: setAuthorization,
      success: function(response) {
        var hydraters = response.hydrating.length + response.hydrated_by.length;
        setProgress(50 + (response.hydrated_by.length / hydraters) * 45, 'Hydrating... (' + response.hydrated_by.length + '/' + hydraters + ')');
        $('#status-hydrating').html(response.hydrating.length ? response.hydrating.join('<br>') : 'None');
        $('#status-hydrated').html(response.hydrated_by.length ? response.hydrated_by.join('<br>') : 'None');
        $('#status-errored').html(response.hydrater_errored || 'None');
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
      url: apiUrl + '/documents/identifier/' + encodeURIComponent(identifier),
      type: "GET",
      beforeSend: setAuthorization,
      success: function(response) {
        $('#result').html(escapeHtml(JSON.stringify(response, undefined, 2).replace(/(\\n)/gm, "\n")));
        $('#result').html(hljs.highlight('json', JSON.stringify(response, undefined, 2)).value);
        cb(null, identifier);
      },
      error: function(response) {
        cleanUpError(response.responseText);
        cb(response.responseText);
      }
    });
  };

  var htmlDisplay = function htmlDisplay(identifier, cb) {
    $.ajax({
      url: apiUrl + '/documents/identifier/' + encodeURIComponent(identifier) + '?render_templates=true',
      type: "GET",
      beforeSend: setAuthorization,
      success: function(response) {
        $('#iframe-render').contents().find('html').html(response.rendered_full);
        cb(null, identifier);
      },
      error: function(response) {
        cleanUpError(response.responseText);
        cb(response.responseText);
      }
    });
  };


  var imageDisplay = function imageDisplay(identifier, cb) {
    var img = apiUrl + '/documents/identifier/' + encodeURIComponent(identifier) + '/image';
    img += '?oauth_access_token=' + userToken; // authentification
    $('#image-render').attr('src', img);
    cb(null, identifier);
  };

  var deleteDocument = function deleteDocument(identifier, cb) {
    setProgress(0, 'Deleting document', 'info');
    $.ajax({
      url: apiUrl + '/documents/identifier/' + encodeURIComponent(identifier),
      type: "DELETE",
      beforeSend: setAuthorization,
      success: function(response) {
        setProgress(100, 'Document deleted!', 'success');
        cb(null, identifier);
      },
      error: function(response) {
        cleanUpError(response.responseText);
        cb(response.responseText);
      }
    });
  };

  var getIdentifier = function checkParams(cb) {
    var file = $('#file').val();
    if(!file || file === '') {
      return cb('You must choose a file to upload');
    }
    var identifier = $('#identifier').val();
    if(!identifier || identifier === '') {
      return cb('Identifer must be provided (choose a file, or input one manually)');
    }
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

    // check token when changed
    $("#token").bind('change paste keyup', function(event) {
      checkToken($(this).val());
    });

    // update the identifer when a file is choosen
    $('#file').bind('change', function(event) {
      $('#identifier').val($(this).val());
    });

    // delete the document
    $('#delete-button').click(function(event) {
      if(working) {
        makeAlert('warning', 'Please wait the current action before deleting the file');
        return;
      }
      working = true;
      $("#delete-button").button('loading');
      async.waterfall([
        getIdentifier,
        deleteDocument
      ], function(err) {
        working = false;
        if(err){
          makeAlert('danger', err);
        }
        $("#delete-button").button('reset');
      });
    });

    $("#submit-button").click(function(event) {
      $("#playground").submit();
    });

    // prevent form submit and execute our waterfall
    $("#playground").submit(function(event) {
      event.preventDefault();
      working = true;

      $("#submit-button").button('loading');
      // close all alerts
      $(".alert").alert('close');

      // reset progress bar
      setProgress(0, '', 'info');
      async.waterfall([
        getIdentifier,
        createDocument,
        function getData(identifier, cb) {
          cb(null, identifier, new FormData(event.target));
        },
        sendDocument,
        watchState,
        jsonDisplay,
        htmlDisplay,
        imageDisplay,
        function showDeleteButton(identifier, cb) {
          $('#delete-button').attr('type', 'button');
          setProgress(100, 'Complete!', 'success');
          cb(null, identifier);
        },
      ], function(err) {
        working = false;
        if(err){
          makeAlert('danger', err);
        }
        $("#submit-button").button('reset');
      });
    });
  });
}());

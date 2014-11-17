// Smooth scroll
$(function() {
  $('a[href*=#]:not([href=#]):not(.no-smooth a)').click(function() {
    if(location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      var hash = this.hash;
      var targetID = target.attr('id');
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if(target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top - 100
        }, 1000, function() {
          target.attr('id', 'no-scroll-firefox');
          location.hash = hash;
          target.attr('id', targetID);
        });
        return false;
      }
    }
  });
});

$('body').scrollspy({
  target: '#nav',
  offset: 130
});

$(function makeStickyHeader() {
  // Check the initial position of the Sticky Header
  var toc = $('#toc');
  if(toc[0]) {
    var stickyHeaderTop = toc.position().top - 100;
    $(window).scroll(function() {
      if($(window).scrollTop() > stickyHeaderTop) {
        toc.css({position: 'fixed', top: '100px'});
      }
      else {
        toc.css({position: 'inherit', top: '0px'});
      }
    });
  }
});


// Display errors after requests
$(function hideErrorCodesInEndpoints() {
  var counter = 0;

  $('.panel-body blockquote').has('ul li code').each(function() {
    var item = $(this);
    var sectionContainer = item.closest('section.panel');
    var requestUl = sectionContainer.children('ul:last-of-type');
    var anchorId = sectionContainer.attr('id') + '-error';

    // Append a new item to the UL, saying "Error code // Toggle" with a link to the errors
    requestUl.append('<li class="list-group-item"><strong>Error codes</strong><a data-toggle="collapse" data-target="#' + anchorId + '" class="pull-right">Toggle</a></li>');

    // Append the errors at the end of the UL, hidden (collapsed) by default.
    var ulItem = item.children('ul');
    $('<li id="' + anchorId + '" class="list-group-item panel-collapse collapse error-codes"></li>').appendTo(requestUl).append(item.children('ul'));
    // Remove <blockquote> item
    item.remove();

    // Try to extract the scope
    var errors = ulItem.text();
    var scope = errors.match(/MissingScope.+ ([a-z_]+) scope/);
    if(scope && scope[1]) {
      var panelHeading = sectionContainer.children('.panel-heading');

      $('<div style="float:left; padding-right:5px;"><i class="fa fa-lock" title="Required scopes: ' + scope[1] + '"></i></div>').prependTo(panelHeading);
      panelHeading.find('i[title]').tooltip();
    }
  });
});

// Autoload TOC
$(function generateTOC() {
  var toc = $('#toc');

  if(toc && toc.toc) {
    toc.toc({
      'selectors': 'h2,h3,h4,h5,h6',
      'container': '#main-content',
      'highlightOffset': 20
    });
  }
});


// Clickable images
$("p img").wrap(function() {
  return "<a href='" + $(this).attr('src') + "' target='_blank'></a>";
});

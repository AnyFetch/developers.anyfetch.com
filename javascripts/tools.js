// Smooth scroll
$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top - 100
        }, 300);
        return false;
      }
    }
  });
});
$('body').scrollspy({ target: '#nav' });


// Display errors after requests
$(function() {
  var counter = 0;

  $('.panel-body blockquote').has('ul li code').each(function() {
    var item = $(this);
    var sectionContainer = item.closest('section.panel');
    var requestUl = sectionContainer.children('ul:last-of-type');
    var anchorId = sectionContainer.attr('id') + '-error';

    // Append a new item to the UL, saying "Error code // Toggle" with a link to the errors
    requestUl.append('<li class="list-group-item"><strong>Error codes</strong><a data-toggle="collapse" data-target="#' + anchorId + '" class="pull-right">Toggle</a></li>');

    // Append the errors at the end of the UL, hidden (collapsed) by default.
    $('<li id="' + anchorId + '" class="list-group-item panel-collapse collapse error-codes"></li>').appendTo(requestUl).append(item.children('ul'));
    // Remove <blockquote> item
    item.remove();
  });
});

// Autoload TOC
$(function() {
  $('#toc').toc({
    'selectors': 'h2,h3,h4,h5,h6',
    'container': '#main-content'
  });
});

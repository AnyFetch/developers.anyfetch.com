// Smooth scroll
$(function() {
console.log('gros kiki');
  $('a[href*=#]').click(function(e) {
    console.log('kiki');
    if (location.pathname.replace('/^\//','') == this.pathname.replace('/^\//','')
        && location.hostname == this.hostname) {
        var hash = this.hash;
        var $target = $(this.hash);
        $target = $target.length && $target
            || $('[name=' + this.hash.slice(1) +']');
        if ($target.length) {
            // $('.active').removeClass('active');
            // $(this).parent().addClass('active');
            var targetOffset = $target.offset().top;
            targetOffset -= 100;
            $('html,body')
            .animate({
                scrollTop: targetOffset
            }, 750, function() {
                location.hash = hash;
            });
            e.preventDefault();

        }
    }
  });
});
$('body').scrollspy({ target: '#nav', offset: 130 });

$(function(){
        // Check the initial Poistion of the Sticky Header
        var stickyHeaderTop = $('#toc').offset().top - 100;
         console.log(stickyHeaderTop);
        $(window).scroll(function(){
                if( $(window).scrollTop() > stickyHeaderTop ) {
                        $('#toc').css({position: 'fixed', top: '100px'});
                } else {
                        $('#toc').css({position: 'inherit', top: '0px'});
                }
        });
  });


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
    'container': '#main-content',
    'highlightOffset': 50
  });
});

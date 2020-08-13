var Notices = NoticesArr;
var NoticePosting = {

    addNoticePlaceholders: function () {
        var emptyNotice = '<div class="notice notice-placeholder"></div>';
        //loop through all notices in array and display placeholders for each one except the first one
        for (var index = 1; index < Notices.length; index++) {
            var timingdelay = (100 * index);
            setTimeout(function() {
                $('#notices-wrapper .container-fluid').append(emptyNotice);
            }, timingdelay); 
             }
    },

    removeNoticePlaceholder: function () {
        $('#notices-wrapper .container-fluid').children('.notice-placeholder').first().remove();
    },

    // If there are more than 3 notices, only ever show 3 notices but as active notices are closed, load the remaining notices
    populateNotice: function () {
        
        if (Notices[0] !== undefined) {
            $('#notices-overlay').show();
            $('#notices-wrapper').css('height', '90px').show();
		
            var noticeTemplate = $('#notice-template').clone().attr('id', '');
            noticeTemplate.find('#category-title').text(Notices[0].categoryTitle).end()
                .find('#message-header').html(Notices[0].messageHeader).end()
                .find('#eff-date').html(Notices[0].effDate).end()
                .find('#message').html(Notices[0].message).end();

                if (!Notices[0].Pipelines || Notices[0].Pipelines.length === 0) {
                    noticeTemplate.find('.notices-left-col').css('display', 'none');
                    noticeTemplate.find('.notices-right-col').css('border-left', 'none').css('width', 'calc(100% - 40px)');

                } else {
                    for (var i = 0; i < Notices[0].Pipelines.length; i++) {
                        noticeTemplate.find('#pipelines').append('<li>' + Notices[0].Pipelines[i] + '</li>');
                    }  
                }
                          
            if (Notices[0].userAcknowledge === true) {
                noticeTemplate.find('#user-acknowledge').css('display', 'inline-block').text(Notices[0].acknowledgeText).end();
                noticeTemplate.find('.notices-close-icon').css('display', 'none');
            }

            
            NoticePosting.removeNoticePlaceholder();

            noticeTemplate.prependTo('#notices-wrapper .container-fluid');

        } else {
            $('#notices-overlay').hide();
            window.setTimeout(function () {
                $('#notices-wrapper').hide();
            }, 1000); 
        }
    },

    closeNotice: function () {
        
        Notices.shift();
        NoticePosting.populateNotice();

        $('#notices-wrapper .notice--active').addClass('notice--removing');
        $('#notices-wrapper .notice--removing').removeClass('notice--active').removeClass('notice--latest');

        window.setTimeout(function () {
            $('#notices-wrapper .notice--removing').remove();
        }, 1000);
        $('#notices-wrapper .notice--latest').addClass('notice--active');
        window.setTimeout(function () {
            if ($('#notices-wrapper').hasClass('notices-wrapper--expanded')) {
                $('#notices-wrapper').removeClass('notices-wrapper--expanded').css('height', '90px');
            }
        }, 250);
    },

    expandNotice: function () {
        var noticeHeight = $('.notice--active .notice-inner-wrapper').height() + 40;
        var vh = $(window).height();
        var vhMinimum  = vh - 120;
        var wrapperIsExpanded = $('#notices-wrapper').hasClass('notices-wrapper--expanded');
        if (wrapperIsExpanded === true) {
            $('#notices-wrapper').removeClass('notices-wrapper--expanded').css('height', '90px');
        } else if (noticeHeight < (vhMinimum)) {
            $('#notices-wrapper').addClass('notices-wrapper--expanded').css('height', noticeHeight);
        } else if (noticeHeight >= (vhMinimum)) {
            $('#notices-wrapper').addClass('notices-wrapper--expanded').css('height', (vhMinimum));
        }
    },
    hoverNotice: function (e) {        
        if ($('#notices-wrapper').hasClass('notices-wrapper--expanded')) {
            return;
        } else if (e.type === 'mouseenter'){
            $('#notices-wrapper .notice--active').addClass('notice--hovering');
        } else if (e.type === 'mouseleave') {
            $('#notices-wrapper .notice--active').removeClass('notice--hovering');
        }
    }

};

var NoticeInit = function(){
  NoticePosting.populateNotice();
  

  window.setTimeout(function(){
  $('#notices-wrapper').css('display', 'block').removeClass('notices-wrapper--loading');
      $('#notices-wrapper .notice--latest').addClass('notice--active');
      window.setTimeout(function () {
      NoticePosting.addNoticePlaceholders();
      }, 500);
  }, 500);
  $('.notices-expand').on('click', function (e) {
      if ($(e.target).hasClass('notices-close') === true) {
          return false;
      } else {
          NoticePosting.expandNotice();
      }
  });

    $('#notices-wrapper').hover(function (e) {
          NoticePosting.hoverNotice(e);
  });
};
$(document).ready(function () {
  NoticeInit();     
});



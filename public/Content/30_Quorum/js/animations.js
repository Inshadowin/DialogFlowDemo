/* 
********************* 
/* Animation Triggers */
/********************* 
 */
/* This animation file demonstrates how the open screen unsaved states should be handled - this can be separated out into files to best suit the structure of QFC */
$(document).ready(function () {
  $('.tab-pane-unsaved li .button').on('click', function (e) {
    e.preventDefault();
    $(this).parent('li').remove();
    if ($('.tab-pane-unsaved').children('li').length === 0) {
      $('.tab-pane-unsaved').html('<li class="hint text-center"><i>no screens with unsaved changes</i></li>');
    }
  });

  $('.tab-pane-saved li .button').on('click', function (e) {
    e.preventDefault();
    $(this).parent('li').remove();
    if ($('.tab-pane-saved').children('li').length === 0) {
      $('.tab-pane-saved').html('<li class="hint text-center"><i>no open screens</i></li>');
    }
  });
});

// open screen control animations
function animation(target, animation) {
  $(target).addClass(animation);
  window.setTimeout(function () {
    $(target).removeClass(animation);
  }, 4000);
}

function colorChange(status) {
  if (status === 'saved') {
    $('.openscreenscontrol-animations').removeClass('unsaved');
    $('.openscreenscontrol-animations').removeClass('im-unsaved');
  }
  if (status === 'unsaved') {
    $('.openscreenscontrol-animations').addClass('unsaved');
    $('.openscreenscontrol-animations').addClass('im-unsaved');
  }
}

function slideInOut(target, status) {
  var savedIcon = $('.saved-icon'),
    unsavedIcon = $('.unsaved-icon');
  target = $(target + ' .openscreencount');

  savedIcon.addClass('exit').removeClass('enter');
  // target.addClass('hide');

  window.setTimeout(function () {
    unsavedIcon.addClass('enter');
    window.setTimeout(function () {
      unsavedIcon.removeClass('enter');
      savedIcon.addClass('enter');
      window.setTimeout(function () {
        // target.removeClass('hide');
      }, 1000);
    }, 4000);
  }, 150);
}

function statusIndicator(target) {
  if ($(target).hasClass("im-unsaved")) {
    return;
  }
  //animation(target, 'shake');
  colorChange('unsaved');

  window.setTimeout(function () {
    slideInOut(target, 'unsaved');
  }, 1150);
}

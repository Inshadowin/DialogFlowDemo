(function($) {
  'use strict';
  /* Menu */
  var menuWrap = $('#menuContent');
  var menu = $('#mainNavigation');
  var menuHamburger = $('#menuCollapsedButton');
  
  menu.ssdVerticalNavigation();

  menuHamburger.on('click', function(){
	  menuWrap.toggleClass('menuOpen');
	  return false;
  });
}(jQuery));

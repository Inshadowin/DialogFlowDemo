var totalScroll = 50;

var totalWidth = function(){
  var listItems = 0;
  $('.tab-ul li').each(function(){
    var listItem = $(this).outerWidth();
    listItems+=listItem;
  });
  return listItems;
};

var excessItems = function(){
  return (($('.k-header-tabs').outerWidth())-totalWidth()-initialPlace())-totalScroll;
};

var initialPlace = function(){
  return $('.tab-ul').position().left;
};

var shiftList = function(){
  if (($('.k-header-tabs').outerWidth()) < totalWidth()) {
    $('.k-tab-right').show();
  }
  else {
    $('.k-tab-right').hide();
  }
  
  if (initialPlace()<0) {
    $('.k-tab-left').show();
  }
  else {
    $('.item').animate({left:"-="+initialPlace()+"px"},'slow');
  	$('.k-tab-left').hide();
  }
}

shiftList();

$(window).on('resize',function(e){  
  	shiftList();
});

$('.k-tab-right').click(function() {
  
  $('.k-tab-left').fadeIn('slow');
  $('.k-tab-right').fadeOut('slow');
  
  $('.tab-ul').animate({left:"+="+excessItems()+"px"},'slow',function(){

  });
});

$('.k-tab-left').click(function() {
  
	$('.k-tab-right').fadeIn('slow');
	$('.k-tab-left').fadeOut('slow');
  
  	$('.tab-ul').animate({left:"-="+initialPlace()+"px"},'slow',function(){
  	
  	});
});
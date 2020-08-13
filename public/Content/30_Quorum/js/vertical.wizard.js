 $(document).ready(function () {
  var navListItems = $('div.setup-panel div a'),
     tabListItems= $('ul.tabsetup-panel li div.inline-anchor-left a'),
     verticalTabbers = $('ul.tabsetup-panel li div.inline-anchor-right a'),
   navspriteItems = $('div.setup-panel div a span'),
   tabspriteItems = $('ul.tabsetup-panel li div.inline-anchor-left a span'),
          allWells = $('.setup-content'),
          allNextBtn = $('.nextBtn'),
        allPrevBtn = $('.prevBtn'),
        allTabs = $('.text-muted');
 
  allWells.hide();

  tabListItems.click(function(e){
    e.preventDefault();
    var $target = $($(this).attr('href'));
    tabListItems.removeClass('btn-primary').addClass('btn-default');
    var $item = $(this);
    var id = $item.attr('value');
    tabspriteItems.removeClass();
    tabspriteItems.addClass('sprite');
     $(tabspriteItems).parent().parent().parent().removeClass('tab-pending');
    if(!$item.hasClass('disabled')){
      for(var i =0; i<tabspriteItems.length;i++){
        if(i<id){
            $(tabspriteItems[i]).addClass('q-wizard_complete');
            $(tabspriteItems[i]).parent().parent().parent().removeClass('tab-pending');
          }else if (i > id){
            $(tabspriteItems[i]).addClass('q-wizard_current');
             $(tabspriteItems[i]).parent().parent().parent().addClass('tab-pending');
          }
      }
      $item.addClass('btn-primary');
       $item.parent().parent().children('div.inline-anchor-left').children('a').children('span').addClass('q-wizard_next');

       $item.parent().parent().removeClass('tab-pending');
      allWells.hide();
      $target.show();
      $target.find('input:eq(0)').focus();
    }
  
  });



  navListItems.click(function (e) {
      e.preventDefault();
      var $target = $($(this).attr('href')),
       id = $(this).attr('value'),
              $item = $(this);
       
      if (!$item.hasClass('disabled')) {
          navListItems.removeClass('btn-primary').addClass('btn-default');
          navspriteItems.removeClass();
          navspriteItems.addClass('sprite');
          for(var i=0;i<navspriteItems.length;i++){
                if(i<id){
                  $(navspriteItems[i]).addClass('q-wizard_complete');
                }else if (i > id){
                  $(navspriteItems[i]).addClass('q-wizard_next');
                }
          }
          $item.children('span').removeClass();
          $item.children('span').addClass('sprite');
         $item.children('span').addClass('q-wizard_current');
           $item.addClass('btn-primary');

           for(var i=0;i<navListItems.length-2;i++){
              $(navListItems[i]).parent().next().removeClass('dashedline').removeClass('straightline').addClass('hline');
              $(navListItems[i]).parent().next().next().removeClass('step-middle-visible').addClass('step-middle');
           }

           if(id==0||id==1||id==(navListItems.length-2)||id==(navListItems.length-1)){
              $(navListItems[0]).parent().next().removeClass('hline').removeClass('dashedline').addClass('straightline');
              $(navListItems[navListItems.length-1]).parent().prev().removeClass('hline').removeClass('dashedline').addClass('straightline');
              $(navListItems[0]).parent().next().next().removeClass('step-middle').addClass('step-middle-visible');
              $(navListItems[navListItems.length-1]).parent().prev().prev().removeClass('step-middle').addClass('step-middle-visible');
              $(navListItems[navListItems.length-2]).parent().prev().removeClass('straightline').removeClass('hline').addClass('dashedline');
           }else{
              $(navListItems[0]).parent().next().removeClass('hline').removeClass('straightline').addClass('dashedline');
              $(navListItems[id]).parent().removeClass('step-middle').addClass('step-middle-visible');
              $(navListItems[id]).parent().next().removeClass('hline').removeClass('dashedline').addClass('straightline');
              $(navListItems[id]).parent().next().next().removeClass('step-middle').addClass('step-middle-visible');
              
              var start=1;
              var next = +id + +start;
              console.log(next);
              console.log(navListItems.length-2);
              if(next==(navListItems.length-2)){
                $(navListItems[navListItems.length-1]).parent().prev().removeClass('hline').removeClass('dashedline').addClass('straightline');
              }else{
                $(navListItems[navListItems.length-1]).parent().prev().removeClass('hline').removeClass('straightline').addClass('dashedline');
              }
           }
           
          allWells.hide();
          $target.show();
          $target.find('input:eq(0)').focus();
      }
  });


verticalTabbers.click(function(e){
    e.preventDefault();
    $item = $(this);
    var curStep = $(this).attr("href"),
      currentTab = $('ul.tabsetup-panel li div.inline-anchor-left a[href="'+curStep+'"]');
      currentTab.removeAttr('disabled').trigger('click');
  
  });
 
 
  allPrevBtn.click(function(){
      var curStep = $(this).closest(".setup-content"),
          curStepBtn = curStep.attr("id"),
          prevStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().prev().prev().children("a"),
          prevTabWizard = $('ul.tabsetup-panel li div.inline-anchor-left a[href="#'+curStepBtn+'"]').parent().parent().prev().children("div").children("a");
          if($(window).width()<=991){
            prevStepWizard.removeAttr('disabled').trigger('click');
          }
          if($(window).width()>=992){
            prevTabWizard.removeAttr('disabled').trigger('click');
          }
  });

  allNextBtn.click(function(){
      var curStep = $(this).closest(".setup-content"),
          curStepBtn = curStep.attr("id"),
          nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().next().children("a"),
          curInputs = curStep.find("input[type='text'],input[type='url']"),
          isValid = true,
          nextTabWizard = $('ul.tabsetup-panel li div.inline-anchor-left a[href="#'+curStepBtn+'"]').parent().parent().next().children("div").children("a");


      $(".form-group").removeClass("has-error");
      for(var i=0; i<curInputs.length; i++){
          if (!curInputs[i].validity.valid){
              isValid = false;
              $(curInputs[i]).closest(".form-group").addClass("has-error");
          }
      }

      if (isValid){
        if($(window).width()<=991){
            nextStepWizard.removeAttr('disabled').trigger('click');
          }
          if($(window).width()>=992){
            nextTabWizard.removeAttr('disabled').trigger('click');
          }
              }
          
  });
if($(window).width()<=991){
  $('div.setup-panel div a.btn-primary').trigger('click');
}

if($(window).width()>=992){
  $('ul.tabsetup-panel li div.inline-anchor-left a.btn-primary').trigger('click');
}

  

});
 
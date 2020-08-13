$(function () {
    var visibleWidth;
   // qfcParsingDone(function () {
        visibleWidth = $('.visible-width').outerWidth();
   // });
    var arrowWidth = 40

    var moveOnClick = function (x, element, arrow) {

        if (element != 'undefined') {
            var visiRem = (visibleWidth * 0.75) + arrowWidth;
            var howfar = (widthOfList(element) + getLeftPosi(element)) - visibleWidth;
            if ((howfar < visiRem) && (x == "r")) {
                $(arrow).fadeOut('slow');
            }
            if ((getLeftPosi(element) == -visiRem) && (x == "l")) {
                $(arrow).fadeOut('slow');
            }
            return visiRem;
        }
    }

    var widthOfList = function (element) {
        var itemsWidth = 0;

        $(element).find('li').each(function () {
            var itemWidth = $(this).outerWidth();
            itemsWidth += itemWidth;
        });
        return itemsWidth;
    };

    var getLeftPosi = function (element) {
        if (!element || element.left <= 0) {
            return 0;
        }
        return $(element).position().left;
    };

    var reAdjust = function () {
        var tabCtrls = $(".k-tab-pre-wrap");
        $.each(tabCtrls, function (n, tabCtrl) {
            var element = $(tabCtrl).find(".k-tab-control-k-list");
            element.animate({ left: "0px" }, 0, function () {
            });
            if (($(tabCtrl).outerWidth()) < (widthOfList(element) + arrowWidth)) {
                $(tabCtrl).parent().find('.k-tab-control-right').show();
            }
            else {
                $(tabCtrl).parent().find('.k-tab-control-right').hide();
            }

            if (getLeftPosi(element) < 0) {
                $(tabCtrl).parent().find('.k-tab-control-left').show();
            }
            else {
                $(tabCtrl).parent().find('.k-tab-control-left').hide();
            }
        });
    }

    var attachClickEventsIfNeeded = function () {
        var rightButtons = $('.k-tab-control-right');
        $.each(rightButtons, function (n, rightButton) {
            if ($(rightButton).data().hasOwnProperty("clickflag")) {
                return;
            }
            $(rightButton).data().clickflag = true;
            $(rightButton).click(function () {
                var that = this;
                if ($(that).data().clickflag) {
                    $(that).data().clickflag = false;
                    $(that).parent().find('.k-tab-control-left').fadeIn('slow');
                    var element = $(that).parent().parent().find('.k-tab-control-k-list').first();
                    $(element).animate({ left: "-=" + moveOnClick("r", element, $(that)) + "px" }, 'slow', function () {
                        $(that).data().clickflag = true;
                    });
                }
            });
        });

        var leftButtons = $('.k-tab-control-left');
        $.each(leftButtons, function (n, leftButton) {
            if ($(leftButton).data().hasOwnProperty("clickflag")) {
                return;
            }
            $(leftButton).data().clickflag = true;
            $(leftButton).click(function () {
                var that = this;
                if ($(that).data().clickflag) {
                    $(that).data().clickflag = false;
                    $(that).parent().find('.k-tab-control-right').fadeIn('slow');
                    var element = $(that).parent().parent().find('.k-tab-control-k-list').first();
                    $(element).animate({ left: "+=" + moveOnClick("l", element, $(that)) + "px" }, 'slow', function () {
                        $(that).data().clickflag = true;
                    });
                }
            });
        });
    };

    $(window).on('resize qTabLoaded', function (e) {
        visibleWidth = $('.visible-width').outerWidth();
        reAdjust();
        $('.k-tab-control-left').hide();
        attachClickEventsIfNeeded();
    });
});

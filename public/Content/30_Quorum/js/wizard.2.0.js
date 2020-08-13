    var wizardDefaults = {
        wizardMobileBreak: 800, // Sets the mobile break point
        nextButtonText: 'Next', // Sets the next button text
        prevButtonText: 'Prev', // Sets the previous button text
        submitButtonText: 'Submit', // Sets submit button text
        validateTrue: true, // Toggles the wizard sections to validate true by default
        firstSectionBG: false, // Toggles the background color for the first section
        startScreen: false, // Toggles the start screen visibility
        endScreen: false, // Toggles the end screen visibility
        endScreenURL: '#', // Sets the end screen url, active if end screen set to false
        introText: true, // Sets the height of the start screen options based on intro text visibility
        animationTimings: {
            sidebarInDelay: 100, // Sets the timing for the subsequent delay of the sidebar animation
        }, 
        animationTimingsMobile: {
            accordionInIntitial: 300, // Sets the timing for the initial delay of the accordion animation
            accordionInDelay: 100, // Sets the timing for the subsequent delay of the accordion animation
        }
    };

// Main elements and classes used by the wizard.
    var wizardVariables = {
        wizardMain: $('.q-wizard--main'),
        wizardSection: $('.q-wizard--section'),
        wizardSectionActive: $('.q-wizard--section--active'),
        wizardSectionFirst: $('.q-wizard--section:first'),
        wizardInfo: $('.q-wizard--info'),
        wizardEnd: $('.q-wizard--end'),
        wizardStart: $('.q-wizard--start'),
        wizardSidebarLi: $('.q-wizard--sidebar li'),
        wizardSidebarLiFirst: $('.q-wizard--sidebar li:first'),
        wizardMobileHeader: $('.q-wizard--header--mobile'),
        wizardMobileHeaderFirst: $('.q-wizard--header--mobile:first'),
        wizardSectionActiveInputs: $('.q-wizard--section.q-wizard--section--active .q-wizard--section--inputs'),

        cssClasses: {
            wizardInfoActive: 'q-wizard--info--active',
            wizardEndActive: 'q-wizard--end--active',
            wizardStartActive: 'q-wizard--start--active',
            wizardIntroActive: 'q-wizard--intro--active',
            wizardSection: 'q-wizard--section',
            wizardSectionActive: 'q-wizard--section--active',
            wizardMobileHeader: 'q-wizard--header--mobile',
            wizardSidebarCollapse: 'q-wizard--sidebar--collapsed'
        }
    };

    // Basic utilities
    var wizardUtilities = {
        // Detects the size of the browser window
        detectMobile: function (mobileBreak) {
            //  returns false if window is greater than the breakpoint set
            if (window.outerWidth > mobileBreak) return false;
            return true;
        },
        // Sets the first section background based on the defaults set
        setSectionBG: function() {
            if (wizardDefaults.firstSectionBG === true) {
                $('.q-wizard--section:nth-child(1)').addClass('q-wizard--section--gray');
            }
        },

        // Detects whether to add a background to the section
        detectSectionBG: function () {
            if ($('.q-wizard--section--active').hasClass('q-wizard--section--gray')) {
                wizardVariables.wizardMain.addClass('q-wizard--main--gray');
            } else {
                wizardVariables.wizardMain.removeClass('q-wizard--main--gray');
            }
        },
        // Ensures the window resize doesn't overwhelm the browser
        throttle: function (callback, limit) {
            var wait = false;
            return function () {
                if (!wait) {
                    callback.call();
                    wait = true;
                    setTimeout(function () {
                        wait = false;
                    }, limit);
                }
            };
        },
    };

    var wizardAnimations = {
        // Fade in animation for the sidebar li elements
        InOut: function inOut(elem, delay) {
            $(elem).hide();
            $(elem).each(function (index) {
                index = index + 1;
                window.setTimeout(function () {
                    // Shows each element individually after timeout
                    $(elem + ':nth-child(' + index + ')').show();
                        if (index === $(elem).length) {
                            // Makes the main section active after all elements are visible
                            wizardVariables.wizardMain.addClass('q-wizard--main--active');
                        }
                }, index * delay);
            });
        },
        // Fade in animation for the accordion header elements
        InOutMobile: function InOutMobile(initialDelay, subDelay) {
            
            wizardVariables.wizardMobileHeader.hide();
            wizardVariables.wizardSectionActiveInputs.addClass('hide');
            wizardVariables.wizardMobileHeader.each(function (index) {
                index = index + 1;
                window.setTimeout(function () {
                    // Shows each element individually after timeout
                    $('.' + wizardVariables.cssClasses.wizardSection + ':nth-child(' + index + ') .' + wizardVariables.cssClasses.wizardMobileHeader).show();
                    window.setTimeout(function () {
                        if (index === wizardVariables.wizardMobileHeader.length) {
                            // Makes the main section active after all elements are visible
                            wizardVariables.wizardSectionActiveInputs.removeClass('hide');
                            wizardVariables.wizardMain.addClass('q-wizard--main--active');
                            wizardVariables.wizardSidebarLi.show();
                        }
                    }, initialDelay);
                }, index * subDelay);
            });
        },
        // Toggles the collapsed state of the sidebar
        toggleSidebarCollapse: function() {
            $('.q-wizard--info .q-wizard--sidebar').toggleClass(wizardVariables.cssClasses.wizardSidebarCollapse);
        },
        // Smooth scroll animation
        scroll: function (parent, target, offset, delay) {
            $(parent).animate({
                scrollTop: $(target).offset().top + offset
            }, delay);
        }
    };

    // Functionality for switching between the start, end and main wizard screens
    var wizardLayout = {
        // Ensures that the height of each option is equal on the start screen
        equalOptionHeight: function (className) {
            var maxHeight = 0;
            $('.' + className).each(function () {
                // determines and sets the height based on the tallest element
                if ($(this).height() > maxHeight) { 
                    maxHeight = $(this).height(); 
                }
            });

            // Sets the minimum height of each element based on the tallest element
            $('.' + className).css('min-height', maxHeight);
        },
        // Shows the end/success screen based on defaults set
        showEnd: function () {
            if (wizardDefaults.endScreen === true) {
                wizardVariables.wizardInfo.removeClass(wizardVariables.cssClasses.wizardInfoActive);
                wizardVariables.wizardEnd.addClass(wizardVariables.cssClasses.wizardEndActive);
                // Resets the main wizard validation and navigation position
                wizardLayout.resetAll();
            } else if (wizardDefaults.endScreenURL.length > 0 && wizardDefaults.endScreenURL.length !== '#') {
                // Navigates to a new url if one is set
                window.location.href = wizardDefaults.endScreenURL;
            }
            window.scrollTo(0, 0);
        },
        // Shows the start screen based on defaults set
        showStart: function () {
            if (wizardDefaults.startScreen === true) {
                if (wizardDefaults.introText === true) {
                    // Resizes the height of the start screen options if the info text is active
                    $('.q-wizard').addClass(wizardVariables.cssClasses.wizardIntroActive);
                } else {
                    // Ensures no intro text is visible if set to false
                    $('.intro p').text('');
                }
                // Hides the end and main wizard screens
                wizardVariables.wizardInfo.removeClass(wizardVariables.cssClasses.wizardInfoActive);
                wizardVariables.wizardEnd.removeClass(wizardVariables.cssClasses.wizardEndActive);
                // Shows the start screen
                wizardVariables.wizardStart.addClass(wizardVariables.cssClasses.wizardStartActive);
                // Sets the heights of the options to be equal
                this.equalOptionHeight('q-wizard--option--inner');
            } else {
                // Shows the main screen if the start screen is turned off
                this.showInfo();
            }
        },
        // Shows the info screen
        showInfo: function () {

            // Shows the main wizard screen
            wizardVariables.wizardInfo.addClass(wizardVariables.cssClasses.wizardInfoActive);

            // Hides the start and end wizard screens
            wizardVariables.wizardStart.removeClass(wizardVariables.cssClasses.wizardStartActive);
            wizardVariables.wizardEnd.removeClass(wizardVariables.cssClasses.wizardEndActive);

            // Sidebar and mobile header animations based on the mobile breakpoint
            if (wizardUtilities.detectMobile(wizardDefaults.wizardMobileBreak)) {
                wizardAnimations.InOutMobile(wizardDefaults.animationTimingsMobile.accordionInIntitial, wizardDefaults.animationTimingsMobile.accordionInDelay); // mobile: time until main content opens , time of each step animation
            } else {
                wizardAnimations.InOut('.q-wizard--sidebar li', wizardDefaults.animationTimings.sidebarInDelay); // desktop: time before section animate , time of sections animating
            }

            window.scrollTo(0, 0);

            // Sets and detects the section background based on defaults set
            wizardUtilities.setSectionBG();
            wizardUtilities.detectSectionBG();

            // Sets the navigation text based on defaults set
            $('.nextBtn').text(wizardDefaults.nextButtonText);
            $('.prevBtn').text(wizardDefaults.prevButtonText);
        },
        // Creates the accordion menu from the desktop sidebar li elements
        setMobileAccordionMenu: function () {
            wizardVariables.wizardMobileHeader.each(function (index) {
                $(this).hide();
                index = index + 1;

                // Creates a mobile header from each sidebar li element
                var mobileHeader = $('.q-wizard--sidebar ul li:nth-child(' + index + ')').html();
                $(this).html(mobileHeader);
                $(this).attr('data-toggle-screen', index);

                // Shows the accordion menu if in mobile view
                if (wizardUtilities.detectMobile(wizardDefaults.wizardMobileBreak)) {
                    $(this).show();
                }
            });
        },
        // Switches the headers for mobile on and off based on screen size
        toggleLayout: function () {
            if (wizardUtilities.detectMobile(wizardDefaults.wizardMobileBreak)) {
                wizardVariables.wizardMobileHeader.show();
            } else {
                wizardVariables.wizardMobileHeader.hide();
            }
        },
        // Resets the state of valid and invalid inputs for the sidebar
        resetSidebar: function () {
            wizardVariables.wizardSidebarLi.hide();
            wizardVariables.wizardSidebarLi.removeClass('active visited valid error');
            wizardVariables.wizardSidebarLiFirst.addClass('active');
            wizardVariables.wizardMobileHeaderFirst.addClass('active');

        },
        // Resets the state of valid and invalid inputs for the mobile accordion
        resetAccordion: function () {
            wizardVariables.wizardMobileHeader.removeClass('active visited valid error');
            wizardVariables.wizardMobileHeaderFirst.addClass('active');
        },
        // Hides the main wizard screen
        resetInfo: function () {
            wizardVariables.wizardMain.removeClass('q-wizard--main--active');
            wizardVariables.wizardSection.removeClass(wizardVariables.cssClasses.wizardSectionActive);
            wizardVariables.wizardSectionFirst.addClass(wizardVariables.cssClasses.wizardSectionActive);
        },
        // Resets the main wizard screen entirely
        resetAll: function(){
            this.resetInfo();
            this.resetSidebar();
            this.resetAccordion();
        },
        // Sets the wizard input sections to hidden
        hideSections: function () {
            wizardVariables.wizardSection.removeClass(wizardVariables.cssClasses.wizardSectionActive);
        }
    };

    // Functionality for the wizard nav
    var wizardNavigation = {
        next: function () {
            var totalScreens = wizardVariables.wizardMobileHeader.length + 1;
                nextScreenID = $('.q-wizard--header--mobile.active').data('toggle-screen') + 1,
                nextScreenIDDesktop = $('.q-wizard--sidebar li.active').next('li').data('toggle-screen'),
                nextActiveMobile = $('.q-wizard--header--mobile[data-toggle-screen="' + nextScreenID + '"]'),
                currentActiveMobile = $('.q-wizard--header--mobile.active'),
                currentActiveDesktop = $('.q-wizard--sidebar li.active'),
                nextActiveDesktop = $('.q-wizard--sidebar li.active').next();

            // Set the text for the final screen button
            if (nextScreenID === totalScreens - 1 || nextScreenID === totalScreens) {
                $('.nextBtn').text(wizardDefaults.submitButtonText);
            } else {
                $('.nextBtn').text(wizardDefaults.nextButtonText);
            }

            // Check if it's the final screen
            if (null === nextScreenID || nextScreenID === totalScreens) {
                // Navigate to end
                wizardLayout.showEnd();
            } else {
                // Show the next wizard input section

                // Scroll to menu header if in mobile
                if (wizardUtilities.detectMobile(wizardDefaults.wizardMobileBreak)) {
                    wizardAnimations.scroll('html, body', '.q-wizard--header--mobile.active', 12, 200);
                }

                // Set the state for the current and next active section
                nextActiveDesktop.addClass('active visited');
                nextActiveMobile.addClass('active visited');

                // Makes a visited section accessible to the user
                if (wizardDefaults.validateTrue === true) {
                    // Validates true by default based on the parameter set
                    currentActiveDesktop.addClass('visited valid').removeClass('active');
                    currentActiveMobile.addClass('visited valid').removeClass('active');
                } else {
                    // No validation based on the parameter set
                    currentActiveDesktop.addClass('visited').removeClass('active');
                    currentActiveMobile.addClass('visited').removeClass('active');
                }

                // Hides the inactive sections
                wizardLayout.hideSections();

                // Shows the active sections for mobile and desktop
                $('#' + nextScreenIDDesktop).addClass(wizardVariables.cssClasses.wizardSectionActive);
                $('#' + nextScreenID).addClass(wizardVariables.cssClasses.wizardSectionActive);

                // Checks to see if a background is needed for the section
                wizardUtilities.detectSectionBG();
            }
        },
        prev: function () {
            var prevScreenID = $('.q-wizard--sidebar li.active').prev('li').data('toggle-screen'),
                prevActiveMobile = $('.q-wizard--header--mobile[data-toggle-screen="' + prevScreenID + '"]'),
                currentActiveMobile = $('.q-wizard--header--mobile.active'),
                currentActiveDesktop = $('.q-wizard--sidebar li.active'),
                prevActiveDesktop = $('.q-wizard--sidebar li.active').prev('li');
           
            // Ensures the next button text is correct    
            if ($('.nextBtn').text() !== wizardDefaults.nextButtonText) {
                $('.nextBtn').text(wizardDefaults.nextButtonText);
            }

            // Shows the start (if turned on in defaults) 
            // screen when navigating back from the 1st section
            if (prevActiveDesktop.length === 0) {
                wizardLayout.showStart();
                wizardLayout.resetAll();
            } else {
                if (wizardUtilities.detectMobile(wizardDefaults.wizardMobileBreak)) {
                    // Scrolls to accordion header if in mobile
                    wizardAnimations.scroll('html, body', '.q-wizard--header--mobile.active', -102, 200);
                }

                // Makes the previous sidebar element and header element current
                prevActiveMobile.addClass('active');
                prevActiveDesktop.addClass('active');

                // Makes a visited section accessible to the user
                if (wizardDefaults.validateTrue === true) {
                    // Validates true by default based on the parameter set
                    currentActiveMobile.addClass('visited valid').removeClass('active');
                    currentActiveDesktop.addClass('visited valid').removeClass('active');
                } else {
                    // No validation based on the parameter set
                    currentActiveMobile.addClass('visited').removeClass('active');
                    currentActiveDesktop.addClass('visited').removeClass('active');
                }
                window.setTimeout(function () {
                    // Hides all sections
                    wizardLayout.hideSections();

                    // Makes the previous section the new current section
                    $('#' + prevScreenID).addClass(wizardVariables.cssClasses.wizardSectionActive);
            
                    // Checks to see if a background is needed for the section
                    wizardUtilities.detectSectionBG();
                }, 200);
            }
        },
        // Functionality for navigating via the sidebar li's, and accordion headers
        sidebarAndAccordion: function (e) {

            // Sets the screen ID based on the element selected
            var screenID = $(e.target).data('toggle-screen');

            // Checks to see if screen has been visited
            if ($(e.target).hasClass('visited')) {
                // Adds a class of visited to the currently active screen
                // Removes the class of active from the currently active screen
                $('.q-wizard--header--mobile.active').addClass('visited').removeClass('active');
                $('.q-wizard--sidebar ul li.active').addClass('visited').removeClass('active');

                // Adds a class of active to the newly active screen
                $('*[data-toggle-screen=' + screenID + ']').addClass('active');
                if (wizardUtilities.detectMobile(wizardDefaults.wizardMobileBreak)) {
                    window.setTimeout(function () {
                    // Scrolls to accordion header if in mobile
                        wizardAnimations.scroll('html, body', '.q-wizard--header--mobile.active', -54, 200);
                    }, 50);
                }
                // Hides inactive sections
                wizardLayout.hideSections();

                // Shows the currently active screen
                $('#' + screenID).addClass(wizardVariables.cssClasses.wizardSectionActive);
            }
        }
    };

    // Initialised the wizard
    var wizardInit = function(){

        //  Add collapse fuctionality on click event to sidebar collapse button
        $('#toggle-sidebar-collapsed').click(function () {
            wizardAnimations.toggleSidebarCollapse();
        });

        // Adds wizard navigation functionality to next button
        $('.q-wizard-navigation .nextBtn').on('click', function () {
            wizardNavigation.next();
        });

        // Adds wizard navigation functionality to previous button
        $('.q-wizard-navigation .prevBtn').on('click', function () {
            wizardNavigation.prev();
        });

        // Navigates to the main wizard screen when an option is selected
        $('.q-wizard--option').on('click', function () {
            wizardLayout.showInfo();
        });

        // Adds wizard navigation functionality to the sidebar nav
        $('.q-wizard--sidebar li').on('click', function (e) {
            wizardNavigation.sidebarAndAccordion(e);
        });

        // Adds wizard navigation functionality to the mobile accordion nav
        wizardVariables.wizardMobileHeader.on('click', function (e) {
            wizardNavigation.sidebarAndAccordion(e);
        });

        // Creates the mobile accordion menu
        wizardLayout.setMobileAccordionMenu();

        // Shows the start screen if enabled
        wizardLayout.showStart();

        // Toggles the layout between mobile and desktop on window resize
        window.addEventListener("resize", wizardUtilities.throttle(wizardLayout.toggleLayout, 50));
    };

    $(document).ready(function () {
        // Intitialised the wizard on document load
        wizardInit();
    });

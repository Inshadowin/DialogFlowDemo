/**
 * Two things are required to implement a slide out pane. These requirements
 * exist as we support multiple slide-out-panes on a single page.
 *
 * 1. An element on the DOM with a class of "slide-out-pane" and a unique ID.
 *    e.g. --- <div class="slide-out-pane" id="pane-1">
 *
 * 2. An element on the DOM with a class of "pane-toggle" and a data attribute
 *    that matches the unique ID of the target pane. This is used to to open
 *    and close the slide out pane. The unique ID in step one is used to hide
 *    and show a specific slide out pane.
 *    e.g. --- <a class="pane-toggle" data-pane="pane-1" href="#">toggle me</a>
 */

/**
 * This scope contains all code related to the "reusable nature" of
 * the slide out pane without any content. Content specific code
 * is below this scope (e.g. notes).
 */
var panes = {
  dockingToggle: $('.pane-dock'),
  panes: $('.slide-out-pane'),
  resizeToggle: $('.pane-resize'),
  toggle: $('.pane-toggle'),

  init: function() {
    panes.registerVisibilityEvents();
    panes.handleVisibilityToggle();
    panes.registerResizeEvents();
    panes.handleResizeToggle();
    panes.registerDockingEvents();
    panes.handleDockingToggle();
    panes.initKendoDropdowns();
  },

  /**
   * Kendo requires us to call "kendoDropDownList()" on any elements that
   * should use the kendo-dropdown. This method does this on any dropdowns with
   * a class of ".k-dropdown".
   */
  initKendoDropdowns: function() {
    var kendoDropdowns = $('.k-dropdown');
    kendoDropdowns.kendoDropDownList();
  },

  /**
   * Formats new date-time objects to match mm/dd/yyyy hh/mm/ss am/pm
   * as represented in the designs.
   */
  formatDateTime: function() {
    var dateTime = new Date();
    return kendo.toString(new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDay(), dateTime.getHours(), dateTime.getMinutes(), dateTime.getSeconds()), 'G');
  },

  /**
   * We register custom events to "open" and "close" the panes so that
   * they can be accessed from outside of the scope of the pane. E.g. we
   * need to auto focus the kendo editor when opening the notes version
   * of the slide out panel. By using custom open/close events we can
   * bind to the event to trigger the auto-focus.
   */
  registerVisibilityEvents: function() {
    panes.toggle.on('click', function(e) {
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);

      var paneAlreadyClosedThisClick = false;
      var paneToToggle = $(e.target).data('pane');
      var IDofPaneToToggle = paneToToggle ? '#' + paneToToggle : undefined;
      var toggleIsInADockedPane = !!$(e.target).closest('.slide-out-pane').length;
      var undockedPane = $('.slide-out-pane.visible:not(.docked)');

      if (undockedPane.length) {
        undockedPane.trigger('closePane');

        if (undockedPane.is(IDofPaneToToggle)) {
          paneAlreadyClosedThisClick = true;
        }
      }

      var dockedPaneByID = $(IDofPaneToToggle + '.docked');
      var paneByID = $(IDofPaneToToggle);

      if (toggleIsInADockedPane) {
        var closestPane = $(e.target).closest('.slide-out-pane');
        return closestPane.trigger('closePane');
      }

      if (dockedPaneByID.length && dockedPaneByID.hasClass('visible')) {
        return dockedPaneByID.trigger('closePane');
      } else if (dockedPaneByID.length && !dockedPaneByID.hasClass('visible')) {
        return dockedPaneByID.trigger('openPane');
      } else if (!paneAlreadyClosedThisClick) {
        return paneByID.trigger('openPane');
      }
    });
  },

  /**
   * Handles the hiding and showing of a pane by calling the custom "open" and
   * "close" events defined in our registerVisibilityEvents() method. Animations
   * are handled by the 'visible' class in slide-out-pane.less. Large panes are
   * converted back to small panes after animations are complete (250ms) when
   * a pane is closed.
   */
  handleVisibilityToggle: function() {
    panes.panes.on('closePane', function(e) {
      $(e.target).removeClass('visible').delay(250).removeClass('large-pane');
    });

    panes.panes.on('openPane', function(e) {
      $(e.target).addClass('visible');
    });
  },

  /**
   * We register custom events to "resize" the panes so that they can be
   * accessed from outside of the scope of the pane. E.g. we need to redraw
   * the kendo splitters and editors when resizing the pane. By using custom
   * resize events we can bind to the event to trigger the redraws.
   */
  registerResizeEvents: function() {
    panes.resizeToggle.on('click', function(e) {
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);

      var closestPane = $(e.target).closest('.slide-out-pane');

      if (closestPane.hasClass('large-pane')) {
        closestPane.trigger('smallPaneResize');
      } else {
        closestPane.trigger('largePaneResize');
      }
    });
  },

  /**
   * Handles the resizing of a pane by calling the custom "smallPaneResize"
   * and "largePaneResize" events defined in our registerResizeEvents() method.
   */
  handleResizeToggle: function() {
    panes.panes.on('smallPaneResize', function(e) {
      $(e.target).removeClass('large-pane');
      if ($(e.target).hasClass('notes-2')) {
        console.log('Hide all columns for notes and show only condensed ones');
        notes.showOnlyBaseNotesColumns();

      } else if ($(e.target).hasClass('attachments-2')) {
        console.log('Hide all columns for attachments and show only condensed ones');
      } 
    });

    panes.panes.on('largePaneResize', function(e) {
      $(e.target).addClass('large-pane');
      if ($(e.target).hasClass('notes-2')) {
        console.log('Show all columns for notes ');
        notes.showAllNotesColumns();

      } else if ($(e.target).hasClass('attachments-2')) {
        console.log('Show all columns for attachments');
        
      } 
      
    });
  },

  /**
   * We register custom events to "dock" the panes so that they can be
   * accessed from outside of the scope of the pane.
   */
  registerDockingEvents: function() {
    panes.dockingToggle.on('click', function(e) {
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);

      var closestPane = $(e.target).closest('.slide-out-pane');

      if (closestPane.hasClass('docked')) {
        closestPane.trigger('undockPane');
      } else {
        closestPane.trigger('dockPane');
      }
    });
  },

  /**
   * Handles the docking of a pane by calling the custom "undockPane"
   * and "dockPane" events defined in our registerDockingEvents() method.
   */
  handleDockingToggle: function() {
    panes.panes.on('undockPane', function(e) {
      e.preventDefault();
      var closestPane = $(e.target).closest('.slide-out-pane');
      closestPane.removeClass('docked');
    });

    panes.panes.on('dockPane', function(e) {
      e.preventDefault();
      var closestPane = $(e.target).closest('.slide-out-pane');
      closestPane.addClass('docked');
    });
  },
};

panes.init();

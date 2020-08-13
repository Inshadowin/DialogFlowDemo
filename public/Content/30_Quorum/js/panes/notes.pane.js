/**
 * This scope is here for testing purposes only and is not
 * necessary for the functionality of the slide-out panes.
 */
var test = {
  data: [{
    id: '0e3d50f61b53f15a66d10771ff7ff2c7',
    date: '1/10/2019 10:03:22 AM',
    note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vestibulum aliquam hendrerit. Integer dapibus et turpis eget tincidunt. Maecenas tempus purus vel velit pellentesque tincidunt. Integer placerat lorem luctus, dictum purus ut, eleifend justo. Curabitur lacinia orci et erat eleifend tristique. Mauris lobortis, elit vel vehicula tempus, lacus sem semper.',
    postedBy: 'J.Soap',
    type: 'Date & Document',
  }, {
    id: 'f65e2cb855f12c86af1cc0a374b804f1',
    date: '1/10/2019 10:05:22 AM',
    note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate consequat viverra. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nulla at condimentum massa, nec scelerisque tellus. Ut eleifend tristique justo, non pulvinar mauris. Ut scelerisque, urna et porta tempus, nunc diam hendrerit mi, nec viverra lorem lectus.',
    postedBy: 'J.Soap',
    type: 'Date & Document',
  }],
  user: 'J.Soap',
};

/**
 * This scope handles all "notes" functionality in the slide out pane.
 */
var notes = {
  pane: $('#pane-1'),
  wysiwyg: $('.notes-wysiwyg'),
  listContainer: $('.notes-list'),
  currentNoteType: $('.note-type-select').children('option')[0].value,

  init: function() {
    notes.initExistingNotes();
    notes.handleNotesTypeSelectEvent();
    notes.handleNotesCreateEvent();
    notes.handleExpandCollapse();
    notes.handleKendoRedraw();
    notes.initKendoSplitter();
    notes.initKendoEditor();
    notes.autoFocusEditor();
    notes.showAllNotesColumns();
    notes.showOnlyBaseNotesColumns();
  },

 // For Product flexibility, the first column and the last two columns of date and actions should show initially, all others should be hidden in the condensed view and shown in the expanded view //
// Any columns in between could be added by the Products //
showOnlyBaseNotesColumns: function() {
  var grid = $("#notes-grid");
  if (grid.length == 0) {
    return false;
  }
  var notesGrid = grid.data().kendoGrid;
    for (var i = 0; i < grid.columns.length; i++) {
        grid.hideColumn(i);
        }
    grid.showColumn("Note");
    grid.showColumn("Date");
    grid.showColumn("Action");
  },


  showAllNotesColumns: function() {
    var grid = $("#notes-grid");
    if (grid.length == 0) {
      return false;
    }
    var notesGrid = grid.data().kendoGrid;
    console.log(grid);
    for (var i = 0; i < notesGrid.columns.length; i++) {
        notesdGrid.showColumn(i);
        }  
  },


  // Iterate over existing test note data and populate the notes list.
  initExistingNotes: function() {
    for (var i = 0; i < test.data.length; i++) {
      notes.appendNoteToDOM(test.data[i]);
    }
  },

  /**
   * Handles the toggling of the notes type when selected before
   * creating a new note.
   */
  handleNotesTypeSelectEvent: function() {
    $('.note-type-select').on('change', function(e) {
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
      notes.currentNoteType = e.target.value;
    });
  },

  /**
   * Calls the new note creation method when adding a new
   * note via the add button.
   */
  handleNotesCreateEvent: function() {
    $('.add-note').on('click', function(e) {
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);

      var editorValue = notes.wysiwyg.data('kendoEditor').value();

      if (!editorValue || editorValue !== '') {
        /**
         * We truncate empty paragraph tags added by the Kendo Editor from the
         * end of new notes to prevent the use of uncessary space in the
         * notes list view.
         */
        var newNote = {
          date: panes.formatDateTime(),
          note: editorValue.replace(/<p>&nbsp;<\/p>/g,''),
          postedBy: test.user,
          type: notes.currentNoteType,
        }

        notes.appendNoteToDOM(newNote);

        test.data.push(newNote);

        notes.wysiwyg.data('kendoEditor').value('');
      }
    });
  },

  // Calls the new note creation method when adding a new note via the add button.
  appendNoteToDOM: function(note) {
    // var noteElement =
    //   '<div class="note-wrapper">' +
    //     '<div class="chevron sprite q-grid_expand"></div>' +
    //     '<div class="note">' + note.note + '</div>' +
    //     '<div class="type"><span>Type:</span>' + note.type + '</div>' +
    //     '<div class="author"><span>Posted by:</span>' + note.postedBy + '</div>' +
    //     '<div class="date-time"><span>Date:</span>' + note.date + '</div>' +
    //     '<div class="sprite q-grid_MoreActions dropdown-toggle" data-toggle="dropdown" id="' + note.id + '" aria-haspopup="true" aria-expanded="false"></div>' +
    //     '<ul class="dropdown-menu" aria-labelledby="' + note.id + '">' +
    //       '<li><a href="#">Edit</a></li>' +
    //       '<li><a href="#">Delete</a></li>' +
    //       '<li><a href="#">Expand</a></li>' +
    //     '</ul>' +
    //   '</div>'

    // notes.listContainer.append(noteElement);
    // notes.handleExpandCollapse();
  },

  // Opens and closes notes in the notes pane.
  handleExpandCollapse: function() {
    $('.note-wrapper').off('click').on('click', function(e) {
      var target = $(e.target);

      if (!target.hasClass('dropdown-toggle')) {
        var noteWrapper = target.hasClass('note-wrapper')
          ? target
          : target.closest('.note-wrapper');

        if (!noteWrapper.hasClass('expanded')) {
          $('.note-wrapper').removeClass('expanded');
        }

        noteWrapper.toggleClass('expanded');


        var chevron = noteWrapper.find('.chevron');

        if (chevron.hasClass('q-content_expand')) {
          chevron.removeClass('q-content_expand');
          chevron.addClass('q-content_collapse');
        } else if (chevron.hasClass('q-content_collapse')) {
          chevron.removeClass('q-content_collapse');
          chevron.addClass('q-content_expand');
        }
      }
    });
  },

  /**
   * There is no "redraw" method for the Kendo splitters and editor. We need to
   * redraw these elements when resizing the slide out pane so that they take
   * up the full width of the panel. We have bound this redraw to the custom
   * resize events defined in the panes.registerResizeEvents() method.
   */
  handleKendoRedraw: function() {
    notes.pane.on('smallPaneResize largePaneResize', function() {
      notes.pane.data('kendoSplitter').resize(true);
      notes.wysiwyg.data('kendoEditor').toolbar.resize();
    });
  },

  /**
   * Initialises the kendo wysiwyg editor in the notes pane and binds the
   * "auto-resize" class to the editor to allow for fluid widths when resizing
   * the notes pane.
   */
  initKendoEditor: function() {
    notes.wysiwyg.kendoEditor({
      resizable: {
        content: false,
        toolbar: true,
      },
    }).data('kendoEditor').wrapper.width('').height('').addClass('auto-resize');
  },

  /**
   * Initialises the kendo splitter on the notes pane. The "resizeable" pane
   * must exist between the wysiwyg editor pane and the notes list pane (index
   * 2 & 3 of the panes array below.)
   */
  initKendoSplitter: function() {
    $('#add-edit-notes').kendoSplitter({
      orientation: 'vertical',
      panes: [ 
        { resizable: true, min: '200px', collapsible: false }, // notes pane
        { size: '200px', min: '160px', resizable: true, collapsible: false }, // wysiwyg pane
        { size: '70px', resizable: false, collapsible: false }, // submit pane
      ],
    });

    /**
     * Designs call for a custom border-top style on the middle splitter bar.
     * The class being added here is to accommodate this style adjustment.
     */
    $('#middle-pane').prev('.k-splitbar').addClass('custom-border');
  },

  /**
   * We need to auto focus the kendo editor when opening the notes pane. We are
   * binding to the custom "openPane" event defined in the
   * panes.registerVisibilityEvents() method.
   */
  autoFocusEditor: function() {
    notes.pane.on('openPane', function() {
      notes.wysiwyg.data('kendoEditor').focus();
    });
  },
}

notes.init();

/**
 * This scope handles all "attachments" functionality in the slide out pane.
 * It is important to note that you will not be able to access OneDrive
 * functionality if opening this file directly in the browser (e.g. file://...)
 * as OneDrive expects a valid localhost URL on port 30662 for authentication.
 * To get around this you need to serve this file over HTTP on port 30662. If
 * you have python available on your machine you can run "python -m
 * SimpleHTTPServer 30662" from the directory this file is in and navigate to
 * http://localhost:30662/pane-attachments.html as a way around this.
 */
var attachments = {
  pane: $('#pane-1'),
  attachmentForm: $('.attachment-form'),

  init: function() {
    attachments.handleAddAttachmentsSlideToggle();
    attachments.handleCreateAttachment();
    attachments.handleCloseAttachmentForm();
  },

  /**
   * Appends any given attachment to the primarily list of
   * attachemnts on the DOM.
   */
  appendAttachmentToDOM: function(attachment) {
    var attachmentElement =
      '<div class="attachment-wrapper"' +
           'data-id="' + attachment.id + '">' +
        '<div class="chevron sprite q-grid_expand"></div>' +
        '<div class="name">' + attachment.name + '</div>' +
        '<div class="size">' + attachment.size + '</div>' +
        '<div class="postedBy">' +
          '<span>Posted By: </span>' + attachment.postedBy +
        '</div>' +
        '<div class="comment">' +
          '<span>Comment: </span>' + attachment.comment +
        '</div>' +
        '<div class="date-time">' + attachment.date + '</div>' +
        '<div class="entity-type">' +
          '<span>Entity Type: </span>' + attachment.entityType +
        '</div>' +
        '<div class="content-type">' +
          '<span>Content Type: </span>' + attachment.contentType +
        '</div>' +
        '<div class="sprite q-grid_MoreActions dropdown-toggle" data-toggle="dropdown" id="' + attachment.id + '" aria-haspopup="true" aria-expanded="false"></div>' +
        '<ul class="dropdown-menu" aria-labelledby="' + attachment.id + '">' +
          '<li><a href="#">Edit attachment details</a></li>' +
          '<li><a href="#">Delete attachment</a></li>' +
          '<li><a href="#">Preview attachment</a></li>' +
          '<li><a href="#">Download attachment</a></li>' +
          '<li><a href="#">Copy file path</a></li>' +
        '</ul>' +
      '</div>'

    $('.attachments-list').append(attachmentElement);
    attachments.handleAttachmentToggleEvents();
  },

  /**
   * Appends any given attachment to the "recently attatchments" list of
   * on the DOM.
   */
  appendRecentAttachmentToDOM: function(recentAttachment) {
    var recentAttachmentElement =
      '<div class="recent-attachment-wrapper"' +
           'data-id="' + recentAttachment.id + '">' +
        '<div class="radio">&nbsp;</div>' +
        '<div class="name">' + recentAttachment.name + '</div>' +
        '<div class="size">' + recentAttachment.size + '</div>' +
        '<div class="postedBy">' + recentAttachment.postedBy + '</div>' +
        '<div class="comment">' + recentAttachment.comment +'</div>' +
        '<div class="date-time">' + recentAttachment.date + '</div>' +
      '</div>'

      $('.recent-attachments-list').append(recentAttachmentElement);
      attachments.handleRecentAttachmentEvents();
  },

  // Opens and closes attachments in the attachments pane.
  handleAttachmentToggleEvents: function() {
    $('.attachment-wrapper').off('click').on('click', function(e) {
      var target = $(e.target);

      if (!target.hasClass('dropdown-toggle')) {
        var thisAtachmentsWrapper = target.hasClass('attachment-wrapper')
          ? target
          : target.closest('.attachment-wrapper');

        if (!thisAtachmentsWrapper.hasClass('expanded')) {
          $('.attachment-wrapper').removeClass('expanded');
        }

        thisAtachmentsWrapper.toggleClass('expanded');

        var chevron = thisAtachmentsWrapper.find('.chevron');

        if (chevron.hasClass('q-grid_expand')) {
          chevron.removeClass('q-grid_expand');
          chevron.addClass('q-grid_collapse');
        } else if (chevron.hasClass('q-grid_collapse')) {
          chevron.removeClass('q-grid_collapse');
          chevron.addClass('q-grid_expand');
        }
      }
    });
  },

  /**
   * Opens and closes the "add attachments from" pane within the attachments
   * pane when clicking the "Add attachemnts" button.
   */
  handleAddAttachmentsSlideToggle: function() {
    $('.add-attachment.k-button').off('click').on('click', function(e) {
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
      $('.add-attachments-pane').slideDown();
      attachments.toggleActiveUploadFrom($(e.target));
      attachments.createFromDevice();
      $('.add-attachment.k-button').removeClass('active');
    });
  },

  /**
   * A user has the option to add an attachment from either their device,
   * Microsoft OneDrive, or a recent attachment. This method adds a click
   * event to the attachment buttons that appear after clicking "Add
   * Attachment" on the attachments pane. This click event will call the
   * relevent "create attachment" methods based on the option selected.
   */
  handleCreateAttachment: function() {
    var createButtons = $('.create-buttons');

    createButtons.off('click').on('click', 'button', function(e) {
      var button = $(e.target);
      var type = button.data('type');

      switch (type) {
        case 'device':
          attachments.createFromDevice();
          break;
        case 'onedrive':
          attachments.createFromOneDrive();
          break;
        case 'recent':
          attachments.displayRecentAttachments();
          break;
        default:
          return;
      }

      attachments.toggleActiveUploadFrom(button);
    });
  },

  /**
   * We need to toggle the active state and reveal the neccessary UI elements
   * when clicking on a button to choose which location to add an attachment
   * from. This method handles all of these things.
   */
  toggleActiveUploadFrom: function(button) {
    var type = button.data('type');
    var createButtons = $('.create-buttons');

    if (!button.hasClass('active')) {
      createButtons.find('button').removeClass('active');
      button.addClass('active');
    }

    $('.upload-from[data-type="' + type + '"]').fadeIn();
  },

  /**
   * Called from the handleCreateAttachment() method, this function will
   * construct a "data" object containing all information relevent to the file
   * being uploaded. The method also handles the hiding and showing of the
   * attachment form.
   */
  createFromDevice: function() {
    var file;
    var hiddenFileInput = attachments.attachmentForm.find('.hidden-file-input');

    hiddenFileInput.val('').click();

    hiddenFileInput.off('change').on('change', function(e) {
      file = e.target.files[0];
      attachments.handleAttachmentForm(file);
    });
  },

  /**
   * Removes the "active" state from the "device", "onedrive" and "recent"
   * upload from buttons.
   */
  clearCreateButtonsActiveState: function() {
    $('.create-buttons button').removeClass('active');
  },

  /**
   * This method handles the hiding & showing of the form that allows a user
   * to modify a files data (add comments, type, etc.). This method also
   * constructs the final data object that will be passed to the server for
   * persistence.
   */
  handleAttachmentForm: function(file) {
    attachments.attachmentForm.trigger('reset').fadeIn();

    if (file) {
      attachments.attachmentForm.find('#name').val(file.name);
    }

    attachments.attachmentForm.off('submit').on('submit', function(e) {
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);

      /**
       * IMPLEMENTATION DETAIL: Make sure to get real "id" and "postedBy"
       * data from elsewhere.
       */
      var data = {
        id: file.id ? file.id : test.generateUUID(),
        comment: attachments.attachmentForm.find('textarea').val(),
        contentType: attachments.attachmentForm.find('select').val(),
        date: panes.formatDateTime(),
        entityType: attachments.attachmentForm.find('select').val(),
        name: file.name,
        postedBy: test.user ? test.user : '',
        size: isNaN(file.size) ? file.size : Math.ceil(file.size) + 'K',
      };

      // A call to persist data on the server should go here.
      attachments.appendAttachmentToDOM(data);
      attachments.appendRecentAttachmentToDOM(data)

      test.data.push(data);
      test.recentAttachments.push(data);
    });
  },

  handleCloseAttachmentForm: function() {
    var addAttachmentsPane = $('.add-attachments-pane');
    var closeForm = function(e) {
      attachments.attachmentForm.hide();
      addAttachmentsPane.slideUp();
      attachments.clearCreateButtonsActiveState();
    };

    attachments.attachmentForm.find('button').off('click').on('click', closeForm);
    addAttachmentsPane.find('.title-filter').off('click').on('click', closeForm);
  },

  /**
   * Docs for integrating with the MS OneDrive file picker can be found here:
   * https://docs.microsoft.com/en-us/onedrive/developer/controls/file-pickers
   */
  createFromOneDrive: function() {
    var options = {
      clientId: '0802c542-1e69-4d17-9c23-8a8f992c67d0',
      action: 'download',
      multiSelect: false,
      success: function(result) {
        var file = result.value[0];

        attachments.handleAttachmentForm({
          name: file.name,
          id: file.id,
          size: file.size,
        });
      },
      cancel: function() {
        attachments.clearCreateButtonsActiveState();
      },
      error: function(error) {
        console.error(error);
        attachments.clearCreateButtonsActiveState();
      },
    };

    OneDrive.open(options);
  },

  // Hides & shows the list of recently attached files.
  displayRecentAttachments: function() {
    $('.recent-attachments-list').fadeIn();
    attachments.handleRecentAttachmentEvents();
  },

  /**
   * Finds a recently attatched file when clicking on a list item and
   * calls the handleAttachmentForm() method with that files details.
   */
  handleRecentAttachmentEvents: function() {
    var recentAttachmentListItems = $('.recent-attachment-wrapper');

    recentAttachmentListItems.off('click').on('click', function(e) {
      var target = $(e.target);
      var thisListItem = !target.hasClass('recent-attachment-wrapper')
        ? target.closest('.recent-attachment-wrapper')
        : target;

      /**
       * IMPLETMENTATION DETAIL: The first argument in this "grep" is currently
       * filtering by ID on our test data. One should replace this first
       * argument ("test.data") with a reference to a real data set when
       * implementing this code.
       */
      var file = $.grep(test.data, function(a) {
        return a.id === thisListItem.data('id');
      })[0];

      if (thisListItem.hasClass('active')) {
        $('.attachment-form').hide();
        thisListItem.removeClass('active');
      } else {
        recentAttachmentListItems.removeClass('active');
        thisListItem.addClass('active');
        attachments.handleAttachmentForm(file);
      }
    });
  },
}

attachments.init();

/**
 * This scope is here for testing purposes only and is not
 * necessary for the functionality of the slide-out panes.
 */
var test = {
  user: 'J.Soap',

  /**
   * This test data is populated by a call to the
   * generateTestData() method in our init function.
   */
  data: [],
  recentAttachments: [],

  init: function() {
    test.generateTestData();
    test.initTestAttachments();
    test.initTestRecentAttachments();
  },

  // Generates a random v4 UID for testing purposes.
  generateUUID: function() {
    var dateTime = new Date().getTime();
    var scaffold = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    var uuid = scaffold.replace(/[xy]/g, function(c) {
      var random = (dateTime + Math.random() * 16) % 16 | 0;
      dateTime = Math.floor(dateTime / 16);
      return (c == 'x' ? random : (random & 0x3 | 0x8)).toString(16);
    });

    return uuid;
  },

  // Populates our test data arrays.
  generateTestData: function() {
    var data = [{
      comment: 'Notice how location2 is not populated and is showing higher than expected volumes when compared to the last 12 months. This needs to be carefully watched over the coming days.',
      contentType: 'MTR_HDR | Meter Setup',
      date: '03/10/19 10:03:22 AM',
      entityType: 'MTR_HDR',
      name: 'March-totals.xlsx',
      id: test.generateUUID(),
      postedBy: 'J.Soap',
      size: '1128K',
    }, {
      comment: 'Location5 seems too high.',
      contentType: 'MTR_HDR | Meter Setup',
      date: '02/09/19 09:06:12 AM',
      entityType: 'MTR_HDR',
      name: 'February-totals.xlsx',
      id: test.generateUUID(),
      postedBy: 'J.Soap',
      size: '769K',
    }, {
      comment: '',
      contentType: 'MTR_HDR | Meter Setup',
      date: '02/08/19 14:25:59 PM',
      entityType: 'MTR_HDR',
      name: 'Screenshot 2019-03-15 at 3:14 PM.png',
      id: test.generateUUID(),
      postedBy: 'J.Florentine',
      size: '247K',
    }];

    test.data = data;
    test.recentAttachments.push(data[0]);
  },

  /**
   * Iterate over existing test attachment data and populate the
   * attachments list.
   */
  initTestAttachments: function() {
    for (var i = 0; i < test.data.length; i++) {
      attachments.appendAttachmentToDOM(test.data[i]);
    }
  },

  /**
   * Iterate over some test "recent attachments" data and populate the
   * recent attachments list (visible when clicking new attachment).
   */
  initTestRecentAttachments: function() {
    for (var i = 0; i < test.recentAttachments.length; i++) {
      attachments.appendRecentAttachmentToDOM(test.recentAttachments[i]);
    }
  },
};

test.init();

(function (quorum) {
    (function (bulkEdit) {

        var $handsontable,
            handsontable,
            $kendoWindow,
            kendoWindow,
            options = null;

        bulkEdit.qdata = null;       

        var buildUrl = function () {
            var url = options.urlFormat.format($("#QUIWebContextId").val());
            return url;
        }
        
        bulkEdit.initialize = function () {
            $handsontable = $('<div></div>');
            $kendoWindow = $('<div id="bulkEdit"></div>')
                // .append($('<span class="intro">Actions:</span>'))              
				.append($('<div class="lightboxcontentwrapper"></div>')
				.append($('<div class="lightboxcontent"></div>')
				.append($('<div class="toolbar"></div>')
				.append($('<button id="CopyButton" data-toggle="tooltip" data-placement="bottom" title="COPY" onclick="quorum.bulkEdit.copy();"><span class="sprite q-content_Copy"></span> Copy</button>'))
				.append($('<button id="PasteButton" data-toggle="tooltip" data-placement="bottom" title="PASTE" onclick="quorum.bulkEdit.paste();"><span class="sprite q-content_Paste"></span>Paste</button>'))
                .append($('<button id="applyButton" data-toggle="tooltip" data-placement="bottom" title="APPLY" onclick="quorum.bulkEdit.saveChanges();"><span class="sprite q-content_Apply"></span> Apply</button>'))
              //  .append($('<a id="cancelButton" data-toggle="tooltip" data-placement="bottom" title="CLOSE" class="sprite q-content_Close" onclick="quorum.bulkEdit.cancelChanges();">Close</a>'))
                .append($('<button id="refreshButton" data-toggle="tooltip" data-placement="bottom" title="REFRESH"  onclick="quorum.bulkEdit.refreshFromSource();"><span class="sprite q-content_Refresh"></span> Refresh</button>')))
				.append($handsontable))
				.append($('<div class="modalactions"><a id="ok" href="javascript:void(0)" onclick="quorum.bulkEdit.saveChanges(true);" class="footerlink lightboxClose"> Apply and Close </a><a id="cancel" href="javascript:void(0)" onclick="quorum.bulkEdit.cancelChanges();" class=" footerlink lightboxClose" > Cancel </a></div>')));

            $kendoWindow.appendTo('body');

            kendo.ui.Window.fn._keydown = function (e) { //AI! Disable the Keyboard Navigation of KEndow Window Popup - #140140 
                var code = (e.keyCode ? e.keyCode : e.which);
                if (code == kendo.keys.DOWN && code == kendo.keys.UP && code == kendo.keys.LEFT && code == kendo.keys.RIGHT) {
                    e.preventDefault();
                    return false;
                }
            }

            $kendoWindow.kendoWindow({
                visible: false,
                modal: true,
                //width: "800px",
                //height: "600px",
                title: "Bulk Edit",
                actions: [
                   // "Maximize",
                    "Close"
                ],
                close: function () {
                    options = null;                                    
                    bulkEdit.removeSelection(true);
                },
                activate: function(){
                    setTimeout(function () { bulkEdit.initHandsonTable() });
                },
                resize: function () {
                    bulkEdit.calculateSize();
                },
            });           

            $kendoWindow.add('k-window-content').attr('tabindex', "");
            kendoWindow = $kendoWindow.data("kendoWindow");
            kendoWindow.element.parent().addClass("qLarge top1");
			
            var maxed = false
            , resizeTimeout
            , availableWidth
            , availableHeight;            
        }; 

        bulkEdit.initHandsonTable = function () {            
            if (bulkEdit.qdata) {
                if (bulkEdit.qdata.data.length === 0) {
                    bulkEdit.qdata.data[0] = new Array(bulkEdit.qdata.colHeaders.length);
                }
                var htSettings = {
                    startRows: 10,
                    startCols: 14,
                    rowHeaders: true,
                    //colHeaders: true,
                    width: parseInt($kendoWindow.width()) - 6,
                    height: parseInt($kendoWindow.height()) - 180,
                    minSpareRows: 30,
                    manualRowResize: true,
                    manualColumnResize: true,
                    manualColumnMove: true,
                    persistentState: false,
                    outsideClickDeselects: false,
                    copyRowsLimit: 2147483647,
                    copyColsLimit: 2147483647,
                    currentRowClassName: 'currentRow',
                    currentColClassName: 'currentCol',
                    afterRender: function () {
                        if (bulkEdit.qdata.info) {
                            bulkEdit.renderinfo(bulkEdit.qdata.info);
                        }

                        // Add the onclick attribute to the top left corner to select all data if not there
                        var topLeftCorner = kendoWindow.element.find(".ht_clone_top_left_corner .htCore tr div");
                        if (!topLeftCorner.attr("onclick")) {
                            topLeftCorner.attr("onclick", "quorum.bulkEdit.selectAll();");
                        }
                    },
                    colHeaders: bulkEdit.qdata.colHeaders,
                    data: bulkEdit.qdata.data,
                };
                // Note: To Fix, SIR #161959 - Bulk Edit not following grid's ViewModel control state when applying changes
                if (bulkEdit.qdata.columnWidths.length > 0) $.extend(htSettings, { colWidths: bulkEdit.qdata.columnWidths }); //Columns width applying
                if (bulkEdit.qdata.columnProperties.length > 0) $.extend(htSettings, { columns: bulkEdit.qdata.columnProperties }); //Column level readonly applying   

                $handsontable.handsontable(htSettings);
                handsontable = $handsontable.handsontable('getInstance');
                // Note: To fix, SIR #164311- Bulk View/Edit Action Item on Grids
                // outsideClickDeselects setting to true while closing the window. But when it reopens, outsideClickDeselects still it is true.
                if (handsontable.getSettings().outsideClickDeselects) handsontable.getSettings().outsideClickDeselects = false;
                //bulkEdit.renderinfo(bulkEdit.qdata.info);
            }           
        };
        
        bulkEdit.getHandsonTableData = function () {
            return $.ajax({
                url: buildUrl(),
                dataType: "json",
            }).done(function (data) {
                bulkEdit.qdata = data;               
            });
        };

        // TODO: Move to quorum.util.js or some other common framework script file
        if (!String.prototype.format) {
            String.prototype.format = function () {
                var args = arguments;
                return this.replace(/{(\d+)}/g, function (match, number) {
                    return typeof args[number] != 'undefined'
                      ? args[number]
                      : match;
                });
            };
        }    

        bulkEdit.renderinfo = function (info) {            
            if (info) {
                handsontable = $handsontable.handsontable('getInstance');
                var popovers = $handsontable.find('.q-popover');
                $.each(popovers, function (i, v) {
                    var $v = $(v);
                    $v.data('bs.popover', null);
                    $v.removeClass('q-popover');
                });

                $.each(info, function (i, v) {
                    var c = $(handsontable.getCell(v.rowIndex, v.colIndex));

                    // Set control error highlighting and tooltip
                    if (v.MaxSeverityState) {
                        c.addClass('q-state-' + v.MaxSeverityState);
                        c.addClass('q-popover');
                        if (v.Messages != null) {
                            c.attr('title', '');
                            // Needed to initiate the tooltip
                            var toolTipInfo = qCreateToolTip(v.MaxSeverityState,
                                                                v.Messages);

                            c.data('bs.popover', null);
                            //c.popover(toolTipInfo);
                            $(c).kendoTooltip({
                                filter: $(this),
                                width: "auto",
                                //autoHide: false,
                                animation: false,
                                content: toolTipInfo.content,
                                position: "top"
                            }).data("kendoTooltip");
                        }
                    }
                });
            }
        };

        bulkEdit.calculateSize = function () {
            //var offset = $handsontable.offset();
            //availableWidth = $kendoWindow.width() - offset.left + $kendoWindow.scrollLeft();
            //availableHeight = $kendoWindow.height() - offset.top + $kendoWindow.scrollTop();
            //$handsontable.width(availableWidth).height(availableHeight);
            //handsontable.updateSettings({
            //    width: parseInt($kendoWindow.width()) - 60,
            //    height: parseInt($kendoWindow.height()) - 160,
            //});
            $handsontable.width(parseInt($kendoWindow.width()) - 60)
            $handsontable.height(parseInt($kendoWindow.height()) - 160)
        };

        bulkEdit.startEditing = function (args) {
            if (options != null) {
                alert('Bulk editing session already in progress');
                return;
            }
            options = args;
            bulkEdit.getHandsonTableData().done(function() {                
                kendoWindow.center().open().maximize(); //After kendo upgrade, kendoWindow.center().maximize().open() is not working. That's why open & maximize are switched.
            });
            //JDL is there a better way to do this? I don't want to do $("#applyButton") because it seemed to generic. I want to make sure I get the control in the kendoWindow.
            $.each(kendoWindow.element.find('button'), function (key, value) {
                if (value.id === "applyButton") {
                    if(options.readOnly === "True") {
                        value.hidden = true;
                    }
                    else {
                        value.hidden = false;
                    }
                }
            });

            //JDL is there a better way to do this? I don't want to do $("#ok") because it seemed to generic. I want to make sure I get the control in the kendoWindow.
            $.each(kendoWindow.element.find('a'), function (key, value) {

                if (value.id === "ok") {
                    if (options.readOnly === "True") {
                        value.hidden = true;
                    }   
                    else {
                        value.hidden = false;
                    }   
                }
            });

            //setTimeout(function () {  },500);
            //kendoWindow.pin(true);
            //bulkEdit.calculateSize();
            //loadData();
            //getData(loadData);
        }

        bulkEdit.refreshFromSource = function (args) {
            bulkEdit.getHandsonTableData();
            //loadData();
        }

        bulkEdit.saveChanges = function (bClose) {
            var data = handsontable.getData();
            var headers = handsontable.getColHeader();
            var hheaders = [headers];
            data = hheaders.concat(data);

            //pop the "spare" row off
            data.pop();
            $.ajax({
                url: buildUrl(),
                type: "PUT",
                data: { "data": JSON.stringify(data)  }
            }).done(function () {

                if (options.gridName) {
                    $('#' + options.gridName).data('kendoGrid').dataSource.read()
                }

                if (bClose) { // Apply and Close
                    kendoWindow.close();
                }
                else { // Apply
                    bulkEdit.getHandsonTableData().done(function () {                        
                        handsontable.render();
                    });
                    //var oldData = bulkEdit.qdata;
                    //getData(function (data) {
                    //    bulkEdit.renderGrid(oldData);
                    //    setTimeout(function () {
                    //        bulkEdit.renderinfo(data.info);
                    //        handsontable.render();
                    //    }, 30);
                    //});
                }
            });
        }

        bulkEdit.selectAll = function () {
            handsontable = $handsontable.handsontable('getInstance');
            handsontable.selection.selectAll();
            event.preventDefault();
        }

        bulkEdit.copy = function () {
            var handsOnTable = $handsontable.handsontable('getInstance');
            if (handsOnTable && handsOnTable.copyPaste) {
                handsOnTable.copyPaste.setCopyableText();
                var clipboardText = handsOnTable.copyPaste.copyPasteInstance.elTextarea.value;
                var copyElement = document.createElement('textarea');
                copyElement.textContent = clipboardText

                // Attach the element, select, and copy
                copyElement = document.body.appendChild(copyElement);
                copyElement.select();
                document.execCommand('copy');
                copyElement.remove();
            }
        }

        bulkEdit.cut = function () {
            var handsOnTable = $handsontable.handsontable('getInstance');
            if (handsOnTable && handsOnTable.copyPaste) {
                handsOnTable.copyPaste.triggerCut();
            }
        }

        bulkEdit.paste = function () {
            var handsOnTable = $handsontable.handsontable('getInstance');
            if (handsOnTable && handsOnTable.copyPaste) {
                handsOnTable.copyPaste.triggerPaste();
            }
        }

        bulkEdit.removeSelection = function (closing) {
            var handsOnTable = $handsontable.handsontable('getInstance');
            if (handsOnTable && handsOnTable.selection) {
                if (closing) {
                    handsOnTable.getSettings().outsideClickDeselects = true; //Note: To fix, SIR #163935 - Returning javascript error says that "security brake:Too much TRs. Please define heightfor your table..."
                }
                handsOnTable.deselectCell();
            }
        }

        bulkEdit.cancelChanges = function () {
            kendoWindow.close();
        }
    }(quorum.bulkEdit = quorum.bulkEdit || {}));
}(window.quorum = window.quorum || {}));
 
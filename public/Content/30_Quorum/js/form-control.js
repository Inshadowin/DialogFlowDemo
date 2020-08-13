/*jslint browser: true, nomen: true, white: true */
/*globals jQuery */
/* -- https://github.com/athaeryn/flyLabel.js/blob/master/src/main.js -- */

(function ($) {
    "use strict";

    function _findInput(el) {
        return $(el).find('[id]');
    }

    function _findLabel(el) {
        return $(el).find('label');
    }

    function _findSelect(el) {
        return $(el).find('select');
    }

    function _findCheckareaElements(el) {
        var retItems = $(el).find('input[type=radio]');
        if (retItems.length <= 0) {
            retItems = $(el).find('input[type=checkbox]');
        }
        return retItems;
    }

    $.fn.getKendoType = function (elem) {
        var dataRole = elem.attr("data-role") || elem.attr("role");
        var controlType = "";
        if (dataRole) {
            controlType = _findKendoType(dataRole);
        }
        return controlType;
    }

    function _findKendoType(dataRole) {
        var controlType = "";
        switch (dataRole) {
            case "datepicker":
                controlType = "kendoDatePicker";
                break;
            case "autocomplete":
                controlType = "kendoAutoComplete";
                break;
            case "numerictextbox":
                controlType = "kendoNumericTextBox";
                break;
            case "timepicker":
                controlType = "kendoTimePicker";
                break;
            case "datetimepicker":
                controlType = "kendoDateTimePicker";
                break;
            case "combobox":
                controlType = "kendoComboBox";
                break;
            case "listbox":
                controlType = "kendoAutoComplete";
                break;
            case "multiselect":
                controlType = "kendoMultiSelect";
                break;
            case "dropdownlist":
                controlType = "kendoDropDownList";
                break;
            case "grid":
                controlType = "kendoGrid";
                break;
            case "tabstrip":
                controlType = "kendoTabStrip";
                break;
            case "accordion":
                controlType = "qAccordion";
                break;
        } 
        return controlType;
    }

    var CheckAreaFlyLabel = (function () {
        function _CheckAreaFlyLabel(el) {
            this.el = el;
            var resItems = _findCheckareaElements(el);
            this.elName = $(resItems[0]).attr("name");
            var that = this;
            that.input = null;
            that.input = this;
            $(this.input).data('checkareaFlyLabel', this);
        }
        _CheckAreaFlyLabel.prototype = {
            setError: function (listErr) {
                // Example of Passing parameter to this function: 
                // { "Errors": ["Required Field.","Required Field."],"Warnings":["xyz","xyz"],"Messages":["xyz","xyz"] }
                // Note: Keys Errors,Warnings,Messages are case sensitive.

                var ErrorHtml = '<i class="{classname}" data-container="body" data-html="true" data-toggle="popover" title="{title}" data-placement="right" data-content="{datacontent}">{content}</i>',
                    strSeparator = "<i>,</i>";
                var errorsCount = function () { if (listErr["critical"] != null) { return listErr["critical"].length; } },
                    warningsCount = function () { if (listErr["warning"] != null) { return listErr["warning"].length; } },
                    messagesCount = function () { if (listErr["info"] != null) { return listErr["info"].length } };
                //var errorsCount = 0; if(listErr["Errors"]!=null){ errorsCount = listErr["Errors"].length;
                //var y = xx(listErr, "Errors", "error", "Error List");
                //var y = xx(listErr, "Warnings", "error", "Error List");
                //var y = xx(listErr, "Messages", "error", "Error List");
                if (listErr.hasOwnProperty("critical") && errorsCount() > 0) {
                    this.setWrapperInvalid(true);
                    var Errors = listErr["critical"], strError = ErrorHtml, dataContent = "";

                    strError = strError.replace("{classname}", "error").replace("{content}", errorsCount() + " Errors").replace("{title}", "Error List");

                    $(Errors).each(function (i, errDesc) {
                        dataContent = dataContent + "<strong>" + (i + 1) + ". </strong>" + errDesc + "<br>";
                    });
                    dataContent = dataContent + "<a class='closepop'>Close</a>";
                    strError = strError.replace("{datacontent}", dataContent) + strSeparator;
                }
                if (listErr.hasOwnProperty("warning") && warningsCount() > 0) {
                    var Warnings = listErr["warning"], strWarning = ErrorHtml, dataContent = "";
                    strWarning = strWarning.replace("{classname}", "warning").replace("{content}", warningsCount() + " Warnings").replace("{title}", "Warnings");

                    $(Warnings).each(function (i, warningDesc) {
                        dataContent = dataContent + "<strong>" + (i + 1) + ". </strong>" + warningDesc + "<br>";
                    });
                    dataContent = dataContent + "<a class='closepop'>Close</a>";
                    strWarning = strWarning.replace("{datacontent}", dataContent) + strSeparator;
                }
                if (listErr.hasOwnProperty("info") && messagesCount() > 0) {
                    var Messages = listErr["info"], strMessage = ErrorHtml, dataContent = "";
                    strMessage = strMessage.replace("{classname}", "message").replace("{content}", messagesCount() + " Messages").replace("{title}", "Messages");

                    $(Messages).each(function (i, messageDesc) {
                        dataContent = dataContent + "<strong>" + (i + 1) + ". </strong>" + messageDesc + "<br>";
                    });
                    dataContent = dataContent + "<a class='closepop'>Close</a>";
                    strMessage = strMessage.replace("{datacontent}", dataContent);
                }
                var finalMessage = "";
                if (errorsCount() > 0) {
                    finalMessage += strError;
                }
                if (warningsCount() > 0) {
                    finalMessage += strWarning;
                }
                if (messagesCount() > 0) {
                    finalMessage += strMessage;
                }
                if (finalMessage.length > 0) {
                    $(this.el).find(".q-form-control-error").html(finalMessage.substring(0, finalMessage.lastIndexOf(strSeparator)));
                }
            },
            setWrapperInvalid: function (bShow) {
                if (bShow) { //(this.getValue() == "" && $(this.el).hasClass("required")) || 
                    $(this.el).addClass("invalid");
                }
                else {
                    $(this.el).removeClass("invalid");
                }
            },
            clearErrors: function () {
                $(this.el).find('.q-form-control-error').html('');
                this.setWrapperInvalid(false);
            },
            getDataRole: function () {
                var dataRole = $(this.input).attr('data-role') || $(this.input).attr('role');
                return dataRole;
            },
            getInput: function () {
                //console.log(this.input);
                return $(this.input);
            },
            setReadOnly: function (bReadOnly, iconClass) {
                //set default
                if (bReadOnly == null) bReadOnly = true;
                if (iconClass == null) iconClass = "";
                if (bReadOnly) {
                    $(this.el).addClass("readonly");
                    $(this.el).find(".k-radio").attr("disabled", "disabled");
                    $(this.el).find(".k-checkbox").attr("disabled", "disabled");
                }
                else {
                    $(this.el).removeClass("readonly");
                    $(this.el).find(".k-radio").removeAttr("disabled");
                    $(this.el).find(".k-checkbox").removeAttr("disabled");
                }

            },
            setRequired: function (isRequired) {
                if (isRequired == null) isRequired = true;
                if (isRequired) {
                    $(this.el).addClass("required");
                }
                else {
                    $(this.el).removeClass("required");
                }
            },
            setHidden: function (bHide) {
                if (bHide == null) bHide = true;
                if (bHide) {
                    var elId = $(this.input).attr("id");
                    if (elId && elId.length) {
                        var parentHolder = $(this.input).closest("[q-hideparent=" + elId + "]");
                        if (parentHolder.length == 1) {
                            parentHolder.hide();
                            return;
                        }
                    }
                    $(this.el).hide();
                }
                else {
                    var elId = $(this.input).attr("id");
                    if (elId && elId.length) {
                        var parentHolder = $(this.input).closest("[q-hideparent=" + elId + "]");
                        if (parentHolder.length == 1) {
                            parentHolder.show();
                            return;
                        }
                    }
                    $(this.el).show();
                }
            },
        };
        return _CheckAreaFlyLabel;
    }());

    var FlyLabel = (function () {
        function _FlyLabel(el) {
            var labelText;
            // Set things            
            this.el = el;
            this.label = _findLabel(this.el);
            labelText = this.label.text();

            var that = this;
            var resElem = _findInput(el); // $(el).find('input, textarea');
            that.input = null;
            $(resElem).each(function () {
                try {
                    if (this.tagName.toLowerCase().indexOf("button") >= 0)
                        return;
                    if ($(this).hasClass('k-button'))
                        return;
                    if (that.input) {
                        return;
                    }
                    that.input = this;
                    that.kendoType = that.getKendoType();

                    if (that.isReadOnly()) {
                        that.setReadOnly(true);
                    }
                    // To Fix, SIR #155522 - If no value is set on the combo box, the label will be displayed twice.
                    that._onKeyUp();
                    if (!that.isReadOnly()) that._bindEvents();
                    that.setPlaceholder(labelText);
                    
                }
                catch (err) { }
            });
            //need to test this
            $(this.input).data('flyLabel', this);
        }

        _FlyLabel.prototype = {
            _bindEvents: function () {
                try {
                    if (!this.bindEventsSet()) {
                        this.bindEventsSet(true);
                        if (this.getKendoType().toLowerCase().indexOf("kendo") >= 0) {
                            var that = this;
                            $(this.el).find('input').each(function () {
                                $(this).on('keyup change', $.proxy(that._onKeyUp, that));
                                $(this).on('blur', $.proxy(that._onBlur, that));
                            });
                            $(this.el).on('focusin', $.proxy(that._onFocus, that));

                        }
                        else {
                            $(this.input).on('keyup change', $.proxy(this._onKeyUp, this));
                            $(this.input).on('blur', $.proxy(this._onBlur, this));
                            $(this.el).on('focusin', $.proxy(this._onFocus, this));
                        }
                    }
                }
                catch (err) { console.log(err); }
            },
            _onKeyUp: function (ev) {
                try {
                    if (this.isReadOnly()) return;

                    if (this.isNullOrEmpty()) { // returns true when value is empty or null
                        $(this.label).removeClass('is-active');
                        $(this.input).removeClass('has-value');
                        $(this.el).removeClass('has-value');
                        $(this.input.previousSibling).removeClass('has-value');
                        if (this.getKendoType() == "kendoComboBox") {
                            $(this.input.previousSibling).attr('placeholder', '');
                        }
                        // $(this.input).attr('placeholder', this.getLabelText()); // IIIMPACT removed
                    } else {
                        $(this.label).addClass('is-active');
                        $(this.input).addClass('has-value');
                        $(this.el).addClass('has-value');
                        $(this.input.previousSibling).addClass('has-value');
                    }

                    if (ev) ev.preventDefault();
                }
                catch (err) { console.log(err); }
            },
            _onFocus: function (ev) {
                if (this.isReadOnly()) return;
                var kendoType = this.getKendoType();
                if (kendoType == "kendoAutoComplete" || kendoType == "kendoComboBox") {
                    $(this.input).attr('placeholder', 'Start Typing...');
                    $(this.input.previousSibling).find('input').attr('placeholder', 'Start Typing...');
                    $(this.el).addClass('label-show'); // IIIMPACT addition
                }
                /* IIIMPACT Addition start */
                else if (kendoType == "kendoNumericTextBox") {
                    $(this.input).attr('placeholder', '');
                    $(this.input.previousSibling).find('input').attr('placeholder', '');
                    $(this.el).addClass('label-show'); // IIIMPACT addition
                }
                /* End of IIIMPACT Addition */
                else if ($(this.input).hasClass("q-text") || $(this.input).is("textarea") || kendoType == "kendoDatePicker" || kendoType == "kendoDateTimePicker" || kendoType == "kendoTimePicker") {
                    $(this.input).attr('placeholder', '');
                    $(this.el).addClass('label-show'); // IIIMPACT addition
                }

                $(this.el).addClass('state-focussed');
                ev.preventDefault();
            },
            _onBlur: function (ev) {
                if (this.isReadOnly()) return;
                var kendoType = this.getKendoType();
                $(this.label).removeClass('has-focus');
                if (this.getKendoType() == "kendoAutoComplete" || this.getKendoType() == "kendoComboBox") {
                    $(this.input).attr('placeholder', this.getLabelText());
                    $(this.input.previousSibling).find('input').attr('placeholder', this.getLabelText());
                }
                else if ($(this.input).hasClass("q-text") || $(this.input).is("textarea") || kendoType == "kendoDatePicker" || kendoType == "kendoDateTimePicker" || kendoType == "kendoTimePicker") {
                    var lblText = this.getLabelText();
                    $(this.input).attr('placeholder', lblText);
                    $(this.el).removeClass('label-show'); // IIIMPACT addition
                    if ($(this.input).hasClass("q-text") && $(this.input).attr("data-qmask")) {
                        var maskValue = $(this.input).mask();
                        if (maskValue != null && maskValue != undefined && maskValue.length == 0) {
                            $(this.input).val("");
                        }
                    }
                }
                this._onKeyUp();
                $(this.el).removeClass('state-focussed');
                $(this.el).removeClass('label-show'); // IIIMPACT addition
                ev.preventDefault();
            },
            getLabel: function () {
                return $(this.label);
            },
            getDataRole: function () {
                var dataRole = $(this.input).attr('data-role') || $(this.input).attr('role');
                return dataRole;
            },
            getInput: function () {
                //console.log(this.input);
                return $(this.input);
            },
            getLabelText: function () {
                return $(this.label).text();
            },
            getValue: function () {
                var control, inputValue = "", kendoType = this.getKendoType();
                if (kendoType == "kendoComboBox") {
                    control = $(this.input).data(kendoType);
                    if (control) {
                        var controlVal = control.text();
                        if (controlVal) {
                            inputValue = controlVal;
                        }
                    }
                }
                    /*if (this.kendoType.toLowerCase().indexOf("kendo") >= 0) {
                        control = $(this.input).data(this.kendoType);
                        if (control) {
                            var controlVal = control.value();
                            if (this.kendoType == "kendoComboBox") controlVal = control.text();
                            if (controlVal) {
                                inputValue = controlVal;
                            }
                        }
                    }*/
                else {
                    control = $(this.input);
                    if (control) {
                        if (control.val()) {
                            inputValue = control.val()
                        }
                        else if ((this.input.type == "date" || this.input.type == "time") && control.attr('value')) {
                            //Note! not completely tested
                            inputValue = control.attr('value');
                        }
                    }
                }
                return inputValue;
            },
            getClass: function () {
                return $(this.input).attr('class');
            },
            getKendoType: function () {
                var dataRole = this.getDataRole(), controlType = "";
                if (dataRole) {
                    controlType = _findKendoType(dataRole);
                }

                return controlType;
            },
            isReadOnly: function () {
                return $(this.input).is('[readonly],[disabled]');
            },
            bindEventsSet: function (bindevntset) {
                if (bindevntset) {
                    $(this.el).attr("bindevntset", true);
                }
                return $(this.el).attr("bindevntset");
            },
            unSetClass: function (clsName) {
                $(this.el).find("input.q-form-control-input").removeClass(clsName);
            },
            setClass: function (clsName) {
                $(this.el).find("input.q-form-control-input").addClass(clsName);
            },
            setLabelText: function (lblText) {
                $(this.label).text(lblText);
            },
            setPlaceholder: function (labelText) {
                if (this.getKendoType().toLowerCase().indexOf("kendo") >= 0) {
                    $(this.el).find('input').attr('placeholder', labelText);
                }
                else {
                    $(this.input).attr('placeholder', labelText);
                }
            },
            setHidden: function (bHide) {
                if (bHide == null) bHide = true;
                if (bHide) {
                    var elId = $(this.input).attr("id");
                    if (elId && elId.length) {
                        var parentHolder = $(this.input).closest("[q-hideparent=" + elId + "]");
                        if (parentHolder.length == 1) {
                            parentHolder.hide();
                            return;
                        }
                    }
                    $(this.el).hide();
                }
                else {
                    var elId = $(this.input).attr("id");
                    if (elId && elId.length) {
                        var parentHolder = $(this.input).closest("[q-hideparent=" + elId + "]");
                        if (parentHolder.length == 1) {
                            parentHolder.show();
                            return;
                        }
                    }
                    $(this.el).show();
                }
            },
            setReadOnly: function (bReadOnly, iconClass) {
                //set default
                if (bReadOnly == null) bReadOnly = true;
                if (iconClass == null) iconClass = "";
                if (bReadOnly) {
                    $(this.el).addClass("readonly");
                    if (this.isNullOrEmpty()) { //Returns true when the value is null or empty
                        $(this.input).removeClass('has-value');
                        $(this.el).removeClass('has-value');
                        $(this.label).removeClass('is-active');
                        $(this.label).removeClass('label-show');
                        $(this.el).find(".k-input.q-form-control-input").attr("placeholder", this.getLabelText());
                    }
                    else {
                        $(this.input).addClass('has-value');
                        $(this.el).addClass('has-value');
                        $(this.label).addClass('is-active');
                        $(this.label).addClass('label-show');
                        $(this.el).find(".k-input.q-form-control-input").attr("placeholder", "");
                    }

                    $(this.el).find(".k-input.q-form-control-input").attr("disabled", "disabled");
                    $(this.el).find(".k-input.q-form-control-input").attr("aria-disabled", "true");                    

                    this.enableKendoElement(!bReadOnly);

                    // Check for pick buttons within the element
                    if ($(this.input).hasClass("singlepick") || $(this.input).hasClass("doublepick")) {
                        var buttons = this.el.find("button");
                        $.each(buttons, function (n, btn) {
                            if ($(btn).hasClass("picktracksstate")) {
                                $(btn).addClass('data-field-static');
                                $(btn).prop('disabled', true);
                            }
                        });
                    }
                }
                else {
                    $(this.el).removeClass("readonly");
                    if (this.isNullOrEmpty()) { //Returns true when the value is null or empty
                        $(this.input).removeClass('has-value');
                        $(this.el).removeClass('has-value');
                        $(this.label).removeClass('is-active');
                        $(this.label).removeClass('label-show');
                        $(this.el).find(".k-input.q-form-control-input").attr("placeholder", this.getLabelText());
                    }
                    else {
                        $(this.input).addClass('has-value');
                        $(this.el).addClass('has-value');
                        $(this.label).addClass('is-active');
                        $(this.label).addClass('label-show');
                        $(this.el).find(".k-input.q-form-control-input").attr("placeholder", "");
                    }
                    $(this.el).find(".k-input.q-form-control-input").removeAttr("disabled");
                    $(this.el).find(".k-input.q-form-control-input").attr("aria-disabled", "false");
                    $(this.el).find(".k-input.q-form-control-input").removeAttr('readonly');                   
                    this.enableKendoElement(!bReadOnly);

                    // Check for pick buttons within the element
                    if ($(this.input).hasClass("singlepick") || $(this.input).hasClass("doublepick")) {
                        var buttons = this.el.find("button");
                        $.each(buttons, function (n, btn) {
                            if ($(btn).hasClass("picktracksstate")) {
                                $(btn).removeClass('data-field-static');
                                $(btn).prop('disabled', false);
                            }
                        });
                    }
                }
            },
            setRequired: function (isRequired) {
                if (isRequired == null) isRequired = true;
                if (isRequired) {
                    $(this.el).addClass("required");
                }
                else {
                    $(this.el).removeClass("required");
                }
            },
            enableKendoElement: function (bReadOnly) {
                var dataRole = this.getDataRole(), controlType = "";
                if (dataRole) {
                    controlType = _findKendoType(dataRole);

                    if (this.getKendoType() == controlType) {
                        var kendoElement = $(this.el).find("[data-role=" + dataRole + "]").data(controlType);
                        if (kendoElement) kendoElement.enable(bReadOnly);
                    }
                }
            },
            setWrapperInvalid: function (bShow) {
                if (bShow) { //(this.getValue() == "" && $(this.el).hasClass("required")) || 
                    $(this.el).addClass("invalid");
                }
                else {
                    $(this.el).removeClass("invalid");
                }
            },
            /*var xx = function(messages, mType, className, title)
            {
                var msgCount = 0; if(listErr[mType]!=null){ msgCount = listErr[mType].length;
                
                var ErrorHtml='<i class="{classname}" data-container="body" data-html="true" data-toggle="popover" title="{title}" data-placement="right" data-content="{datacontent}">{content}</i>',
                    strSeparator="<i>,</i>";
                    var Errors=listErr[mType],strError=ErrorHtml,dataContent="";
                    
                    strError=strError.replace("{classname}",className).replace("{content}",msgCount+ " " +mType).replace("{title}", title);
                    
                    $(Errors).each(function( i, errDesc ){                                          
                        dataContent=dataContent+"<strong>"+(i+1)+".</strong>"+errDesc+"<br>";
                    });
                    dataContent=dataContent+"<a class='closepop'>Close</a>";
                    strError=strError.replace("{datacontent}",dataContent)+strSeparator;                    
            }*/

            setError: function (listErr) {
                // Example of Passing parameter to this function: 
                // { "Errors": ["Required Field.","Required Field."],"Warnings":["xyz","xyz"],"Messages":["xyz","xyz"] }
                // Note: Keys Errors,Warnings,Messages are case sensitive.

                var ErrorHtml = '<i class="{classname}" data-container="body" data-html="true" data-toggle="popover" title="{title}" data-placement="right" data-content="{datacontent}">{content}</i>',
                    strSeparator = "<i>,</i>";
                var errorsCount = function () { if (listErr["critical"] != null) { return listErr["critical"].length; } },
                    warningsCount = function () { if (listErr["warning"] != null) { return listErr["warning"].length; } },
                    messagesCount = function () { if (listErr["info"] != null) { return listErr["info"].length } };
                //var errorsCount = 0; if(listErr["Errors"]!=null){ errorsCount = listErr["Errors"].length;
                //var y = xx(listErr, "Errors", "error", "Error List");
                //var y = xx(listErr, "Warnings", "error", "Error List");
                //var y = xx(listErr, "Messages", "error", "Error List");
                if (listErr.hasOwnProperty("critical") && errorsCount() > 0) {
                    this.setWrapperInvalid(true);
                    var Errors = listErr["critical"], strError = ErrorHtml, dataContent = "";

                    strError = strError.replace("{classname}", "error").replace("{content}", errorsCount() + " Errors").replace("{title}", "Error List");

                    $(Errors).each(function (i, errDesc) {
                        dataContent = dataContent + "<strong>" + (i + 1) + ". </strong>" + errDesc + "<br>";
                    });
                    dataContent = dataContent + "<a class='closepop'>Close</a>";
                    strError = strError.replace("{datacontent}", dataContent) + strSeparator;
                }
                if (listErr.hasOwnProperty("warning") && warningsCount() > 0) {
                    var Warnings = listErr["warning"], strWarning = ErrorHtml, dataContent = "";
                    strWarning = strWarning.replace("{classname}", "warning").replace("{content}", warningsCount() + " Warnings").replace("{title}", "Warnings");

                    $(Warnings).each(function (i, warningDesc) {
                        dataContent = dataContent + "<strong>" + (i + 1) + ". </strong>" + warningDesc + "<br>";
                    });
                    dataContent = dataContent + "<a class='closepop'>Close</a>";
                    strWarning = strWarning.replace("{datacontent}", dataContent) + strSeparator;
                }
                if (listErr.hasOwnProperty("info") && messagesCount() > 0) {
                    var Messages = listErr["info"], strMessage = ErrorHtml, dataContent = "";
                    strMessage = strMessage.replace("{classname}", "message").replace("{content}", messagesCount() + " Messages").replace("{title}", "Messages");

                    $(Messages).each(function (i, messageDesc) {
                        dataContent = dataContent + "<strong>" + (i + 1) + ". </strong>" + messageDesc + "<br>";
                    });
                    dataContent = dataContent + "<a class='closepop'>Close</a>";
                    strMessage = strMessage.replace("{datacontent}", dataContent);
                }
                var finalMessage = "";
                if (errorsCount() > 0) {
                    finalMessage += strError;
                }
                if (warningsCount() > 0) {
                    finalMessage += strWarning;
                }
                if (messagesCount() > 0) {
                    finalMessage += strMessage;
                }
                if (finalMessage.length > 0) {
                    $(this.el).find(".q-form-control-error").html(finalMessage.substring(0, finalMessage.lastIndexOf(strSeparator)));
                }
            },
            clearErrors: function () {
                $(this.el).find('.q-form-control-error').html('');
                this.setWrapperInvalid(false);
            },
            isNullOrEmpty: function () {
                var dataVal = this.getValue(), bFlag = true;
                if (dataVal && dataVal.toString().length > 0) {
                    bFlag = false;
                }
                return bFlag;
            }
        };
        return _FlyLabel;
    }());

    $.fn.flyLabels = function () {
        this.find('.q-form-control-wrapper').each(function () {
            return new FlyLabel(this);
        });
    };

    $.fn.getFlyLabel = function (option) { // Here Option= checkarea for checkboxes & Radio Buttons, Otherwise empty.
        var obj;
        if (option == "checkarea") {
            //get current object if availabel
            obj = this.data('checkareaFlyLabel');
            if (obj == undefined || Object.keys(obj).length <= 0) {
                var div = this.closest('.q-form-checkarea-wrapper'); //or .closest('.flygroup');
                if (div.length > 0) {
                    //NOTE! todo - avoid using NEW and find existing object or keep them in js memory?? 
                    obj = new CheckAreaFlyLabel(div);
                    //set current object to key value
                    this.data('checkareaFlyLabel', obj);
                }
            }

        } else {
            //get current object if availabel
            obj = this.data('flyLabel');
            if (obj == undefined) {
                var span = this.closest('.q-form-control-wrapper'); //or .closest('.flygroup');
                if (span.length > 0) {
                    //NOTE! todo - avoid using NEW and find existing object or keep them in js memory?? 
                    obj = new FlyLabel(span);
                    //set current object to key value
                    this.data('flyLabel', obj);
                }
            }
        }

        return obj;
    }

}(window.jQuery || window.$));

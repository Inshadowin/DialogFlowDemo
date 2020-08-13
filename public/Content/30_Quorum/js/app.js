
  'use strict';



/* Misc items to load on document ready */

    jQuery(document).ready(function () {
     /*   jQuery(".numeric").kendoNumericTextBox();
        jQuery(".datepicker").kendoDatePicker();
        jQuery(".timepicker").kendoTimePicker();
        jQuery(".datetimepicker").kendoDateTimePicker();
        jQuery(".autocomplete").kendoAutoComplete({
            dataSource: {
                data: ["Test", "Test1", "Test2", "Test3", "Test4", "Test5"]
            }
        });
        jQuery(".combobox").kendoComboBox({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: [
                { text: "text1", value: "v1" },
                { text: "text2", value: "v2" },
                { text: "text3", value: "v3" }
            ]
        });
		 */
		// Addition April 13 2015 by IIIMPACT for date range form control
		 function startChange() {
                        var startDate = start.value(),
                        endDate = end.value();

                        if (startDate) {
                            startDate = new Date(startDate);
                            startDate.setDate(startDate.getDate());
                            end.min(startDate);
                        } else if (endDate) {
                            start.max(new Date(endDate));
                        } else {
                            endDate = new Date();
                            start.max(endDate);
                            end.min(endDate);
                        }
                    }

                    function endChange() {
                        var endDate = end.value(),
                        startDate = start.value();

                        if (endDate) {
                            endDate = new Date(endDate);
                            endDate.setDate(endDate.getDate());
                            start.max(endDate);
                        } else if (startDate) {
                            end.min(new Date(startDate));
                        } else {
                            endDate = new Date();
                            start.max(endDate);
                            end.min(endDate);
                        }
                    }

                    var start = jQuery("#start").kendoDatePicker({
                        change: startChange
                    }).data("kendoDatePicker");

                    var end = jQuery("#end").kendoDatePicker({
                        change: endChange
                    }).data("kendoDatePicker");

                    start.max(end.value());
                    end.min(start.value());
					
					jQuery( "#effectivedate" ).click(function() {
						var $this = $("#enddateholder");
  						if ($this.hasClass("endhidden")) {
							//$this.fadeIn( "slow" );
							$this.removeClass("endhidden");
							end.min(start.value());
							$(this).removeClass("sprite-small_Closed");
							$(this).addClass("sprite-small_Open");
							$(this).attr("data-original-title", "Open Ended");
							
						} else {
          					$this.removeClass("endshow");
							$this.addClass("endhidden");
							$(this).removeClass("sprite-small_Open");
							$(this).addClass("sprite-small_Closed");
							$(this).attr("data-original-title", "Specify End");
		
					}
					
					});
		
		/* Initiate Bootstrap Tooltips, Popovers and Lightboxes */
		$(function () {
  			$('[data-toggle="tooltip"]').tooltip();
			$('[data-toggle="popover"]').popover()
		});
		
		// Function to add functionality to any close link in a popover
		$('body').on('click', '.popover .closepop', function () {
    		$('.popover').popover('hide');
		});
		
		
        
		/*jQuery("#dropdown-menu select").dropdown(); // Add custom drop down functionality for action bar - in later release*/
		 jQuery("#focusfirst").focus(); //Apply the focus to the most important field on the page
    });




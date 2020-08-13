var subway = {
    // The data in this "data" object is for testing purposes only.
    data: [{AllocGrpNo:'c22380b2-abe3-4b3c-bb94-8d42d547cc5c',AllocGrpNm:'Blue point 1572895 - connection 1',AllocTmTypeCode:'ps2',PrimSeqNo:0,SubSeqNo:0},{AllocGrpNo:'7fac8407-c773-4238-8323-bed97cbaa2f5',AllocGrpNm:'Blue point 1572895 - connection 2',AllocTmTypeCode:'ax4',PrimSeqNo:0,SubSeqNo:0},{AllocGrpNo:'70d49218-033f-41f5-9ceb-7f42089a8244',AllocGrpNm:'Blue point 1572895 - connection 3',AllocTmTypeCode:'auw',PrimSeqNo:0,SubSeqNo:0},{AllocGrpNo:'e4af86d0-f703-4176-bfd0-0632236c410c',AllocGrpNm:'joystick',AllocTmTypeCode:'fhz',PrimSeqNo:0,SubSeqNo:0},{AllocGrpNo:'592353e1-b87c-4482-bd2d-5216e310aac6',AllocGrpNm:'graduate',AllocTmTypeCode:'vis',PrimSeqNo:0,SubSeqNo:0},{AllocGrpNo:'c3047c83-d653-4a24-808a-3d9fb60aa901',AllocGrpNm:'creation',AllocTmTypeCode:'vb9',PrimSeqNo:0,SubSeqNo:0},{AllocGrpNo:'867e163e-f8d4-4031-be05-16660a828b0f',AllocGrpNm:'predator',AllocTmTypeCode:'05a',PrimSeqNo:0,SubSeqNo:0},{AllocGrpNo:'503f8e76-ab00-4a70-9076-88159588591c',AllocGrpNm:'consumer',AllocTmTypeCode:'0im',PrimSeqNo:0,SubSeqNo:0},{AllocGrpNo:'48d57862-e569-4c97-9dcb-bd98f9c088d6',AllocGrpNm:'autonomy',AllocTmTypeCode:'1pu',PrimSeqNo:0,SubSeqNo:0},{AllocGrpNo:'0386bc4f-494b-4abc-9481-f6e5e9472fee',AllocGrpNm:'security',AllocTmTypeCode:'51a',PrimSeqNo:0,SubSeqNo:0},{AllocGrpNo:'ae0694e5-6aa9-4611-b859-36e528e5dd11',AllocGrpNm:'survivor',AllocTmTypeCode:'yc5',PrimSeqNo:0,SubSeqNo:0},{AllocGrpNo:'fbc9f383-182c-472a-bcc5-6d8ad710f138',AllocGrpNm:'cylinder',AllocTmTypeCode:'p60',PrimSeqNo:0,SubSeqNo:0},{AllocGrpNo:'37226114-c75e-4a19-aac4-94fc15a85c4d',AllocGrpNm:'unlawful',AllocTmTypeCode:'uhx',PrimSeqNo:0,SubSeqNo:0},{AllocGrpNo:'8ff0639d-47a5-4fd7-b409-a0ef094dcc0b',AllocGrpNm:'gradient',AllocTmTypeCode:'mjv',PrimSeqNo:0,SubSeqNo:0},{AllocGrpNo:'bc8c2c4a-804c-428b-beea-7bd7935880fd',AllocGrpNm:'rhetoric',AllocTmTypeCode:'nkf',PrimSeqNo:0,SubSeqNo:0},{AllocGrpNo:'6614e837-b130-4b64-97c9-b6422f4d809e',AllocGrpNm:'indirect',AllocTmTypeCode:'au4',PrimSeqNo:0,SubSeqNo:0},{AllocGrpNo:'a86e6118-1964-413e-aaf8-236f7e7f5fb8',AllocGrpNm:'courtesy',AllocTmTypeCode:'tpz',PrimSeqNo:0,SubSeqNo:0},{AllocGrpNo:'b465b638-44aa-4376-8066-b8994c12e3a2',AllocGrpNm:'champion',AllocTmTypeCode:'x79',PrimSeqNo:0,SubSeqNo:0},{AllocGrpNo:'f30726fa-9cd0-4a15-b4fc-d57273c1cede',AllocGrpNm:'collapse',AllocTmTypeCode:'m19',PrimSeqNo:0,SubSeqNo:0},{AllocGrpNo:'b0bf5590-fac4-4054-a2a9-f74c4de619a1',AllocGrpNm:'standard',AllocTmTypeCode:'ayk',PrimSeqNo:0,SubSeqNo:0},{AllocGrpNo:'381e53c2-70b3-4827-ab57-00881b95d7c9',AllocGrpNm:'faithful',AllocTmTypeCode:'6b1',PrimSeqNo:0,SubSeqNo:0},{AllocGrpNo:'2c394c62-ca04-484d-80a9-05ff7696e280',AllocGrpNm:'discount',AllocTmTypeCode:'gkk',PrimSeqNo:0,SubSeqNo:0},{AllocGrpNo:'d61adf99-01f1-426b-afaf-df4a6f998352',AllocGrpNm:'ceremony',AllocTmTypeCode:'u1m',PrimSeqNo:0,SubSeqNo:0},{AllocGrpNo:'df4017af-560f-4305-9385-eaead7fa3e60',AllocGrpNm:'activate',AllocTmTypeCode:'7d9',PrimSeqNo:0,SubSeqNo:0},{AllocGrpNo:'cdbc742b-6cc0-4a2f-bd5e-aa20ccd5b55d',AllocGrpNm:'mosquito',AllocTmTypeCode:'gv5',PrimSeqNo:0,SubSeqNo:0}],
    points: [],
    activePoint: null,
    activePointIndex: 0,
    scrollPosition: 0,
    midpointLeftIndex: null,
    midpointRightIndex: null,
  
    init: function() {
      subway.generatePoints();
      subway.calculateMidPoints();
      subway.addCurrentDateToDOM();
      subway.handlePointClickEvents();
      subway.handleArrowClickEvents();
      subway.handleScrollToPointOnAccordionOpen();
  
      $(window).resize(function() {
        subway.calculateMidPoints();
        subway.scrollToActivePoint();
      });
    },
  
    /**
     * This may not be needed during .NET implementation. The current date
     * is in the accordion header in the designs. This method formats todays date
     * populates adds it to the DOM.
     */
    addCurrentDateToDOM: function() {
      $('.subway-date').text('As of: ' + new Date(Date.now()).toLocaleString().split(',')[0]);
    },
  
    /**
     * Iterates over our data and generates the "points" on the subway map. The
     * method then injects the points in the the DOM and sets the first point
     * to "active".
     */
    generatePoints: function() {
      for (var i = 0; i < subway.data.length; i++) {
        subway.points.push($('<a class="point"><span class="number">'+ (i + 1) +'</span><span class="label">' + subway.data[i].AllocGrpNm + '</span></a>')[0]);
      }
  
      subway.setNewActivePoint(subway.points[0]);
  
      $('#AccordionArea1').prepend('<div class="subway"></div>');
      $('#AccordionArea1 .subway').append(subway.points);
    },
  
    /**
     * Accepts a "point" (DOM element) as an argument. This method then sets that
     * point to "active", updates the name of the point at the top of the screen,
     * updates the page number and scrolls to that point.
     */
    setNewActivePoint: function(point) {
      if (subway.activePoint) {
        $(subway.activePoint).removeClass('active');
      }
  
      var pointLabel = $(point).find('.label').text();
      var previousPointIndex = subway.activePointIndex;
      subway.activePointIndex = subway.points.indexOf(point);
  
      $('.subway-name').empty().text(pointLabel);
      $('.subway-actions .page-numbers').text((subway.activePointIndex + 1) + ' of ' + subway.points.length);
  
      $(point).addClass('active');
      subway.activePoint = point;
      subway.scrollToActivePoint();
    },
  
    // Used for keeping the active point in the middle of the subway map.
    calculateMidPoints: function() {
      var pointWidth = $(subway.points[0]).innerWidth();
      var accordionWidth = $('.map-content').innerWidth();
      subway.midpointLeftIndex = Math.floor((accordionWidth / pointWidth) / 2);
      subway.midpointRightIndex = subway.points.length - (subway.midpointLeftIndex);
    },
  
    /**
     * Places the point stored in the global "subway.activePoint" in the center
     * of the subway map.
     */
    scrollToActivePoint: function() {
      var pointScrollWidth = (subway.activePointIndex * 110);
      var scrollAmount = pointScrollWidth - (subway.midpointLeftIndex * 110);
      $('.subway').animate({ scrollLeft: scrollAmount }, 110);
    },
  
    // Sets a new active point when clicking on a point on the subway map.
    handlePointClickEvents: function() {
      $('#AccordionArea1 .subway').on('click', '.point', function(e) {
        e.preventDefault();
  
        var clickedPoint = e.target;
  
        if (!$(clickedPoint).hasClass('point')) {
          clickedPoint = $(clickedPoint).closest('.point')[0];
        }
  
        if (!$(clickedPoint).hasClass('active')) {
          subway.setNewActivePoint(clickedPoint);
        }
      });
    },
  
    /**
     * Sets a new active point when clicking one of the arrows at the top
     * of the subway map.
     */
    handleArrowClickEvents: function() {
      $('.subway-actions').on('click', 'i', function(e) {
        var clickedArrow = $(e.target);
        var pointIndex = subway.points.indexOf(subway.activePoint);
  
        if (clickedArrow.hasClass('q-content_seek_left')) {
          return subway.setNewActivePoint(subway.points[0]);
        }
  
        if (clickedArrow.hasClass('q-content_arrow_left')) {
          if (pointIndex <= 0) return;
          return subway.setNewActivePoint(subway.points[pointIndex - 1]);
        }
  
        if (clickedArrow.hasClass('q-content_arrow_right')) {
          if (pointIndex + 1 >= subway.points.length) return;
          return subway.setNewActivePoint(subway.points[pointIndex + 1]);
        }
  
        if (clickedArrow.hasClass('q-content_seek_right')) {
          return subway.setNewActivePoint(subway.points[subway.points.length - 1]);
        }
      });
    },
  
    /**
     * When opening the accordion, this method will scroll the subway map to the
     * current active point.
     */
    handleScrollToPointOnAccordionOpen: function() {
      $('.accordion').on('click', function() {
        if (!$('.accordion').hasClass('collapsed')) return;
        subway.scrollToActivePoint();
      });
    }
  };
  
  subway.init();
  
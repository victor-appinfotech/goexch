(function($) {

	"use strict";

	var fullHeight = function() {

		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function(){
			$('.js-fullheight').css('height', $(window).height());
		});

	};
	fullHeight();

	$('#sidebarCollapse').on('click', function () {
	  $('#sidebar').toggleClass('active');
	  $('#sidebarCollapse').toggleClass('active');
	  //$('.fa-chevron-right').addClass('un-active');
  });

  

//   $('#myTab').on('click', function (e) {
// 	$('#myClassicTabContentOrange').toggleClass('show-card')
// 	$('#tab1').show("fast").toggleClass('show');
// 	$(this).bind();
// 	})

// $('#myTab1').on('click', function (e) {
// 	$('#myClassicTabContentOrange').toggleClass('show-card')
// 	$('#tab2').show("fast").toggleClass('show');
// 	$(this).bind();
// 	})

// $('#myTab2').on('click', function (e) {
// 	$('#myClassicTabContentOrange').toggleClass('show-card')
// 	$('#tab3').show("fast").toggleClass('show');
// 	$(this).bind();
// 	})


	//$('#myTab').tab('show') // Select tab by name
	//$('#myTab1').tab('show') // Select first tab
	//$('#myTab2').tab('show') // Select last tab
	//$('#myTab3').tab('show') // Select third tab
	



jQuery(document).ready(function($){
	var deviceAgent = navigator.userAgent.toLowerCase();
	var agentID = deviceAgent.match(/(iphone|ipod|ipad)/);
	if (agentID) {

        // mobile code here
		$('#leftSidebarCollapse').on('click', function () {
			$('#left-side-nav').toggleClass('active');
			$('#leftSidebarCollapse').toggleClass('active');
			//$('.fa-chevron-right').addClass('un-active');
		});
	}
});
  

})(jQuery);

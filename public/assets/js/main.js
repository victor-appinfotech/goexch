var tok = document.querySelector('meta[name="pass"]').getAttribute('content');
// duration of scroll animation
var scrollDuration = 300;
// paddles
var leftPaddle = document.getElementsByClassName('left-paddle');
var rightPaddle = document.getElementsByClassName('right-paddle');
// get items dimensions
var itemsLength = $('.item').length;
var itemSize = $('.item').outerWidth(true);
// get some relevant size for the paddle triggering point
var paddleMargin = 20;

// get wrapper width
var getMenuWrapperSize = function () {
	return $('.menu-wrapper').outerWidth();
}
var menuWrapperSize = getMenuWrapperSize();
// the wrapper is responsive



(function ($) {

	"use strict";

	var fullHeight = function () {

		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function () {
			$('.js-fullheight').css('height', $(window).height());
		});

	};
	fullHeight();

	$('#sidebarCollapse').on('click', function () {
		$('#sidebar').toggleClass('active');
		$('#sidebarCollapse').toggleClass('active');
		//$('.fa-chevron-right').addClass('un-active');
	});

	$('.dropdown-menu a').click(function () {
		$('#selected').html($(this).html());
	});

	$("#client-list").wrap("<div class='table-wrapper'></div>");

	//When page loads...
	$("ul.tabs li:first").show(); //Activate first tab

	//On Click Event
	$("ul.tabs li:first").click(function () {
		$("ul.tabs li").removeClass("active"); //Remove any "active" class
		$(this).addClass("active"); //Add "active" class to selected tab
		$(".tab_content:first").show("fast");
		$(".tab_content:nth-child(2)").hide("fast");
		var activeTab = $(this).find("a").attr("href"); //Find the href attribute value to identify the active tab + content
		$(activeTab).fadeIn(); //Fade in the active ID content
		return false;
	});

	$("ul.tabs li:nth-child(2)").click(function () {
		$(this).addClass("active"); //Add "active" class to selected tab
		$(".tab_content:nth-child(2)").show("fast");
		$(".tab_content:first").hide("fast");
		//$("ul.tabs li:first").hide();
		var activeTab = $(this).find("a").attr("href"); //Find the href attribute value to identify the active tab + content
		$(".tab_content:nth-child(2)").fadeIn(); //Fade in the active ID content
		return false;
	});

	// For footer Rating
	$('#rateMe1').mdbRate();

	$(window).on('resize', function () {
		menuWrapperSize = getMenuWrapperSize();
	});
	// size of the visible part of the menu is equal as the wrapper size 
	var menuVisibleSize = menuWrapperSize;

	// get total width of all menu items
	var getMenuSize = function () {
		return itemsLength * itemSize;
	};
	var menuSize = getMenuSize();
	// get how much of menu is invisible
	var menuInvisibleSize = menuSize - menuWrapperSize;

	// get how much have we scrolled to the left
	var getMenuPosition = function () {
		return $('.menu').scrollLeft();
	};

	// finally, what happens when we are actually scrolling the menu
	$('.menu').on('scroll', function () {

		// get how much of menu is invisible
		menuInvisibleSize = menuSize - menuWrapperSize;
		// get how much have we scrolled so far
		var menuPosition = getMenuPosition();

		var menuEndOffset = menuInvisibleSize - paddleMargin;

		// show & hide the paddles 
		// depending on scroll position
		if (menuPosition <= paddleMargin) {
			$(leftPaddle).addClass('hidden');
			$(rightPaddle).removeClass('hidden');
		} else if (menuPosition < menuEndOffset) {
			// show both paddles in the middle
			$(leftPaddle).removeClass('hidden');
			$(rightPaddle).removeClass('hidden');
		} else if (menuPosition >= menuEndOffset) {
			$(leftPaddle).removeClass('hidden');
			$(rightPaddle).addClass('hidden');
		}

		// print important values
		// $('#print-wrapper-size span').text(menuWrapperSize);
		// $('#print-menu-size span').text(menuSize);
		// $('#print-menu-invisible-size span').text(menuInvisibleSize);
		// $('#print-menu-position span').text(menuPosition);

	});

	// scroll to left
	$(rightPaddle).on('click', function () {
		$('.menu').animate({ scrollLeft: menuInvisibleSize }, scrollDuration);
	});

	// scroll to right
	$(leftPaddle).on('click', function () {
		$('.menu').animate({ scrollLeft: '0' }, scrollDuration);
	});

	jQuery(document).ready(function ($) {
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
/*-----------------------------------------------------------------------------------*/
/* 		Mian Js Start 
/*-----------------------------------------------------------------------------------*/
$(document).ready(function($) {
"use strict"
/*-----------------------------------------------------------------------------------*/
/* 		CLIENTS LOGO SLIDE
/*-----------------------------------------------------------------------------------*/
if ($.fn.owlCarousel && $(".services-slide").length) {
	$(".services-slide").owlCarousel({
		autoplay:true,
		autoplayHoverPause:true,
		singleItem	: true,
		navText: ["<i class='ion-ios-arrow-thin-left'></i>","<i class='ion-ios-arrow-thin-right'></i>"],
		lazyLoad:true,
		nav: true,
		loop:true,
		margin:30,
		responsive:{
			0:{
				items:1
			},
			600:{
				items:2
			},
			1200:{
				items:3
			}
		}
	});
}
/*-----------------------------------------------------------------------------------
    TESTI SLIDERS
/*-----------------------------------------------------------------------------------*/
if ($.fn.owlCarousel && $(".testi-slides").length) {
	$(".testi-slides").owlCarousel({
		items : 1,
		autoplay:true,
		autoplayHoverPause:true,
		singleItem	: true,
		navText: ["<i class='ion-ios-arrow-thin-left'></i>","<i class='ion-ios-arrow-thin-right'></i>"],
		lazyLoad:true,
		nav: true,
		loop:true,
		animateOut: 'fadeOut'
	});
}
/*-----------------------------------------------------------------------------------
    Animated progress bars
/*-----------------------------------------------------------------------------------*/
if ($.fn.waypoint && $('.progress-bars').length) {
	$('.progress-bars').waypoint(function() {
		$('.progress').each(function() {
			$(this).find('.progress-bar').animate({
				width: $(this).attr('data-percent')
			}, 500);
		});
	}, {
		offset: '100%',
		triggerOnce: true
	});
}
/*-----------------------------------------------------------------------------------*/
/*	ISOTOPE PORTFOLIO
/*-----------------------------------------------------------------------------------*/
var $container = $('.port-wrap .items');
if ($container.length && $.fn.imagesLoaded && $.fn.isotope) {
	$container.imagesLoaded(function() {
		$container.isotope({
			itemSelector: '.item',
			layoutMode: 'masonry'
		});
	});

	$('.filter li a').on('click', function() {
		$('.filter li a').removeClass('active');
		$(this).addClass('active');
		var selector = $(this).attr('data-filter');
		$container.isotope({
			filter: selector
		});
		return false;
	});
}
/*-----------------------------------------------------------------------------------*/
/*  SLIDER REVOLUTION
/*-----------------------------------------------------------------------------------*/
if ($('.tp-banner').length && $.fn.revolution) {
	jQuery('.tp-banner').show().revolution({
		dottedOverlay:"none",
		spinner:"off",
		lazyLoad:"on",
		lazyType:"single",
		delay:10000,
		startwidth:1170,
		startheight:825,
		navigationType:"bullet",
		navigationArrows:"solo",
		navigationStyle:"preview4",
		parallax:"mouse",
		parallaxBgFreeze:"on",
		parallaxLevels:[7,4,3,2,5,4,3,2,1,0],
		keyboardNavigation:"on",
		shadow:0,
		fullWidth:"on",
		fullScreen:"off",
		shuffle:"off",
		autoHeight:"off",
		forceFullWidth:"off",
		fullScreenOffsetContainer:""
	});
	if (document.documentElement && document.documentElement.classList) {
		document.documentElement.classList.add("rev-ready");
	}
}
});
/*-----------------------------------------------------------------------------------*/
/*    CONTACT FORM
/*-----------------------------------------------------------------------------------*/
function checkmail(input){
  var pattern1=/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	if(pattern1.test(input)){ return true; }else{ return false; }}

// eslint-disable-next-line no-unused-vars
function proceed(){
	var name = document.getElementById("name");
	var email = document.getElementById("email");
	var subject = document.getElementById("subject");
	var msg = document.getElementById("message");
	var $form = $("#contact_form");
	var isEnglish = (document.documentElement.lang || "").toLowerCase().startsWith("en");

	name.className = name.className.replace(" error", "");
	email.className = email.className.replace(" error", "");
	subject.className = subject.className.replace(" error", "");
	msg.className = msg.className.replace(" error", "");

	if(name.value == ""){
		name.className += " error";
		return false;
	}
	else if(email.value == ""){
		email.className += " error";
		return false;
	}
	else if(checkmail(email.value)==false){
		alert(isEnglish ? "Please provide a valid email address." : "Por favor, provee una dirección de correo electrónico válida.");
		return false;
	}
	else if(subject.value == ""){
		subject.className += " error";
		return false;
	}
	else if(msg.value == ""){
		msg.className += " error";
		return false;
	}
	else {
		$.ajax({
			type: "POST",
			url: "/",
				data: $form.serialize(),
				success: function() {
					alert(isEnglish ? "Thank you :) Your message was sent successfully." : "Gracias :) Este mensaje fue enviado con éxito.");
					$form.trigger("reset");
					return true;
				},
				error: function() {
					alert(isEnglish ? "There was an error. Please try again." : "Ha habido un error. Por favor, inténtalo de nuevo.");
					return false;
				}
			});
	}
}

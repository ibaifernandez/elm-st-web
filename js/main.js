/*-----------------------------------------------------------------------------------*/
/* 		Mian Js Start 
/*-----------------------------------------------------------------------------------*/
var elmstRuntimeConfig = {
	checked: false,
	requested: false,
	turnstileSiteKey: "",
	sentryDsn: "",
	sentryEnvironment: "production",
	sentryRelease: ""
};

var elmstFormSecurity = {
	turnstileEnabled: false,
	turnstileSiteKey: "",
	turnstileWidgetId: null,
	turnstileToken: "",
	turnstileReady: false,
	pendingSubmit: null,
	submitting: false
};

var elmstObservability = {
	sentryBooted: false,
	sentryInitQueued: false
};

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

	initFloatingLanguageSwitcher();
	initSentryObservability();
	initContactFormSecurity();

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

function initFloatingLanguageSwitcher() {
	var sourceLink = document.querySelector("li.lang-switch a");
	if (!sourceLink || !document.body) {
		return;
	}

	var targetLang = (sourceLink.getAttribute("lang") || "").toLowerCase();
	if (targetLang !== "es" && targetLang !== "en") {
		return;
	}

	if (document.querySelector(".language-fab")) {
		document.body.classList.add("lang-switch-enhanced");
		return;
	}

	var linkHref = sourceLink.getAttribute("href");
	if (!linkHref) {
		return;
	}

	var label = sourceLink.getAttribute("aria-label") ||
		(targetLang === "en" ? "Switch language to English" : "Cambiar idioma a español");

	var container = document.createElement("div");
	container.className = "language-fab";

	var link = document.createElement("a");
	link.className = "language-fab-link";
	link.setAttribute("href", linkHref);
	link.setAttribute("title", label);
	link.setAttribute("aria-label", label);
	link.setAttribute("lang", targetLang);
	if (sourceLink.hasAttribute("hreflang")) {
		link.setAttribute("hreflang", sourceLink.getAttribute("hreflang"));
	}

	var flag = document.createElement("span");
	flag.className = "language-fab-flag";
	flag.setAttribute("aria-hidden", "true");
	flag.textContent = targetLang === "en" ? "🇬🇧" : "🇪🇸";

	var srLabel = document.createElement("span");
	srLabel.className = "sr-only";
	srLabel.textContent = label;

	link.appendChild(flag);
	link.appendChild(srLabel);
	container.appendChild(link);
	document.body.appendChild(container);
	document.body.classList.add("lang-switch-enhanced");
}

function sanitizeRuntimeString(value) {
	return typeof value === "string" ? value.trim() : "";
}

function loadRuntimeConfig(callback) {
	if (elmstRuntimeConfig.checked) {
		callback(elmstRuntimeConfig);
		return;
	}
	if (elmstRuntimeConfig.requested) {
		setTimeout(function() {
			loadRuntimeConfig(callback);
		}, 100);
		return;
	}

	elmstRuntimeConfig.requested = true;
	$.ajax({
		type: "GET",
		url: "/.netlify/functions/runtime-config",
		dataType: "json",
		timeout: 3000,
		success: function(response) {
			elmstRuntimeConfig.turnstileSiteKey = sanitizeRuntimeString(response && response.turnstileSiteKey);
			elmstRuntimeConfig.sentryDsn = sanitizeRuntimeString(response && response.sentryDsn);
			elmstRuntimeConfig.sentryEnvironment = sanitizeRuntimeString(response && response.sentryEnvironment) || "production";
			elmstRuntimeConfig.sentryRelease = sanitizeRuntimeString(response && response.sentryRelease);
		},
		complete: function() {
			elmstRuntimeConfig.checked = true;
			callback(elmstRuntimeConfig);
		}
	});
}

function loadContactRuntimeConfig(callback) {
	loadRuntimeConfig(function(runtimeConfig) {
		var siteKey = runtimeConfig.turnstileSiteKey;
		elmstFormSecurity.turnstileSiteKey = siteKey;
		elmstFormSecurity.turnstileEnabled = siteKey.length > 0;
		callback();
	});
}

function getSentryLoaderUrl(dsn) {
	var match = dsn.match(/^https?:\/\/([^@]+)@/i);
	if (!match || !match[1]) {
		return "";
	}
	var publicKey = match[1].split(":")[0].trim();
	if (!publicKey) {
		return "";
	}
	return "https://js.sentry-cdn.com/" + encodeURIComponent(publicKey) + ".min.js";
}

function loadSentryScript(scriptUrl, onLoaded) {
	if (window.Sentry && (typeof window.Sentry.init === "function" || typeof window.Sentry.onLoad === "function")) {
		onLoaded();
		return;
	}

	var existingScript = document.getElementById("sentry-browser-script");
	if (existingScript) {
		existingScript.addEventListener("load", onLoaded, { once: true });
		return;
	}

	var script = document.createElement("script");
	script.id = "sentry-browser-script";
	script.src = scriptUrl;
	script.async = true;
	script.defer = true;
	script.crossOrigin = "anonymous";
	script.onload = onLoaded;
	document.head.appendChild(script);
}

function bootSentry(runtimeConfig) {
	if (elmstObservability.sentryBooted || !window.Sentry || typeof window.Sentry.init !== "function") {
		return;
	}

	try {
		var sentryOptions = {
			dsn: runtimeConfig.sentryDsn,
			environment: runtimeConfig.sentryEnvironment || "production",
			sampleRate: 1,
			tracesSampleRate: 0,
			sendDefaultPii: false
		};

		if (runtimeConfig.sentryRelease) {
			sentryOptions.release = runtimeConfig.sentryRelease;
		}

		window.Sentry.init(sentryOptions);
		if (typeof window.Sentry.setTag === "function") {
			window.Sentry.setTag("site", "elmst");
			window.Sentry.setTag("locale", (document.documentElement.lang || "es").toLowerCase());
		}
		elmstObservability.sentryBooted = true;
	} catch (error) {
		elmstObservability.sentryBooted = false;
	}
}

function initSentryObservability() {
	if (elmstObservability.sentryBooted) {
		return;
	}

	loadRuntimeConfig(function(runtimeConfig) {
		if (!runtimeConfig.sentryDsn) {
			return;
		}

		var scriptUrl = getSentryLoaderUrl(runtimeConfig.sentryDsn);
		if (!scriptUrl) {
			return;
		}

			loadSentryScript(scriptUrl, function() {
				if (elmstObservability.sentryBooted || !window.Sentry) {
					return;
				}

				if (typeof window.Sentry.init === "function") {
					bootSentry(runtimeConfig);
					return;
				}

				if (typeof window.Sentry.onLoad !== "function" || elmstObservability.sentryInitQueued) {
					return;
				}

				elmstObservability.sentryInitQueued = true;
				window.Sentry.onLoad(function() {
					elmstObservability.sentryInitQueued = false;
					bootSentry(runtimeConfig);
				});
				if (typeof window.Sentry.forceLoad === "function") {
					window.Sentry.forceLoad();
				}
			});
		});
}

function loadTurnstileScript(onLoaded) {
	if (window.turnstile && typeof window.turnstile.render === "function") {
		onLoaded();
		return;
	}

	var existingScript = document.getElementById("turnstile-api-script");
	if (existingScript) {
		existingScript.addEventListener("load", onLoaded, { once: true });
		return;
	}

	var script = document.createElement("script");
	script.id = "turnstile-api-script";
	script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
	script.async = true;
	script.defer = true;
	script.onload = onLoaded;
	document.head.appendChild(script);
}

function ensureTurnstileTokenField($form) {
	var tokenField = $form.find("input[name='cf-turnstile-response']");
	if (!tokenField.length) {
		$form.append('<input type="hidden" name="cf-turnstile-response" value="">');
		tokenField = $form.find("input[name='cf-turnstile-response']");
	}
	return tokenField.get(0);
}

function resetTurnstileState($form) {
	elmstFormSecurity.turnstileToken = "";
	var tokenField = $form.find("input[name='cf-turnstile-response']").get(0);
	if (tokenField) {
		tokenField.value = "";
	}
	if (window.turnstile && elmstFormSecurity.turnstileWidgetId !== null) {
		window.turnstile.reset(elmstFormSecurity.turnstileWidgetId);
	}
}

function setupTurnstile($form) {
	if (elmstFormSecurity.turnstileReady || !window.turnstile || !elmstFormSecurity.turnstileSiteKey) {
		return;
	}

	var slot = document.createElement("div");
	slot.className = "turnstile-slot";
	slot.id = "turnstile-slot";
	slot.setAttribute("aria-hidden", "true");
	$form.append(slot);
	var tokenField = ensureTurnstileTokenField($form);

	try {
		elmstFormSecurity.turnstileWidgetId = window.turnstile.render("#turnstile-slot", {
			sitekey: elmstFormSecurity.turnstileSiteKey,
			size: "invisible",
			callback: function(token) {
				elmstFormSecurity.turnstileToken = token || "";
				tokenField.value = elmstFormSecurity.turnstileToken;
				if (typeof elmstFormSecurity.pendingSubmit === "function") {
					var pending = elmstFormSecurity.pendingSubmit;
					elmstFormSecurity.pendingSubmit = null;
					pending();
				}
			},
			"expired-callback": function() {
				resetTurnstileState($form);
			},
			"error-callback": function() {
				resetTurnstileState($form);
			}
		});
		elmstFormSecurity.turnstileReady = true;
	} catch (error) {
		elmstFormSecurity.turnstileEnabled = false;
	}
}

function initContactFormSecurity() {
	var $form = $("#contact_form");
	if (!$form.length) {
		return;
	}

	loadContactRuntimeConfig(function() {
		if (!elmstFormSecurity.turnstileEnabled) {
			return;
		}
		loadTurnstileScript(function() {
			setupTurnstile($form);
		});
	});
}

function submitContactForm($form, isEnglish) {
	if (elmstFormSecurity.submitting) {
		return;
	}
	elmstFormSecurity.submitting = true;

	var baseErrorMessage = isEnglish ? "There was an error. Please try again." : "Ha habido un error. Por favor, inténtalo de nuevo.";
	var locale = isEnglish ? "en" : "es";
	var payload = $form.serializeArray();
	payload.push({ name: "locale", value: locale });
	payload.push({ name: "sourcePath", value: window.location.pathname || "/" });

	$.ajax({
		type: "POST",
		url: "/.netlify/functions/submit-contact",
		data: $.param(payload),
		dataType: "json",
		timeout: 10000,
		success: function(response) {
			if (!response || response.success !== true) {
				alert(response && response.message ? response.message : baseErrorMessage);
				if (elmstFormSecurity.turnstileEnabled) {
					resetTurnstileState($form);
				}
				return false;
			}
			alert(isEnglish ? "Thank you :) Your message was sent successfully." : "Gracias :) Este mensaje fue enviado con éxito.");
			$form.trigger("reset");
			if (elmstFormSecurity.turnstileEnabled) {
				resetTurnstileState($form);
			}
			return true;
		},
		error: function(xhr) {
			var responseMessage = xhr && xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : "";
			alert(responseMessage || baseErrorMessage);
			if (elmstFormSecurity.turnstileEnabled) {
				resetTurnstileState($form);
			}
			return false;
		},
		complete: function() {
			elmstFormSecurity.submitting = false;
			elmstFormSecurity.pendingSubmit = null;
		}
	});
}

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

	if (elmstFormSecurity.submitting) {
		return false;
	}

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
	else if (!elmstFormSecurity.turnstileEnabled) {
		submitContactForm($form, isEnglish);
		return false;
	}
	else if (!elmstFormSecurity.turnstileReady || !window.turnstile || elmstFormSecurity.turnstileWidgetId === null) {
		alert(isEnglish ? "Security verification is loading. Please try again in a second." : "La verificación de seguridad se está cargando. Inténtalo de nuevo en un segundo.");
		return false;
	}
	else {
		if (elmstFormSecurity.turnstileToken) {
			submitContactForm($form, isEnglish);
			return false;
		}

		elmstFormSecurity.pendingSubmit = function() {
			submitContactForm($form, isEnglish);
		};
		window.turnstile.execute(elmstFormSecurity.turnstileWidgetId);
		return false;
	}
}

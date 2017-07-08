/*
 * Piwik tracking code. This code is provided by Piwik and loads the tracking
 * script into the page. The script is inlined into the output html.
 */

var _paq = _paq || [];
_paq.push(['setCookieDomain', '*.studierlangsam.de']);
_paq.push(['setDomains', ['*.studierlangsam.de', '*.studierlangsam.de']]);
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
(function() {
	var baseUrl = 'https://analytics.studierlangsam.de/';
	_paq.push(['setTrackerUrl', baseUrl + 'piwik.php']);
	_paq.push(['setSiteId', '3']);
	// heart beat timer: track user’s time spent on the site.
	_paq.push(['enableHeartBeatTimer', 10]);
	var scriptEl = document.createElement('script');
	scriptEl.type='text/javascript';
	scriptEl.async=true;
	scriptEl.defer=true;
	scriptEl.src= baseUrl + 'piwik.js';
	var firstExistingScriptEl = document.getElementsByTagName('script')[0];
	firstExistingScriptEl.parentNode.insertBefore(scriptEl, firstExistingScriptEl);
})();

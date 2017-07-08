/*
 * This script applies padding to headers. In order to imitate
 * the Impact font, the Coda font is scaled using CSS transform.
 * However, there is now CSS-way to make the headings scale
 * according to the transform (at least no way I would know of).
 * Because of that, the heading elements are scaled in JS.
 *
 * This script is inlined into the output html.
 */

(function() {

	/**
	 * Ansynchronously runs the provided function as soon as the DOM is ready.
	 *
	 * @param func
	 * 		The function to run as soon as the DOM is read.
	 */
	function onDOM(func) {
		if (document.readyState === 'complete') {
			setTimeout(func, 1);
		} else {
			document.addEventListener('DOMContentLoaded', func, false);
		}
	}

	onDOM(function() {
		var tagNames = ['h1', 'h2', 'h3'];
		for (var i = 0, li = tagNames.length; i < li; i++) {
			var tags = document.getElementsByTagName(tagNames[i]);
			for (var j = 0, lj = tags.length; j < lj; j++) {
				var el = tags[j];
				el.style.paddingTop = (0.5 * el.offsetHeight) + 'px';
			}
		}
	});
})();

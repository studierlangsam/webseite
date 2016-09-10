(function() {
	var tagNames = ['h1', 'h2', 'h3'];
	for (var i = 0, li = tagNames.length; i < li; i++) {
		var tags = document.getElementsByTagName(tagNames[i]);
		for (var j = 0, lj = tags.length; j < lj; j++) {
			var el = tags[j];
			el.style.paddingTop = (0.5 * el.offsetHeight) + 'px';
		}
	}
})();

// Find browsers
var isIE = /*@cc_on!@*/false || !!document.documentMode;
var isEdge = !isIE && !!window.StyleMedia;
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

// 1. Create HTML elements
// 1.1. Create the header, src - source of the icon
function createHeader(src) {
	return	'<div class="header">' +
				'<img class="header-logo" alt="logo-file" src="'+ src +'" />' +
				'<h1 class="header-text">This is my cool Header</h1>' +
			'</div>';
}
// 1.2. Create the paragraphs, nr - counter of the paragraphs
function createParagraph(nr) {
	return	'<div class="paragraph">' +
				'<button class="p-btn" onclick="addRandomText('+ nr +')">Add Text</button>' +
				'<div id="append-'+ nr +'" class="p-text">' +
					'<p>This is the first sentence.</p>'
				'</div>' +
			'</div>';
}

// 2. Create interactive function
// 2.1. Generate a random string which will be appended to the paragraphs
function getRandomString() {
	var myRandom = Math.floor(Math.random() * 26); // base random number (from 0 to 25)
	const strLength = myRandom + 10; // 10 <= strLength <= 35
	var randomString = String.fromCharCode(myRandom + 65); // append the capital letter (ASCII from 65 to 90)
	var spaceRate = 0; // propability of writing a space ' ' (ASCII 32)
	
	// create all remaining letters of the random string
	for (var i = 1; i <= strLength; i++) {
		myRandom = Math.random(); // [0; 1) - probability rate of spaces and a new letter
		var letter; // variable for the new letter
		// in order to prevent a long string without spaces probability is incremented each time
		// when a previous character is not a space
		if (randomString.charAt(i - 1) != ' ') spaceRate += 0.05;
		else spaceRate = 0; // RESET propability. Prevent to spaces in a row (0 < 0 - false)

		// propapility is OK and a space cannot be the last character (ASCII 32)
		if (myRandom < spaceRate && i != strLength) letter = 32;
		else letter = Math.floor(myRandom * 26) + 97; // small letter (ASCII from 97 to 122)

		// append the new letter to the string: a small letter or a space
		randomString += String.fromCharCode(letter);
	}

	return randomString;
}
// 2.2. Append the random string to the paragraph
function addRandomText(nr) {
	// append a new random string to the paragraph
	const target = document.querySelector('#append-'+ nr +' p');
	target.innerText += ' ' + getRandomString() + '.';

	// when the state is updated and rendered scroll to the end of the <p>
	var scrollBack; // scroll position before appending the new string
	if (isEdge) scrollBack = document.body.scrollTop;
	else scrollBack = document.documentElement.scrollTop;
	// scroll to the bottom of the paragraph when the new random string is appended
	target.scrollIntoView(false);

	var tempScrollPosition; // scroll position after appending the new string
	if (isEdge) tempScrollPosition = document.body.scrollTop;
	else tempScrollPosition = document.documentElement.scrollTop;

	// if the random-string paragraph is fully visible (scrolled to the top) - main window should be scrolled
	// to where it had been before the user clicked the button
	if (tempScrollPosition <= scrollBack) window.scrollTo(0, scrollBack);
	else {
		// scroll back - otherwise smooth scrolling is not performed from the user's scroll position
		// it is performed from where "target.scrollIntoView(false)" has stopped
		window.scrollTo(0, scrollBack);
		// start smooth scrolling
		var scrollingInterval = setInterval(function() { window.scrollBy(0, 1); }, 10);
		setTimeout(function() { clearInterval(scrollingInterval); }, 2450);
	}

	return;
}

// 3. Render the elements to the browser
document.getElementById('header').innerHTML = createHeader('logo.png');
for(var i = 1; i <= 4; i++)
	document.getElementById('p' + i).innerHTML = createParagraph(i);

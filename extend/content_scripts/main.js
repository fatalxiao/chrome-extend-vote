/**
 * Check whether the Anesthesia checkbox has been render. Do callback at once if rendered.
 * @param callback
 */
function checkAnesthesia(callback) {

	var intervalCkeckbox = setInterval(() => {

		if ($('#q1_5').length > 0) {

			clearInterval(intervalCkeckbox);

			const checkbox = $('#q1_5').parents('.ui-checkbox');
			if (!checkbox.hasClass('focuschoice')) {
				$('#q1_5').parents('.ui-checkbox').click();
			}
			callback && callback();

		}

	}, 1000 / 60);

}

/**
 * Bind verification code input event for convenience.
 * (1) enter -> submit
 * (2) esc -> refresh verification code image
 *
 * @param input
 */
function bindInputEvent(input) {

	input.keydown(event => {

		if (event.keyCode == 13) { // enter
			$('#ctlNext')[0].click();
		} else if (event.keyCode == 27) { // esc
			$('#divCaptcha img').click();
		}

	});

};

/**
 * Check whether the verification code input has been render.
 * Do click and focus and bind events at once if rendered.
 * (Because verification code image load when click the input.)
 */
function inputFocus() {

	var intervalInput = setInterval(() => {

		if ($('#yucinput').length > 0) {

			clearInterval(intervalInput);

			const yucinput = $('#yucinput');
			bindInputEvent(yucinput);
			$('body')[0].scrollTop = 9999999;
			yucinput.click();
			yucinput.focus();

		}

	}, 1000 / 60);

};

/**
 * clear cookies
 * @param callback
 */
function clearCookie(callback) {
	chrome.runtime.sendMessage({
		type: 'clearCookie',
		url: window.location.href
	}, response => response.success === true && callback && callback());
}

/**
 * vote url
 * @type {string}
 */
const VOTE_URL = 'http://tp.sojump.cn/m/6827838.aspx';

$(() => {

	chrome.runtime.sendMessage({
		type: 'isRunning'
	}, response => {
		if (response.isRunning === true) {

			if (window.location.href == VOTE_URL) { // vote page
				setTimeout(() => {
					checkAnesthesia(() => {
						inputFocus();
					});
				}, 100);
			} else { // vote success page ot others
				clearCookie(() => {
					window.location = VOTE_URL;
				});
			}

		}
	});

});
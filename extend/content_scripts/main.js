/**
 * 侦测麻醉科的checkbox是否已存在，一旦存在即勾选，并执行回调
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
 * 绑定验证码输入框的事件，方便使用
 *  1、按回车提交
 *  2、按ESC刷新验证码图片
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
 * 侦测验证码输入框，一旦存在即click+focus(验证码图片默认不加载，点击输入框加载)，并绑定事件
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
 * 清空cookies
 * @param callback
 */
function clearCookie(callback) {
	chrome.runtime.sendMessage({
		type: 'clearCookie',
		url: window.location.href
	}, response => response.success === true && callback && callback());
}

/**
 * 投票页面地址
 * @type {string}
 */
const VOTE_URL = 'http://tp.sojump.cn/m/6827838.aspx';

$(() => {

	chrome.runtime.sendMessage({
		type: 'isRunning'
	}, response => {
		if (response.isRunning === true) {

			if (window.location.href == VOTE_URL) { // 投票页面
				setTimeout(() => {
					checkAnesthesia(() => {
						inputFocus();
					});
				}, 100);
			} else { // 投票成功页面或其他
				clearCookie(() => {
					window.location = VOTE_URL;
				});
			}

		}
	});

});
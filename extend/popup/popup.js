const BG = chrome.extension.getBackgroundPage();

document.addEventListener('DOMContentLoaded', () => {

	const el = $('#start');

	if (BG.isRunning()) {
		el.html('停止');
	} else {
		el.html('启动');
	}

	el.click(function () {

		if (BG.isRunning()) {

			BG.stop();
			$(this).html('启动');

		} else {

			BG.start();
			$(this).html('停止');

			chrome.tabs.create({
				url: 'http://tp.sojump.cn/m/6827838.aspx'
			});

		}

	});

});
const BG = chrome.extension.getBackgroundPage();

document.addEventListener('DOMContentLoaded', () => {

	const el = $('#start');

	if (BG.isRunning()) {
		el.html('Stop');
	} else {
		el.html('Start');
	}

	el.click(function () {

		if (BG.isRunning()) {

			BG.stop();
			$(this).html('Start');

		} else {

			BG.start();
			$(this).html('Stop');

			chrome.tabs.create({
				url: 'http://tp.sojump.cn/m/6827838.aspx'
			});

		}

	});

});
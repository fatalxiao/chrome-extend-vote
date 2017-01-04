function start() {
	localStorageVote.set('true');
}

function stop() {
	localStorageVote.set('false');
}

var isRunning = function () {
	return localStorageVote.get() === 'true';
}

function deleteCookie(url, name, storeId) {
	chrome.cookies.remove({
		url,
		name,
		storeId
	});
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

	switch (request.type) {
		case 'isRunning':
			sendResponse({
				'isRunning': isRunning()
			});
			return;
		case 'clearCookie':
			chrome.cookies.getAll({
				url: request.url
			}, cookies => {
				try {
					cookies.forEach(item => {
						deleteCookie(request.url, item.name, item.storeId);
					});
					sendResponse({
						'success': true
					});
				} catch (e) {
					sendResponse({
						'success': false
					});
				}
			});
			return;
	}

});
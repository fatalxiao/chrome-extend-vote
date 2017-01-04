/**
 * 启动
 */
function start() {
	localStorageVote.set('true');
}

/**
 * 停止
 */
function stop() {
	localStorageVote.set('false');
}

/**
 * 是否正在运行
 * @returns {boolean}
 */
var isRunning = function () {
	return localStorageVote.get() === 'true';
}

/**
 * 删除cookie
 * @param url
 * @param name
 * @param store
 */
function deleteCookie(url, name, storeId) {
	chrome.cookies.remove({
		url,
		name,
		storeId
	});
}

/**
 * onMessage 处理
 */
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
let urls = [];
browser.pageAction.onClicked.addListener(function (tab) {
	//let host = getHost(tab.url);
});

browser.tabs.onUpdated.addListener((id, inf) => {
	if (inf.url && !inf.url.startsWith('moz-extension') && !inf.url.startsWith('about')) {
		let hasBmk = urls.indexOf(inf.url) > -1;
		//console.log(changeInfo.url);
		/*if (hasBmk) {
			browser.pageAction.setIcon({tabId: id, path: "icons/metro_tab.svg"});
			browser.pageAction.setTitle({tabId: id, title: "From Metro tab"});
		}*/
		browser.pageAction.setIcon({tabId: id, path: hasBmk ? "icons/added.svg" : "icons/add.svg"});
		browser.pageAction.setTitle({tabId: id, title: hasBmk ? "From Metro tab" : "Coming soon Add to Metro tab"});
		/*if (!hasBmk) {
			browser.pageAction.setPopup({tabId: id, popup: "popup.html"});
		}*/
		browser.pageAction.show(id);
	}
});

function loadBookmarkFolder() {
	let stor = browser.storage.local.get();
	return stor.then((setts) => {
		setts.arrayTilesId.forEach(function (val) {
			urls.push(setts[val].url);
		});
		//console.log(urls);
	});
}

document.addEventListener('DOMContentLoaded', loadBookmarkFolder);

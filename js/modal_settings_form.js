/** Created by IGurkin on 21.06.2017. */
injectedFormScript();

function injectedFormScript() {
	$id('rangeScaleValId').innerHTML = MetroStorage.getScale();
	$id('rangeScaleId').value = MetroStorage.getScale();
	addListeners('exportDatId', 'click', function () {
		browser.storage.local.get().then(function (itm) {
			let file = new File([JSON.stringify(itm, null, "\t")], "backup.json", {type: "text/plain;charset=utf-8"});
			saveAs(file);
		});
	});
	addListeners('resetBgId', 'click', function () {
		MetroStorage.setBackgroundImage(null);
		$id('backgroundContainerId').style.backgroundImage = 'url(img/background.jpg)';
	});
	addListeners('fileBgUploadId', 'change', function () {
		readFile(this, function (e) {
			MetroStorage.setBackgroundImage(e.target.result);
			$id('backgroundContainerId').style.backgroundImage = 'url(' + MetroStorage.getBackgroundImage() + ')';
		});
	});
	addListeners('rangeScaleId', 'input', function () {
		MetroStorage.setScale(this.value);
		$id('rangeScaleValId').innerHTML = this.value;
		$id('site-container').style.fontSize = this.value + '%';
	});
	addListeners('fileRestoreId', 'change', function () {
		readFile(this, function (e) {
			let dat = JSON.parse(e.target.result);
			browser.storage.local.clear();
			browser.storage.local.set(dat).then(function () {
				browser.tabs.reload();
			});
		}, true);
	});
}

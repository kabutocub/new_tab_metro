/** Created by IGurkin on 21.06.2017. */
injectedFormScript();

function injectedFormScript() {
	addListeners('exportDatId', 'click', function () {
		var encodedData = window.btoa(JSON.stringify(localStorage)); // encode a string
		this.href = 'data:application/octet-stream;charset=utf-8,' + encodedData;
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
	addListeners('fileRestoreId', 'change', function () {
		readFile(this, function (e) {
			var decodedData = JSON.parse(window.atob(e.target.result));
			var keys = Object.keys(decodedData);
			localStorage.clear();
			for (var i = 0; i < keys.length; i++) {
				localStorage[keys[i]] = decodedData[keys[i]];
			}
		}, true);
	});
}
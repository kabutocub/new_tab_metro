/**
 * Created by iv on 17.06.2017.
 */

injectedFormScript();

function injectedFormScript() {
	addListeners('addTitleId', 'keyup keypress blur change', function () {
		$id('titlePreviewId').innerHTML = this.value;
	});
	addListeners('btnImport', 'click', function () {
		$id('fileImport').click();
	});
	addListeners('tileBgId', 'change', function () {
		$id('colorPreviewId').style.backgroundColor = this.value;
	});
	addListeners('fileImport', 'change', function () {
		var file = this.files[0];
		if (file) {
			var fr = new FileReader();
			fr.onloadend = function () {
				$id('thumbnailPreviewId').style.backgroundImage = 'url(' + fr.result + ')';
			};
			fr.readAsDataURL(file);
		}
	});
	addListeners('tileSaveId', 'click', function () {
		if (!validateEditForm()) {
			return;
		}
		var tileId = $id('tileId');
		var replace = tileId.value.length > 0;
		var newBkmk = {
			id: replace ? tileId.value : generateId(),
			url: $id('addUrlId').value,
			color: $id('tileBgId').value,
			title: $id('addTitleId').value,
			icon: $id('thumbnailPreviewId').style.backgroundImage
		};
		MetroStorage.addOrUpdateTile(newBkmk);
		createTileHtml(newBkmk, replace);
		closeModal();
	});
	setTimeout(function () {
		var picker = new jscolor($id('tileBgId'), {
			"hash": true, "width": 250, "height": 150, "borderRadius": 2
		});
	}, 500);
}

function validateEditForm() {
	var validRez = true;
	var url = $id('addUrlId');
	if (isURL(url.value)) {
		url.classList.add("valid");
		url.classList.remove("error");
		validRez = validRez && true;
	} else {
		url.classList.add("error");
		validRez = validRez && false;
	}
	var title = $id('addTitleId');
	if (title.value.length > 0) {
		title.classList.add("valid");
		title.classList.remove("error");
		validRez = validRez && true;
	} else {
		title.classList.add("error");
		validRez = validRez && false;
	}
	return validRez;
}

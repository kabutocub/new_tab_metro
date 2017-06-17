document.addEventListener('DOMContentLoaded', loadBookmarkFolder);

function loadBookmarkFolder() {
	fillTiles();
	applySorting();
	//initEditor();
	initEditorBackground();
}

function createTileHtml(tile, replace) {
	var htm = '<a id="' + tile.id + '" href="' + tile.url + '" class="flex-item" data-id="' + tile.id + '">\r\n' +
		'<span class="tab-color" style="background-color: ' + tile.color + '"></span>' +
		'<span class="tab-thumbnail"></span>' +
		'<span class="tab-title">' + tile.title + '</span>\r\n' +
		'</a>';
	var item = $create(htm);
	if (tile.icon && tile.icon.length > 0) {
		item.find('.tab-thumbnail').css('background-image', tile.icon);
	}
	var container = $id('site-container');
	if (replace) {
		container.replaceChild(item, $id(tile.id));
	} else {
		container.appendChild(item);
	}
}

function fillTiles() {
	var arrayTilesId = MetroStorage.getArrayTilesId();
	console.log("tiles count: " + arrayTilesId.length);
	for (var i = 0; i < arrayTilesId.length; i++) {
		var id = arrayTilesId[i];
		var tile = MetroStorage.findTileById(id);
		if (tile) {
			createTileHtml(tile);
		}
	}
}

function applySorting() {
	var el = $id('site-container');
	Sortable.create(el, {
		animation: 100,
		onEnd: function (e) {// Element dragging ended
			if (e.oldIndex !== e.newIndex) {
				MetroStorage.moveTile(e.oldIndex, e.newIndex);
				console.log('moved: ' + e.oldIndex + ' to ' + e.newIndex);
			}
		}
	});
}

function deleteItemContextMenu(id) {
	console.log('delete id ' + id);
	MetroStorage.removeTileById(id);
	$('a[data-id=' + id + ']').remove();
}

function $id(id) {
	return document.getElementById(id);
}

function $create() {

}

function editItemContextMenu(id) {
	var tile = MetroStorage.findTileById(id);
	if (tile) {
		$id('tileId').value = tile.id;
		$id('addTitleId').value = tile.title;
		$id('tileBgId').value = tile.color;
		$id('addUrlId').value = tile.url; //).trigger('change');
		$id('thumbnailPreviewId').style.backgroundImage = tile.icon;
		$id('modalState').checked = true;
	}
}

function closeEditForm() {
	//$('#modalState').prop('checked', false).trigger('change');
}

function initEditorBackground() {
	var fileBack = $id('fileBkg');
	if (fileBack) {
		fileBack.addEventListener('change', function () {
			var file = this.files[0];
			if (file) {
				var reader = new FileReader();
				reader.onloadend = function () {
					var img = reader.result;
					$id('backgroundContainerId').style.backgroundImage = 'url(' + img + ')';
					MetroStorage.setBackgroundImage(img);
				};
				reader.readAsDataURL(file);
			}
		});
	}
	var image = MetroStorage.getBackgroundImage();
	$id('backgroundContainerId').style.backgroundImage = 'url(' + (image ? image : 'img/background.jpg') + ')';
}

function initEditor() {
	/*$('#modalState').on('change', function () {
	 if ($(this).prop('checked') === false) {
	 //$('#editTileFormId')[0].reset();
	 $('#thumbnailPreviewId').css('background-image', '');
	 }
	 });*/
	$('#addTitleId').on('keyup keypress blur change', function () {
		$('#titlePreviewId').val($(this).val());
	});

	$("#btnImport").click(function () {
		$("#fileImport").trigger("click");
	});

	$('#tileBgId').on('change', function () {
		$('#colorPreviewId').css('background-color', $(this).val());
	});

	$("#fileImport").unbind("change").on('change', function () {
		var file = this.files[0];
		if (file) {
			var reader = new FileReader();
			reader.onloadend = function () {
				$('#thumbnailPreviewId').css('background-image', 'url(' + reader.result + ')');
			};
			reader.readAsDataURL(file);
		}
	});

	$('#tileSaveId').on('click', function () {
		var $tileId = $('#tileId');
		var replace = $tileId.val().length > 0;
		var newBkmk = {
			id: replace ? $tileId.val() : generateId(),
			url: $('#addUrlId').val(),
			color: $('#tileBgId').val(),
			title: $('#addTitleId').val(),
			icon: $('#thumbnailPreviewId').css('background-image')
		};
		MetroStorage.addOrUpdateTile(newBkmk);
		createTileHtml(newBkmk, replace);
		closeEditForm();
	});
}

function generateId() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < 10; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
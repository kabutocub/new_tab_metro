function loadBookmarkFolder() {
	fillTiles();
	applySorting();
	initEditor();
	initEditorBackground();
}

document.addEventListener('DOMContentLoaded', loadBookmarkFolder);

function createTileHtml(tile, replace) {
	var htm = '<a href="' + tile.url + '" class="flex-item" data-id="' + tile.id + '">\r\n' +
		'<span class="tab-color" style="background-color: ' + tile.color + '"></span>' +
		'<span class="tab-thumbnail"></span>' +
		'<span class="tab-title">' + tile.title + '</span>\r\n' +
		'</a>';
	var item = $(htm);
	if (tile.icon && tile.icon.length > 0) {
		item.find('.tab-thumbnail').css('background-image', tile.icon);
	}
	if (replace) {
		$('a[data-id=' + tile.id + ']').replaceWith(item);
	} else {
		$('#site-container').append(item);
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
	var el = document.getElementById('site-container');
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

function editItemContextMenu(id) {
	var tile = MetroStorage.findTileById(id);
	if (tile) {
		$('#tileId').val(tile.id);
		$('#addTitleId').val(tile.title).trigger('change');
		$('#tileBgId').val(tile.color).trigger('change');
		$('#addUrlId').val(tile.url).trigger('change');
		$('#thumbnailPreviewId').css('background-image', tile.icon);
		$('#modal-2').prop('checked', true);
	}
}

function closeEditForm() {
	$('#modal-2').prop('checked', false).trigger('change');
}

function initEditorBackground() {
	$('#fileBkg').on('change', function () {
		var file = this.files[0];
		if (file) {
			var reader = new FileReader();
			reader.onloadend = function () {
				var img = reader.result;
				$('body').css('background-image', 'url(' + img + ')');
				MetroStorage.setBackgroundImage(img);
			};
			reader.readAsDataURL(file);
		}
	});
	var image = MetroStorage.getBackgroundImage();
	if (image) {
		$('#backgroundContainerId').css('background-image', 'url(' + image + ')');
	} else {
		$('#backgroundContainerId').css('background-image', 'url(img/background.jpg)');
	}
}

function initEditor() {
	$('#modal-2').on('change', function () {
		if ($(this).prop('checked') === false) {
			$('#editTileFormId')[0].reset();
			$('#thumbnailPreviewId').css('background-image', '');
		}
	});
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
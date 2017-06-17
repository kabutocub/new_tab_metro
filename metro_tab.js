document.addEventListener('DOMContentLoaded', loadBookmarkFolder);

function loadBookmarkFolder() {
	fillTiles();
	applySorting();
	//initEditor();
	initEditorBackground();
}

function createTileHtml(tile, replace) {
	var item = document.createElement('a');
	item.setAttribute("id", tile.id);
	item.setAttribute("href", tile.url);
	item.setAttribute('class', 'flex-item');
	item.setAttribute('data-id', tile.id);

	item.innerHTML = '<span class="tab-color" style="background-color: ' + tile.color + '"></span>' +
		'<span class="tab-thumbnail"></span>' +
		'<span class="tab-title">' + tile.title + '</span>';

	if (tile.icon && tile.icon.length > 0) {
		$class(item, 'tab-thumbnail').style.backgroundImage = tile.icon;
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
	$id(id).remove();
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
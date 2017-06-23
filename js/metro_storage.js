/** Created by IGurkin on 15.06.2017. */
MetroStorage = {
	_arrayTilesId: null,
	_backgroundImage: null,
	getArrayTilesId: function () {
		if (!this._arrayTilesId && localStorage.arrayTilesId) {
			this._arrayTilesId = JSON.parse(localStorage.arrayTilesId);
		}
		if (!this._arrayTilesId) {
			this._arrayTilesId = [];
		}
		return this._arrayTilesId;
	},
	setArrayTilesId: function (val) {
		if (val) {
			this._arrayTilesId = val;
			localStorage.arrayTilesId = JSON.stringify(val);
		}
	},
	addOrUpdateTile: function (tile) {
		if (tile && tile.id) {
			var tilesIds = this.getArrayTilesId();
			if (tilesIds.indexOf(tile.id) === -1) {
				tilesIds.push(tile.id);
				this.setArrayTilesId(tilesIds);
			}
			localStorage[tile.id] = JSON.stringify(tile);
		}
	},
	findTileById: function (id) {
		if (localStorage[id]) {
			return JSON.parse(localStorage[id]);
		}
		return null;
	},
	removeTileById: function (id) {
		var storage = localStorage[id];
		if (storage) {
			localStorage.removeItem(id);
		}
		var arrayTilesId = this.getArrayTilesId();
		arrayTilesId.splice(arrayTilesId.indexOf(id), 1);
		this.setArrayTilesId(arrayTilesId);
	},
	moveTile: function (oldIndex, newIndex) {
		var arrayTilesId = this.getArrayTilesId();
		if (newIndex >= arrayTilesId.length) {
			var k = newIndex - arrayTilesId.length;
			while ((k--) + 1) {
				arrayTilesId.push(undefined);
			}
		}
		arrayTilesId.splice(newIndex, 0, arrayTilesId.splice(oldIndex, 1)[0]);
		this.setArrayTilesId(arrayTilesId);
	},
	getBackgroundImage: function () {
		if (!this._backgroundImage && localStorage.backgroundImage) {
			this._backgroundImage = localStorage.backgroundImage;
		}
		return this._backgroundImage;
	},
	setBackgroundImage: function (value) {
		if (value) {
			this._backgroundImage = value;
			localStorage.backgroundImage = value;
		} else {
			localStorage.removeItem('backgroundImage');
		}
	}
};

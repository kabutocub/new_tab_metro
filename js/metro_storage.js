/** Created by IGurkin on 15.06.2017. */
MetroStorage = {
	_store: null,
	initStore: function () {
		//миграция хранилища
		if (localStorage.arrayTilesId) {
			console.log('migration');
			let arrIds = JSON.parse(localStorage.arrayTilesId);
			browser.storage.local.set({'arrayTilesId': arrIds});
			localStorage.removeItem('arrayTilesId');
			browser.storage.local.set({'scale': localStorage.scale});
			localStorage.removeItem('scale');
			browser.storage.local.set({'backgroundImage': localStorage.backgroundImage});
			localStorage.removeItem('backgroundImage');
			arrIds.forEach(function (val, idx, array) {
				browser.storage.local.set({[val]: JSON.parse(localStorage[val])});
				localStorage.removeItem(val);
			});
		}
		//инициализация
		if (this._store) {
			return Promise.resolve(this._store);
		}
		return browser.storage.local.get().then((itm) => {
			//console.log(itm);
			this._store = Object.assign({arrayTilesId: [], scale: 90}, itm);
		});
	},
	getArrayTilesId: function () {
		return this._store.arrayTilesId;
	},
	setArrayTilesId: function (val) {
		if (val) {
			this._store.arrayTilesId = val;
			browser.storage.local.set({'arrayTilesId': val});
		}
	},
	addOrUpdateTile: function (tile) {
		if (tile && tile.id) {
			let tilesIds = this.getArrayTilesId();
			if (tilesIds.indexOf(tile.id) === -1) {
				tilesIds.push(tile.id);
				this.setArrayTilesId(tilesIds);
			}
			browser.storage.local.set({[tile.id]: tile});
		}
	},
	findTileById: function (id) {
		return this._store[id];
	},
	removeTileById: function (id) {
		browser.storage.local.remove(id);
		let arrayTilesId = this.getArrayTilesId();
		arrayTilesId.splice(arrayTilesId.indexOf(id), 1);
		this.setArrayTilesId(arrayTilesId);
	},
	moveTile: function (oldIndex, newIndex) {
		let arrayTilesId = this.getArrayTilesId();
		if (newIndex >= arrayTilesId.length) {
			let k = newIndex - arrayTilesId.length;
			while ((k--) + 1) {
				arrayTilesId.push(undefined);
			}
		}
		arrayTilesId.splice(newIndex, 0, arrayTilesId.splice(oldIndex, 1)[0]);
		this.setArrayTilesId(arrayTilesId);
	},
	getBackgroundImage: function () {
		return this._store.backgroundImage;
	},
	setBackgroundImage: function (value) {
		if (value) {
			this._store.backgroundImage = value;
			browser.storage.local.set({'backgroundImage': value});
		} else {
			browser.storage.local.remove('backgroundImage');
		}
	},
	getScale: function () {
		return this._store.scale;
	},
	setScale: function (value) {
		this._store.scale = value;
		browser.storage.local.set({'scale': value});
	}
};

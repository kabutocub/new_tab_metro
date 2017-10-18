/** Created by iv on 17.06.2017 */

injectedFormScript();

function injectedFormScript() {
	addListeners('addTitleId', 'keyup keypress blur change', function () {
		$id('titlePreviewId').innerHTML = this.value;
	});
	addListeners('tileBgId', 'change', function () {
		$id('colorPreviewId').style.backgroundColor = this.value;
	});
	addListeners('fileImport', 'change', function () {
		readFile(this, function (e) {
			let img = new Image();
			img.addEventListener("load", function () {// здесь выполняет drawImage функцию
				let canv = $id('canvasPickerId');
				let context = canv.getContext('2d');
				context.clearRect(0, 0, canvas.width, canvas.height);
				context.drawImage(img, 0, 0, canv.width, canv.height);
			}, false);
			img.src = e.target.result;
		});
	});

	let canvas = $id('canvasPickerId');
	let style = window.getComputedStyle(canvas, null);
	let multiplier = canvas.width / parseInt(style.width, 10);

	addListeners('canvasPickerId', 'click', function (e) {
		let canv = $id('canvasPickerId');
		let x = Math.ceil(multiplier * e.layerX);
		let y = Math.ceil(multiplier * e.layerY);
		let dat = canv.getContext('2d').getImageData(x, y, 1, 1).data;
		let clEditor = $id('tileBgId');
		clEditor.value = rgbToHex(dat[0], dat[1], dat[2]);
		clEditor.dispatchEvent(new Event('change'));
		clEditor.style.backgroundColor = clEditor.value;
	});

	function rgbToHex(r, g, b) {
		return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
	}

	addListeners('tileSaveId', 'click', function () {
		if (!validateEditForm()) {
			return;
		}
		let tileId = $id('tileId');
		let replace = tileId.value.length > 0;
		let newBkmk = {
			id: replace ? tileId.value : generateId(),
			isDbl: $id('tileDblId').checked,
			url: $id('addUrlId').value,
			color: $id('tileBgId').value,
			title: $id('addTitleId').value,
			icon: $id('canvasPickerId').toDataURL()
		};
		MetroStorage.addOrUpdateTile(newBkmk);
		createTileHtml(newBkmk, replace);
		closeModal();
	});
	setTimeout(function () {
		let picker = new jscolor($id('tileBgId'), {
			"hash": true, "width": 250, "height": 150, "borderRadius": 2
		});
	}, 500);
}

function validateEditForm() {
	let validRez = true;
	let url = $id('addUrlId');
	if (isURL(url.value)) {
		url.classList.add("valid");
		url.classList.remove("error");
		validRez = validRez && true;
	} else {
		url.classList.add("error");
		validRez = validRez && false;
	}
	let title = $id('addTitleId');
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

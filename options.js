function initEditorBackground() {
	var file = this.files[0];
	if (file) {
		var reader = new FileReader();
		reader.onloadend = function () {
			$('body').css('background-image', 'url(' + reader.result + ')');
		};
		reader.readAsDataURL(file);
	}
}

function saveOptions(e) {
	e.preventDefault();
	browser.storage.local.set({
		color: document.querySelector("#color").value
	});
}

function restoreOptions() {

	function setCurrentChoice(result) {
		document.querySelector("#color").value = result.color || "blue";
	}

	function onError(error) {
		console.log('Error: ${error}');
	}

	var getting = browser.storage.local.get("color");
	getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById('fileBkg').addEventListener("change", saveOptions);
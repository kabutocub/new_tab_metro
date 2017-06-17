/** Created by IGurkin on 16.06.2017. */
document.addEventListener('DOMContentLoaded', applyModalLoader);

function applyModalLoader() {
	//loadModalByName('modal_edit_tile_form.html');
	document.getElementById('modalState').addEventListener('change', function () {
		if (this.checked) {
			loadModalByName('modal_edit_tile_form.html', function(textForm) {
				$('#modalFormId').append(textForm);
				//document.getElementById('modalFormId').innerHTML = textForm;
				setTimeout(injectedFormScript, 500);
				//injectedFormScript();
			});
		} else {
			document.getElementById('modalFormId').innerHTML = '';
		}
	});
}

function loadModalByName(name, onComplete) {
	var xhr = new XMLHttpRequest();
	xhr.open('get', name, true);
	xhr.onreadystatechange = function () {
		if (this.readyState !== 4 || this.status !== 200) {// or whatever error handling you want
			return;
		}
		onComplete(this.responseText);
	};
	xhr.send();
}

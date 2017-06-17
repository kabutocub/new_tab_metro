/** Created by IGurkin on 16.06.2017. */
document.addEventListener('DOMContentLoaded', applyModalLoader);

function applyModalLoader() {
	//loadModalByName('modal_edit_tile_form.html');
	$id('modalState').addEventListener('change', function () {
		document.getElementById('modalFormId').innerHTML = '';
		if (this.checked) {
			loadModalByName('modal_edit_tile_form.html', function (textForm) {
				$id('modalFormId').innerHTML = textForm;
				var $id2 = $id('modalRootId');
				if ($id2) {
					var scr = $id2.getAttribute('data-scripts');
					if (scr) {
						var array = scr.split(';');
						for (var i = 0; i < array.length; i++) {
							addScript(array[i]);
						}
					}
				}
			});
		}
	});
}

function addScript(name) {
	var oldScript = $id(name);
	if (oldScript) {
		oldScript.remove();
	}
	var script = document.createElement('script');
	script.id = name;
	script.type = 'text/javascript';
	script.src = name;
	document.head.appendChild(script);
}

function closeModal() {
	$id('modalState').checked = false;
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

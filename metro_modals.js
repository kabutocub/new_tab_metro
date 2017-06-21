/** Created by IGurkin on 16.06.2017. */
document.addEventListener('DOMContentLoaded', applyModalLoader);

function applyModalLoader() {
	var arr = $class2('modal-state');
	for (var i = 0; i < arr.length; i++) {
		addListeners(arr[i].id, 'change', function () {
			var cbx = this;
			var container = getContainer(cbx);
			if (cbx.checked) {
				loadModalByName(cbx.getAttribute('data-form'), function (textForm) {
					container.innerHTML = textForm.replace(/\${mds}/g, cbx.id);
					var array = cbx.getAttribute('data-scripts').split(';');
					for (var i = 0; i < array.length; i++) {
						addScript(array[i]);
					}
				});
			} else {
				var array = cbx.getAttribute('data-scripts').split(';');
				for (var i = 0; i < array.length; i++) {
					var script = $id(array[i]);
					if (script) {
						script.remove();
					}
				}
			}
		});
	}
}

function getContainer(cb) {
	var cont = $id('modalContainerId');
	if (cont) {
		cont.remove();
	}
	cont = document.createElement('div');
	cont.id = 'modalContainerId';
	cont.classList.add("modal");
	insertAfter(cont, cb);
	return cont;
}

function insertAfter(elem, refElem) {
	var parent = refElem.parentNode;
	var next = refElem.nextSibling;
	if (next) {
		return parent.insertBefore(elem, next);
	} else {
		return parent.appendChild(elem);
	}
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

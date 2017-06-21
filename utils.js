/** Created by iv on 17.06.2017. */
function $id(id) {
	return document.getElementById(id);
}

function $class(node, cls) {
	for (var i = 0; i < node.childNodes.length; i++) {
		if (node.childNodes[i].className === cls) {
			return node.childNodes[i];
		}
	}
	return null;
}

function $class2(cls) {
	return document.getElementsByClassName(cls);
}

function generateId() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < 10; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

function addListeners(id, listeners, func) {
	var array = listeners.split(' ');
	var elem = $id(id);
	if (elem) {
		for (var i = 0; i < array.length; i++) {
			elem.addEventListener(array[i], func);
		}
	} else {
		console.log('addListeners element not found ' + id);
	}
}

function isURL(str) {
	var urlPattern = new RegExp("(http|ftp|https)://[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?")
	var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
		'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
		'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
		'(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
	return pattern.test(str);
}

function readFile(flrdr, action, asFile) {
	var file = flrdr.files[0];
	if (file) {
		var fr = new FileReader();
		fr.onloadend = action;
		if (asFile) {
			fr.readAsText(file);
		} else {
			fr.readAsDataURL(file);
		}
	}
}
//https://www.sitepoint.com/building-custom-right-click-context-menu-javascript/
(function () {
	"use strict";

	// H E L P E R    F U N C T I O N S

	/**
	 * Function to check if we clicked inside an element with a particular class
	 * name.
	 *
	 * @param {Object} e The event
	 * @param {String} className The class name to check against
	 * @return {Boolean}
	 */
	function clickInsideElement(e, className) {
		let el = e.srcElement || e.target;

		if (el.classList.contains(className)) {
			return el;
		} else {
			while (el = el.parentNode) {
				if (el.classList && el.classList.contains(className)) {
					return el;
				}
			}
		}
		return false;
	}

	/**
	 * Get's exact position of event.
	 *
	 * @param {Object} e The event passed in
	 * @return {Object} Returns the x and y position
	 */
	function getPosition(e) {
		let posx = 0;
		let posy = 0;

		if (!e) {
			let e = window.event;
		}

		if (e.pageX || e.pageY) {
			posx = e.pageX;
			posy = e.pageY;
		} else if (e.clientX || e.clientY) {
			posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}

		return {
			x: posx,
			y: posy
		}
	}

	// C O R E    F U N C T I O N S

	/** Variables. */
	let contextMenuClassName = "context-menu";
	let contextMenuItemClassName = "context-menu-item";
	let contextMenuLinkClassName = "context-menu-link";
	let contextMenuActive = "context-menu--active";

	let taskItemClassName = "flex-item";
	let taskItemInContext;

	let clickCoords;
	let clickCoordsX;
	let clickCoordsY;

	let menu = document.querySelector("#context-menu");
	let menuItems = menu.querySelectorAll(".context-menu-item");
	let menuState = 0;
	let menuWidth;
	let menuHeight;
	let menuPosition;
	let menuPositionX;
	let menuPositionY;

	let windowWidth;
	let windowHeight;

	/** Initialise our application's code. */
	function init() {
		contextListener();
		clickListener();
		keyupListener();
		resizeListener();
	}

	/** Listens for contextmenu events. */
	function contextListener() {
		document.addEventListener("contextmenu", function (e) {
			taskItemInContext = clickInsideElement(e, taskItemClassName);
			if (taskItemInContext) {
				e.preventDefault();
				toggleMenuOn();
				positionMenu(e);
			} else {
				taskItemInContext = null;
				toggleMenuOff();
			}
		});
	}

	/** Listens for click events. */
	function clickListener() {
		document.addEventListener("click", function (e) {
			let clickeElIsLink = clickInsideElement(e, contextMenuLinkClassName);

			if (clickeElIsLink) {
				e.preventDefault();
				menuItemListener(clickeElIsLink);
			} else {
				let button = e.which || e.button;
				if (button === 1) {
					toggleMenuOff();
				}
			}
		});
	}

	/** Listens for keyup events. */
	function keyupListener() {
		window.onkeyup = function (e) {
			if (e.keyCode === 27) {
				toggleMenuOff();
			}
		}
	}

	/** Window resize event listener */
	function resizeListener() {
		window.onresize = function (e) {
			toggleMenuOff();
		};
	}

	/** Turns the custom context menu on. */
	function toggleMenuOn() {
		if (menuState !== 1) {
			menuState = 1;
			menu.classList.add(contextMenuActive);
		}
	}

	/** Turns the custom context menu off. */
	function toggleMenuOff() {
		if (menuState !== 0) {
			menuState = 0;
			menu.classList.remove(contextMenuActive);
		}
	}

	/** Positions the menu properly. */
	function positionMenu(e) {
		clickCoords = getPosition(e);
		clickCoordsX = clickCoords.x;
		clickCoordsY = clickCoords.y;

		menuWidth = menu.offsetWidth + 4;
		menuHeight = menu.offsetHeight + 4;

		windowWidth = window.innerWidth;
		windowHeight = window.innerHeight;

		if ((windowWidth - clickCoordsX) < menuWidth) {
			menu.style.left = windowWidth - menuWidth + "px";
		} else {
			menu.style.left = clickCoordsX + "px";
		}

		if ((windowHeight - clickCoordsY) < menuHeight) {
			menu.style.top = windowHeight - menuHeight + "px";
		} else {
			menu.style.top = clickCoordsY + "px";
		}
	}

	/**
	 * Dummy action function that logs an action when a menu item link is clicked
	 *
	 * @param {HTMLElement} link The link that was clicked
	 */
	function menuItemListener(link) {
		let id = taskItemInContext.getAttribute("data-id");
		let action = link.getAttribute("data-action");
		console.log("Task ID - " + id + ", Task action - " + action);
		switch (action) {
			case 'Edit':
				editItemContextMenu(id);
				break;
			case 'Delete':
				deleteItemContextMenu(id);
				break;
		}
		toggleMenuOff();
	}

	/** Run the app. */
	init();

})();
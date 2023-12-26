//variables
let previousElement;
let border;
//listener
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message.option == "clickAction") {
		if (border != null) {
			stopTracking();
		}
		createborder();
		startTracking();
	}
});
function startTracking() {
	document.addEventListener("mousemove", hoverElement, { passive: true });
	document.addEventListener("click", clickElement, { passive: false });
	border.classList.add("border");
}
function hoverElement(event) {
	//hide border so that we can see what the use is standing on
	//put border back so if he clicks he won't click on a element that goes to the next page or submits something
	border.classList.remove("border");
	let element = document.elementFromPoint(event.clientX, event.clientY);
	border.classList.add("border");
	if (element != null && element != previousElement) {
		if (previousElement != null) previousElement.classList.remove("css-selector-active");
		element.classList.add("css-selector-active");
		previousElement = element;
	}
}
function clickElement(event) {
	event.preventDefault();
	if (previousElement != null) {
		stopTracking();
		console.log(
			CssSelectorGenerator.getCssSelector(previousElement, {
				selectors: ["test-id", "class", "tag", "id", "attribute"],
				whitelist: ["test-id", "attribute"],
			})
		);
	}
}
function stopTracking() {
	document.removeEventListener("mousemove", hoverElement, { passive: true });
	document.removeEventListener("click", clickElement, { passive: false });
	previousElement.classList.remove("css-selector-active");
	border.classList.remove("border");
	border = null;
}

function createborder() {
	border = document.createElement("div");
	document.body.appendChild(border);
	border.classList.add("bordertwo");
}

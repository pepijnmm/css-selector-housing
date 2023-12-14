//variables
let previousElement;
//listener
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message.option == "clickAction") {
		startTracking();
	}
});
function startTracking() {
	document.addEventListener("mousemove", hoverElement, { passive: true });
	document.addEventListener("click", clickElement, { passive: false });
}
function hoverElement(event) {
	let element = document.elementFromPoint(event.clientX, event.clientY);
	if (element != null && element != previousElement) {
		if (previousElement != null) previousElement.classList.remove("css-selector-active");
		element.classList.add("css-selector-active");
		previousElement = element;
	}
}
function clickElement(event) {
	event.preventDefault();
	let element = document.elementFromPoint(event.clientX, event.clientY);
	previousElement.classList.remove("css-selector-active");
	if (element != null) {
		stopTracking();
		console.log(element);
	}
}
function stopTracking() {
	document.removeEventListener("mousemove", hoverElement, { passive: true });
}

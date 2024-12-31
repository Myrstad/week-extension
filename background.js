//Chrome workaround
if (typeof browser == "undefined") {
    // Chrome does not support the browser namespace yet.
    globalThis.browser = chrome;
}

/**
 * Gets the current week number as an integar
 *
 * @returns {int} current week number
 */
function getWeekNumber() {
    Date.prototype.getWeek = function () {
		var target = new Date(this.valueOf());
		var dayNr = (this.getDay() + 6) % 7;
		target.setDate(target.getDate() - dayNr + 3);
		var firstThursday = target.valueOf();
		target.setMonth(0, 1);
		if (target.getDay() != 4) {
		target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
		}
		return 1 + Math.ceil((firstThursday - target) / 604800000);
    };
  
    var d = new Date();
    let result = d.getWeek();
    return result;
}
  
async function setIconAndTitle() {
	const weekNumber = getWeekNumber();
	//const weekNumber = 49;
	browser.action.setTitle({
		title: 'Week Number: ' + weekNumber,
	});

	var canvas = new OffscreenCanvas(64, 64);
	var ctx = canvas.getContext('2d');

	const style = document.createElement('style');
	const fontPath = browser.runtime.getURL('fonts/Inter.ttf');
	style.textContent = `
		@font-face {
		font-family: 'Inter';
		src: url('${fontPath}') format('truetype');
		}
	`;
	document.head.appendChild(style);

	// Ensure the font is loaded before drawing
	const font = new FontFace('Inter', `url(${fontPath})`);
	await font.load();
	document.fonts.add(font);

	ctx.fillStyle = '#fff0';
	ctx.fillRect(0, 0, 64, 64);

	ctx.font = '58px Inter';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	const colorPromise = browser.storage.local.get('color');
	colorPromise.then((res) => {
		let color = res.color || '#111';
		ctx.fillStyle = color;

		const text = weekNumber + '';
		const textMetrics = ctx.measureText(text);
		const textOffsetY =
		(textMetrics.actualBoundingBoxAscent -
			textMetrics.actualBoundingBoxDescent) /
		2;
		ctx.fillText(text, 32, 32 + textOffsetY);
		browser.action.setIcon({ imageData: ctx.getImageData(0,0,canvas.width,canvas.height) });
	});
}

setInterval(setIconAndTitle, 3600000); // update icon and title every hour
setIconAndTitle();
	browser.storage.local.onChanged.addListener((e) => {
setIconAndTitle();
});



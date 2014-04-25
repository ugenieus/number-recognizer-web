var canvas;
var circleContext;
var lineContext;
var drawThickness = 4;
var isDrawing = false;
var x = 0;
var y = 0;

function drawStart(x, y) {
	context.beginPath();
	context.arc(x, y, drawThickness, 0, 2 * Math.PI, false);
	context.fill();

	context.beginPath();
	context.moveTo(x, y);
}

function drawMove(x, y) {
	console.log(x);
	context.lineTo(x, y);
	context.stroke();
	context.beginPath();
	context.moveTo(x, y);
}

function mousedownCanvasHandler(e) {
	isDrawing = true;
	x = e.clientX - canvas.offset().left;
	y = e.clientY - canvas.offset().top;
	drawStart(x, y);
}

function mousemoveCanvasHandler(e) {
	if (isDrawing) {
		x = e.clientX - canvas.offset().left;
		y = e.clientY - canvas.offset().top;
		drawMove(x, y);
	};
}

function mouseupCanvasHandler(e) {
	isDrawing = false;
}

function initCanvas() {
	canvas = $('#recognition_canvas');
	context = canvas[0].getContext('2d');

	context.lineWidth = drawThickness * 2;

	canvas.mousedown(mousedownCanvasHandler);
	canvas.mousemove(mousemoveCanvasHandler);
	canvas.mouseup(mouseupCanvasHandler);
}


function clickConfirmButtonHandler(e) {
	alert('click confirm.');
}

function clickResetButtonHandler(e) {
	canvas.width = canvas.width;
}

function clickSendButtonHandler(e) {
	alert('click send.');
}

function initialize(jQuery) {
	// event bindind
	$('#confirm_button').click(clickConfirmButtonHandler);
	$('#reset_button').click(clickResetButtonHandler);
	$('#send_button').click(clickSendButtonHandler);

	// initialize canvas
	initCanvas();
}

$(document).ready(initialize);
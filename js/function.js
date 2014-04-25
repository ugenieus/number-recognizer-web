// constans
var DRAW_THICKNESS = 4;

// canvas variables
var canvas;
var context;
var isDrawing;
var x, y;

function drawStart(x, y) {
	// draw circle
	context.beginPath();
	context.arc(x, y, DRAW_THICKNESS, 0, 2 * Math.PI, false);
	context.fill();

	// start drawing line
	context.beginPath();
	context.moveTo(x, y);
}

function drawMove(x, y) {
	// draw line
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
	// initialize
	canvas = $('#recognition_canvas');
	context = canvas[0].getContext('2d');
	isDrawing = false;
	x = 0;
	y = 0;

	// setting draw style
	context.lineWidth = DRAW_THICKNESS * 2;

	// add event listener
	canvas.mousedown(mousedownCanvasHandler);
	canvas.mousemove(mousemoveCanvasHandler);
	canvas.mouseup(mouseupCanvasHandler);
}


function clickConfirmButtonHandler(e) {
	var imageData;
	imageData = context.createImageData(canvas.width(), canvas.height());


}

function clickResetButtonHandler(e) {
	context.clearRect(0, 0, canvas.width(), canvas.height());
}

function clickSendButtonHandler(e) {
	alert('click send.');
}

function initialize(jQuery) {
	// add event listener
	$('#confirm_button').click(clickConfirmButtonHandler);
	$('#reset_button').click(clickResetButtonHandler);
	$('#send_button').click(clickSendButtonHandler);

	// initialize canvas
	initCanvas();
}

$(document).ready(initialize);
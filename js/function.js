// constans
var DRAW_THICKNESS = 4;
var DATA_SIZE = 50;

// canvas variables
var canvas;
var context;
var isDrawing;
var x, y;

function reduceCanvas() {
	var canvasWidth, canvasHeight;
	var blockSize;
	var result;

	var imageData;
	var i, j, k, l;
	var offset, index;
	var count;
	var color;

	// initialize
	canvasWidth = canvas.width();
	canvasHeight = canvas.height();
	blockSize = canvas.width() / DATA_SIZE;
	result = "";

	// get canvas data
	imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);

	for (i = 0; i < DATA_SIZE; i++) {
		for (j = 0; j < DATA_SIZE; j++) {
			offset = (i * canvasWidth + j) * blockSize;

			count = 0;
			for (k = 0; k < blockSize; k++) {
				for (l = 0; l < blockSize; l++) {
					index = (offset + (k * canvasWidth + l)) * 4;
					if (imageData.data[index+3] > 128) {
						count++;
					}
				}
			}

			if (count >= blockSize/2) {
				result = result + '1';
			} else {
				result = result + '0';
			}

			// for test
			color = (count >= blockSize/2) * 255;
			for (k = 0; k < blockSize; k++) {
				for (l = 0; l < blockSize; l++) {
					index = (offset + (k * canvasWidth + l));
					// RGBA
					imageData.data[index*4+0] = color;
					imageData.data[index*4+1] = color;
					imageData.data[index*4+2] = color;
					imageData.data[index*4+3] = color;
				}
			}
		}
	}

	context.putImageData(imageData, 0, 0);

	return result;
}

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
	reduceCanvas();
}

function initCanvas() {
	// initialize
	canvas = $('#recognition_canvas');
	context = canvas[0].getContext('2d');
	isDrawing = false;
	x = 0;
	y = 0;

	// setting draw style
	context.fillStyle = "#000000";
	context.strokeStyle = "#000000";
	context.lineWidth = DRAW_THICKNESS * 2;

	// add event listener
	canvas.mousedown(mousedownCanvasHandler);
	canvas.mousemove(mousemoveCanvasHandler);
	canvas.mouseup(mouseupCanvasHandler);
}

function clickConfirmButtonHandler(e) {
	var result = reduceCanvas();
	// api call
}

function clickResetButtonHandler(e) {
	context.clearRect(0, 0, canvas.width(), canvas.height());
}

function clickSendButtonHandler(e) {
	var result = reduceCanvas();
	// api call
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
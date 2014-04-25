// constans
var BASE_URL = 'ugenieus.cafe24.com:5555/number';
var CANVAS_SIZE = 450;
var DATA_SIZE = 90;
var DRAW_THICKNESS = 4;

// canvas variables
var canvas;
var context;
var isDrawing;
var x, y;

function showResult(sendData) {
	var testData = {
		result: [7, 2, 5]
	};
	// $.post(BASE_URL, {
	// 	string: sendData,
	// 	param2: data2
	// }, function(data, textStatus, xhr) {
	// 	$('.result p')[0].html('5');
	// 	$('.result p')[1].html('5');
	// 	$('.result p')[2].html('5');
	// });

	$('.result p').html(testData.result[0]);
}

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
	stringifyData = "";

	// get canvas data
	imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);

	for (i = 0; i < DATA_SIZE; i++) {
		for (j = 0; j < DATA_SIZE; j++) {
			offset = (i * canvasWidth + j) * blockSize;

			count = 0;
			for (k = 0; k < blockSize; k++) {
				for (l = 0; l < blockSize; l++) {
					index = (offset + (k * canvasWidth + l));
					if (imageData.data[index*4+3] > 128) {
						count++;
					}
				}
			}

			if (count >= blockSize/2) {
				stringifyData = stringifyData + '1';
			} else {
				stringifyData = stringifyData + '0';
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

	showResult(stringifyData);

	return stringifyData;
}

function drawStart(e) {
	isDrawing = true;
	x = e.pageX - canvas.offset().left;
	y = e.pageY - canvas.offset().top;

	// draw circle
	context.beginPath();
	context.arc(x, y, DRAW_THICKNESS, 0, 2 * Math.PI, false);
	context.fill();

	// move point for next line
	context.beginPath();
	context.moveTo(x, y);
}

function drawMove(e) {
	if (isDrawing) {
		x = e.pageX - canvas.offset().left;
		y = e.pageY - canvas.offset().top;

		// draw line
		context.lineTo(x, y);
		context.stroke();

		// draw circle
		context.beginPath();
		context.arc(x, y, DRAW_THICKNESS, 0, 2 * Math.PI, false);
		context.fill();

		// move point for next line
		context.beginPath();
		context.moveTo(x, y);
	};
	
}

function drawEnd(e) {
	isDrawing = false;
	reduceCanvas();
}

function initCanvas() {
	// initialize
	canvas = $('#recognition_canvas');
	canvas[0].width = CANVAS_SIZE;
	canvas[0].height = CANVAS_SIZE;
	context = canvas[0].getContext('2d');
	isDrawing = false;

	// setting draw style
	context.fillStyle = "#000000";
	context.strokeStyle = "#000000";
	context.lineWidth = DRAW_THICKNESS * 2;

	// add event listener
	canvas.mousedown(drawStart);
	canvas.mousemove(drawMove);
	canvas.mouseup(drawEnd);
	canvas.mouseleave(drawEnd);
}

function clearCanvas(e) {
	context.clearRect(0, 0, canvas.width(), canvas.height());
	isDrawing = false;
}

function clickSendButtonHandler(e) {
	var sendData = reduceCanvas();
	
	console.log("send: " + sendData);
}

function keyDownHandler (e) {
	switch (e.keyCode) {
		case 82:
			clearCanvas();
			break;
	}
}

function initialize(jQuery) {
	// add event listener
	$('#reset_button').click(clearCanvas);
	$('#send_button').click(clickSendButtonHandler);
	$('body').keydown(keyDownHandler);

	// initialize canvas
	initCanvas();
}

$(document).ready(initialize);
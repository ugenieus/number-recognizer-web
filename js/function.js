// constans
var BASE_URL = 'http://ugenieus.cafe24.com:5555/nrApi/number';
var API_ACTIVE = false;
var CANVAS_SIZE = 450;
var CLIP_BASE_MARGIN = 0;
var DATA_SIZE = 50;
var DRAW_THICKNESS = 4;
var DRAW_COLOR = '#2fc1d8';
var DRAW_AFTER_R = '240';
var DRAW_AFTER_G = '232';
var DRAW_AFTER_B = '140';

// canvas variables
var $canvas;
var context;
var isDrawing;
var x, y;

function requestAPI(params) {
	var url = BASE_URL + '/' + params.method;
	if (!API_ACTIVE) return;
	$.post(url, params.parameter, params.success);
}

function showResult(sentData) {
	requestAPI({
		method: 'classify',
		parameter: {
			result: sentData
		},
		success: function(data) {
			var $pList;
			$pList = $('.recommend-num p');
			$.each($pList, function(index, p) {
				var $p = $(p);
				if (data.result[index]) {
				 	$p.html(data.result[index]);
				}
				else {
					$p.html('X');
				}
			});
			console.log(data.result);
		}
	});
}

function convertImageToArray(imageData, width, height) {
	var newArray = new Array(width);

	for (var i = 0; i < width; i++) {
		newArray[i] = new Array(height);

		for (var j = 0; j < height; j++) {
			var index = (i * height) + j,
				R = imageData.data[index*4 + 0],
				G = imageData.data[index*4 + 1],
				B = imageData.data[index*4 + 2],
				A = imageData.data[index*4 + 3];

			if (A > 128) {
				newArray[i][j] = 1; // black
			}
			else {
				newArray[i][j] = 0; // white
			}
		}
	}

	return {
		data: newArray,
		width: width,
		height: height
	}
}

function clipArray(array) {
	var minX, minY, maxX, maxY, clipWidth, clipHeight, clipSize, marginX, marginY, clipArray,
		arrayData = array.data,
		width = array.width,
		height = array.height;

	// initialize
	minX = width;
	minY = height;
	maxX = maxY = 0;

	// search clip coordinate
	for (var i = 0; i < width; i++) {
		for (var j = 0; j < height; j++) {
			if (arrayData[i][j]) {
				if (minX > i) minX = i;
				if (minY > j) minY = j;
				if (maxX < i) maxX = i;
				if (maxY < j) maxY = j;
			}
		}
	}

	if (maxX < minX) maxX = minX;
	if (maxY < minY) maxY = minY;

	clipWidth = maxX - minX;
	clipHeight = maxY - minY;

	if (clipWidth > clipHeight) {
		clipSize = clipWidth + CLIP_BASE_MARGIN*2;
		marginX = CLIP_BASE_MARGIN;
		marginY = parseInt((clipWidth - clipHeight)/2) + CLIP_BASE_MARGIN;
	}
	else {
		clipSize = clipHeight + CLIP_BASE_MARGIN*2;
		marginX = parseInt((clipHeight - clipWidth)/2) + CLIP_BASE_MARGIN;
		marginY = CLIP_BASE_MARGIN;
	}

	clipArray = new Array(clipSize);
	for (var i = 0; i < clipSize; i++) {
		clipArray[i] = new Array(clipSize);

		for (var j = 0; j < clipSize; j++) {
			if ((i - marginX < 0) || (j - marginY < 0) || (i - marginX >= clipWidth) || (j - marginY >= clipHeight)) {
				clipArray[i][j] = 0;
			}
			else {
				clipArray[i][j] = arrayData[minX + i - marginX][minY + j - marginY];
			}
		}
	}

	return {
		data: clipArray,
		width: clipSize,
		height: clipSize
	};
}

function resizeDigits(pixels, sourceWidth, sourceHeight, destinationWidth, destinationHeight) {
	var xRatio,
		yRatio,
		destination,
		px,
		py,
		row,
		col;

	destination = new Array();

	xRatio = ((sourceWidth << 16) / destinationWidth) + 1;
	yRatio = ((sourceHeight << 16) / destinationHeight) + 1;

	for (row = 0; row < destinationHeight; row++) {
		for (col = 0; col < destinationWidth; col++) {
			px = (col * xRatio) >> 16;
			py = (row * yRatio) >> 16;
			destination[(row * destinationWidth) + col] = pixels[parseInt((py * sourceWidth) + px)];
            // console.log(row + ', ' + col);
            // console.log(parseInt((py * sourceWidth) + px), '=> ', pixels[parseInt((py * sourceWidth) + px)]);
		}
	}

	return destination;
}

function convert2DimTo1Dim(sourceArray)
{
	var destination,
	 	i,
	 	j;

	destination = new Array();
	for (i = 0; i < sourceArray.length; i++) {
		for (j = 0; j < sourceArray[i].length; j++) {
			destination.push(sourceArray[i][j]);
		}
	}

	return destination;
}

function convert1DimTo2Dim(sourceArray, numberOfColumns)
{
	var destination,
		aRow,
		aIndex,
		i,
		j;

	sourceLength = sourceArray.length;
	numberOfRows = parseInt(sourceLength / numberOfColumns);
    
	destination = new Array();
	for (i = 0; i < numberOfRows; i++) {
		aRow = new Array();
		for (j = 0; j < numberOfColumns; j++) {
			aIndex = i * numberOfRows + j;
			if (aIndex >= sourceLength) {
				break;
			}
			aRow.push(sourceArray[aIndex]);
		}
		destination.push(aRow);
	}

	return destination;
}

function stringfyTwoDimArray(array) {
	var i, j, string;
	string = '';
	for (i = 0; i < array.length; i++) {
		for (j = 0; j < array[i].length; j++) {
			string += array[i][j] + ' ';
		}
		string += '\n';
	}
	return string;
}

function resizeArray(data, rWidth, rHeight) {
	var resizeArray,
		arrayData = array.data,
		width = array.width,
		height = array.height;

	resizeArray = new Array(rWidth);
	for (var i = 0; i < rWidth; i++) {
		resizeArray[i] = new Array(rHeight);

		for (var j = 0; j < rHeight; j++) {
			var x = parseInt((i+i/rWidth)*width/rWidth),
				y = parseInt((j+j/rHeight)*height/rHeight);

			resizeArray[i][j] = arrayData[x][y];
		}
	}

	return {
		data: resizeArray,
		width: rWidth,
		height: rHeight
	};
}

function stringifyArray(array) {
	var stringifyData = '';
		arrayData = array.data,
		width = array.width,
		height = array.height;

	for (var i = 0; i < width; i++) {
		for (var j = 0; j < height; j++) {
			if (arrayData[i][j]) {
				stringifyData = stringifyData + '1';
			}
			else {
				stringifyData = stringifyData + '0';
			}
		}
	}

	return stringifyData;
}

function getCanvasImageData() {
		canvasWidth = $canvas.width(),
		canvasHeight = $canvas.height();

	// initialize
	imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
	array = convertImageToArray(imageData, canvasWidth, canvasHeight);
	array = clipArray(array);
	console.log(stringfyTwoDimArray(array.data));
	array = resizeArray(array, DATA_SIZE, DATA_SIZE);
	console.log(stringfyTwoDimArray(array.data));

	return '';
	// return stringifyArray(array);
	
	/*
	var canvasWidth, canvasHeight;
	var blockSize;
	var stringifyData;

	var imageData;
	var i, j, k, l;
	var offset, index;
	var count;
	var color;

	// initialize
	canvasWidth = $canvas.width();
	canvasHeight = $canvas.height();
	blockSize = $canvas.width() / DATA_SIZE;
	stringifyData = "";

	// get canvas data
	imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);

	for (i = 0; i < DATA_SIZE; i++) {
		for (j = 0; j < DATA_SIZE; j++) {
			offset = (i * canvasWidth + j) * blockSize;

			count = 0;
			for (k = 0; k < blockSize; k++) {
				for (l = 0; l < blockSize; l++) {
					index = offset + (k * canvasWidth + l);
					if (imageData.data[index*4+3] > 128) { // compare pixel's alpha value
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
					imageData.data[index*4+0] = DRAW_AFTER_R;
					imageData.data[index*4+1] = DRAW_AFTER_G;
					imageData.data[index*4+2] = DRAW_AFTER_B;
					imageData.data[index*4+3] = color;
				}
			}
		}
	}

	context.putImageData(imageData, 0, 0);
	return stringifyData;
	*/
}

function drawStart(e) {
	isDrawing = true;
	x = e.pageX - $canvas.offset().left;
	y = e.pageY - $canvas.offset().top;

	// draw circle
	context.beginPath();
	context.arc(x, y, DRAW_THICKNESS, 0, 2 * Math.PI, false);
	context.fill();

	// move point for next line
	context.beginPath();
	context.moveTo(x, y);
}

function drawMove(e) {
	if (!isDrawing) return;
	
	x = e.pageX - $canvas.offset().left;
	y = e.pageY - $canvas.offset().top;

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
}

function drawEnd(e) {
	var stringifyData;
	if (!isDrawing) return;
	isDrawing = false;
	stringifyData = getCanvasImageData();
	console.log(stringifyData);
	showResult(stringifyData);
}

function initCanvas() {
	// initialize
	$canvas = $('#recognition_canvas');
	$canvas[0].width = CANVAS_SIZE;
	$canvas[0].height = CANVAS_SIZE;
	context = $canvas[0].getContext('2d');
	isDrawing = false;

	// setting draw style
	context.fillStyle = DRAW_COLOR;
	context.strokeStyle = DRAW_COLOR;
	context.lineWidth = DRAW_THICKNESS * 2;

	// add event listener
	$canvas.mousedown(drawStart);
	$canvas.mousemove(drawMove);
	$canvas.mouseup(drawEnd);
	$canvas.mouseleave(drawEnd);
}

function clearCanvas(e) {
	var pList;

	context.clearRect(0, 0, $canvas.width(), $canvas.height());
	isDrawing = false;

	pList = $('.recommend-num p');
	$.each(pList, function(index, p) {
		var $p = $(p);
		$p.html('X');
	});
}

function trainCanvasData(number) {
	var sentData = getCanvasImageData();
	
	requestAPI({
		method: 'save',
		parameter: {
			number: number,
			result: sentData
		},
		success: function(data) {
			console.log('save');
		}
	});
}

function keyDownHandler (e) {
	switch (e.keyCode) {
		case 82:
			clearCanvas();
			break;
		default:
			break;
	}
}

function initialize(jQuery) {
	// add event listener
	$('#reset_button').click(clearCanvas);
	$('body').keydown(keyDownHandler);

	// initialize canvas
	initCanvas();
}

$(document).ready(initialize);
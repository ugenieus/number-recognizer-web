/**
 * Created by woo-jin on 2014-04-26.
 */
// constans
var BASE_URL = 'http://tickple.cool:5555/nrApi/number';
var API_ACTIVE = true;
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
    array = resizeArray(array, DATA_SIZE, DATA_SIZE);

    return stringifyArray(array);
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
    if (!isDrawing) return;
    isDrawing = false;
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
}

function clearCanvas(e) {
    context.clearRect(0, 0, $canvas.width(), $canvas.height());
    isDrawing = false;
}
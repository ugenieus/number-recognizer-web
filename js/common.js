/**
 * Created by woo-jin on 2014-04-26.
 */
// constants
var BASE_URL = 'http://ugenieus.cafe24.com:5555/nrApi/number';
var CANVAS_SIZE = 450;
var DATA_SIZE = 90;
var DRAW_THICKNESS = 4;
var DRAW_COLOR = '#2fc1d8';
var DRAW_AFTER_R = '240';
var DRAW_AFTER_G = '232';
var DRAW_AFTER_B = '140';

// canvas variables
var canvas;
var context;
var isDrawing;
var x, y;

function requestAPI(params) {
    var url = BASE_URL + '/' + params.method;
    $.post(url, params.parameter, params.success);
}

function reduceCanvas() {
    var canvasWidth, canvasHeight;
    var blockSize;
    var stringifyData;

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
                    index = offset + (k * canvasWidth + l);
                    if (imageData.data[index*4+3] > 128) { // get alpha value
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
    if (!isDrawing) return;

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
}

function drawEnd(e) {
    if (!isDrawing) return;
    isDrawing = false;
}

function initCanvas() {
    // initialize
    canvas = $('#recognition_canvas');
    canvas[0].width = CANVAS_SIZE;
    canvas[0].height = CANVAS_SIZE;
    context = canvas[0].getContext('2d');
    isDrawing = false;

    // setting draw style
    context.fillStyle = DRAW_COLOR;
    context.strokeStyle = DRAW_COLOR;
    context.lineWidth = DRAW_THICKNESS * 2;

    // add event listener
    canvas.mousedown(drawStart);
    canvas.mousemove(drawMove);
}

function clearCanvas(e) {
    context.clearRect(0, 0, canvas.width(), canvas.height());
    isDrawing = false;
}
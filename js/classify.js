function initialize(jQuery) {
    // add event listener
    $('#reset_button').click(reset);
    $('body').keydown(keyDownHandler);

    // initialize canvas
    initCanvas();
    $canvas.mouseup(drawEndInClassifyingView);
    $canvas.mouseleave(drawEndInClassifyingView);

    clearResults();
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
				if (!isNaN(data.result[index])) {
				 	$p.html(data.result[index]);
				} else {
					$p.html('X');
				}
			});

            console.log(data);
		}
	});
}

function drawEndInClassifyingView() {
    var stringifyData;

    if (!isDrawing) return;
    isDrawing = false;
    stringifyData = getCanvasImageData();
    showResult(stringifyData);
}

function clearResults() {
    $pList = $('.recommend-num p');
    $.each($pList, function(index, p) {
        var $p = $(p);
        $p.html('X');
    });
}

function reset() {
    clearCanvas();
    clearResults();
}

function keyDownHandler (e) {
    switch (e.keyCode) {
        case 82:
            reset();
            break;
        default:
            break;
    }
}


$(document).ready(initialize);
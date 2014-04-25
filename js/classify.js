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
				} else {
					$p.html('X');
				}
			});
		}
	});
}

function drawEndInClassifyingView() {
    stringifyData = reduceCanvas();
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

function initialize(jQuery) {
	// add event listener
	$('#reset_button').click(reset);
	$('body').keydown(keyDownHandler);

    // initialize canvas
    initCanvas();
    canvas.mouseup(drawEndInClassifyingView);

    clearResults();
}

$(document).ready(initialize);
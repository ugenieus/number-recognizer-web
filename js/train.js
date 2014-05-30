/**
 * Created by woo-jin on 2014-04-26.
 */
function initialize(jQuery) {
    // add event listener
    $('#reset_button').click(clearCanvas);
    $('#send_button').click(clickSendButtonHandler);
    $('body').keydown(keyDownHandler);

    // initialize canvas
    initCanvas();

    canvas.mouseup(drawEndInTrainingViewView);
    canvas.mouseleave(drawEndInTrainingViewView)
}

function drawEndInTrainingViewView() {
    if (!isDrawing) return;
    isDrawing = false;
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

function getInputNumber() {
    return $('#training-number').val();
}

function clickSendButtonHandler(e) {
    var inputNumber = getInputNumber();

    if (inputNumber == '') {
        alert('숫자를 입력해주세요.')
    }

    if (inputNumber < 0 || inputNumber > 9) {
        alert('0 ~ 9 사이의 숫자를 입력해주세요.');
    }
    var sendData = reduceCanvas();
    requestAPI({
        method: 'save',
        parameter: {
            number: inputNumber,
            result: sendData
        },
        success: function(result) {
            if (result.result === true) {
                alert('성공적으로 훈련되었습니다.');
                clearCanvas();
            } else {
                alert('훈련에 실패하였습니다.');
            }
        }
    });
}

$(document).ready(initialize);
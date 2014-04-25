function clickConfirmButtonHandler(event) {
	alert('click confirm.');
}

function clickResetButtonHandler(event) {
	alert('click reset.');
}

function clickSendButtonHandler(event) {
	alert('click send.');
}

function initialize(jQuery) {
	$('#confirm_button').click(clickConfirmButtonHandler);
	$('#reset_button').click(clickResetButtonHandler);
	$('#send_button').click(clickSendButtonHandler);
}

$(document).ready(initialize);
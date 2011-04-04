(function () {
	var model = new TargetDetectionModel('#frontCamera', '.simple-target', '#sightCapture', '#lock');
	var controlSurface = model.getControlSurface();
	controlSurface.detectorOn = function () { $('#release').removeAttr('disabled'); };

	$('#start').click(function () {
		$(this).attr('disabled', 'disabled');
		$('#number').attr('disabled', 'disabled');
		$('#stop').removeAttr('disabled');
		controlSurface.start();
	});
	$('#stop').click(function () {
		$(this).attr('disabled', 'disabled');
		$('#number').removeAttr('disabled');
		$('#release').attr('disabled', 'disabled');
		$('#start').removeAttr('disabled');
		controlSurface.stop();
	});
	$('#release').click(function () {
		controlSurface.release();
		$('#release').attr('disabled', 'disabled');
	});
	$('#controls').click(function () {
		var a = $('#advancedControls');
		if (a.css('display') == 'none') {
			a.slideDown();
		}
		else {
			a.slideUp();
		}
	});
	$('#speed').change(function () {
		var targetRate = $(this).attr('max') - $(this).val();
		controlSurface.setTargetRate(targetRate);
	});
	$('#acc').change(function () {
		var targetSpeed = $(this).val();
		controlSurface.setTargetSpeed(targetSpeed);
	});
	$('#error').change(function () {
		var allowedError = $(this).val();
		controlSurface.setAllowedError(allowedError);
	});
	$('#rate').change(function () {
		var detectionRate = $(this).attr('max') - $(this).val();
		controlSurface.setDetectionRate(detectionRate);
	});
	$('#number').change(function () {
		controlSurface.setNumberOfTargets($(this).val());
	});

	function log(txt) {
		$('#log').html(txt);
	}
})();
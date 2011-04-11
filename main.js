(function () {
	//common selectors
	var releaseBtn = $('#release'),
		startBtn = $('#start'),
		stopBtn = $('#stop'),
		numSlider = $('#number');

	startBtn.click(function () {
		startBtn.attr('disabled', 'disabled');
		numSlider.attr('disabled', 'disabled');
		stopBtn.removeAttr('disabled');
		controlSurface.start();
	});
	stopBtn.click(function () {
		stopBtn.attr('disabled', 'disabled');
		numSlider.removeAttr('disabled');
		releaseBtn.attr('disabled', 'disabled');
		startBtn.removeAttr('disabled');
		controlSurface.stop();
	});
	releaseBtn.click(function () {
		controlSurface.release();
		releaseBtn.attr('disabled', 'disabled');
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
	numSlider.change(function () {
		var cam = $('#frontCamera');
		cam.children('.simple-target').remove();
		var tt = $('#targetTemplate').html();
		var numberOfTargets = numSlider.val();
		for (var i = 0; i < numberOfTargets; i += 1) {
			cam.append(tt);
		}
		controlSurface.setNumberOfTargets(numberOfTargets);
	});
	function log(txt) {
		$('#log').html(txt);
	}

	// Model initialisation
	var model = new TargetDetectionModel('#frontCamera', '.simple-target', '#sightCapture', '#lock');
	var controlSurface = model.getControlSurface();
	controlSurface.detectorOn = function () { releaseBtn.removeAttr('disabled'); };
})();
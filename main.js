﻿(function () {
	//common selectors
	var releaseBtn = $('#release'), startBtn = $('#start'), stopBtn = $('#stop');

	var model = new TargetDetectionModel('#frontCamera', '.simple-target', '#sightCapture', '#lock');
	var controlSurface = model.getControlSurface();
	controlSurface.detectorOn = function () { releaseBtn.removeAttr('disabled'); };

	startBtn.click(function () {
		$(this).attr('disabled', 'disabled');
		$('#number').attr('disabled', 'disabled');
		stopBtn.removeAttr('disabled');
		controlSurface.start();
	});
	stopBtn.click(function () {
		$(this).attr('disabled', 'disabled');
		$('#number').removeAttr('disabled');
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
	$('#number').change(function () {
		controlSurface.setNumberOfTargets($(this).val());
	});

	function log(txt) {
		$('#log').html(txt);
	}
})();
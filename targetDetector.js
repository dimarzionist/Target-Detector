// Target control model
function TargetsControl(targetsSelector, modelSettings, camera) {
	this.targets = $(targetsSelector);
	this.modelSettings = modelSettings;
	this.camera = camera;
}
TargetsControl.prototype = {
	targets: null,
	isTargetActive: false,
	modelSettings: null,
	camera: null,
	mx: [0, 1, 1, 1, 0, -1, -1, -1, 0, 0, 0, 0],
	my: [-1, -1, 0, 1, 1, 1, 0, -1, 0, 0, 0, 0],
	setNumberOfTargets: function (numberOfTargets) {
		if (!this.isTargetActive) {
			this.targets.removeClass('real-object');
			for (var i = 0; i < numberOfTargets; i++) {
				$(this.targets[i]).addClass('real-object');
			}
		}
	},
	changePosition: function (target) {
		var tp = target.position();											// getting current target posiiton
		var r = Math.round(Math.random() * 10);								// getting random direction where we want to move the target
		var d = Math.round(Math.random() * this.modelSettings.targetSpeed); // getting random offset (less or erual target max speed)
		var dX = tp.left + this.mx[r] * d;
		var dY = tp.top + this.my[r] * d;
		var cameraMargin = this.modelSettings.cameraMargin;					// ensuring the target is still within camera view
		var camWidth = this.camera.screenWidth();
		var camHeight = this.camera.screenHeight();
		if (dX > cameraMargin && dY > cameraMargin && dX < camWidth - cameraMargin && dY < camHeight - cameraMargin) {
			target.css({ left: dX, top: dY });
		}
	},
	startAll: function () {
		var self = this;
		this.targets.each(function () {
			var t = $(this);
			if (t.hasClass('real-object')) {
				var offset = self.modelSettings.cameraMargin;
				var camWidth = self.camera.screenWidth();
				var camHeight = self.camera.screenHeight();
				var left = Math.round(Math.random() * camWidth);
				var top = Math.round(Math.random() * camHeight);
				left = left > camWidth - offset ? left - offset : left;
				top = top > camHeight - offset ? top - offset : top;
				t.css({ left: left, top: top }).fadeIn('slow');
			}
		});
		this.startTargetsMovement();
	},
	startTargetsMovement: function () {
		this.isTargetActive = true;
		var self = this;
		var moveTargets = function () {
			if (!self.isTargetActive) {
				return;
			}
			self.targets.each(function () {
				var t = $(this);
				if (t.hasClass('real-object')) {
					self.changePosition(t);
				}
			});
			window.setTimeout(moveTargets, self.modelSettings.targetRate);
		};
		moveTargets();
	},
	stopAll: function () {
		this.isTargetActive = false;
		this.targets.fadeOut('slow');
	}
};

// Camera controls
function Camera(cameraSelector, modelSettings) {
	this.cameraEl = $(cameraSelector);
	this.modelSettings = modelSettings;
}
Camera.prototype = {
	cameraEl: null,	
	modelSettings: null,
	on: function () {
		var color = 0;
		var self = this;
		var changeColor = function () {
			var colorString = 'rgb(' + color + ', ' + color + ', ' + color + ')';
			self.cameraEl.css('background-color', colorString);
			color += 5;
			if (color >= 255) {
				self.cameraEl.css('background-color', 'transparent').fadeTo('fast', 1, null);
			}
			else {
				window.setTimeout(changeColor, self.modelSettings.switchOnSpeed);
			}
		};
		this.cameraEl.fadeTo('slow', 0.3, function () {
			changeColor();
		});
	},
	off: function () {
		var color = 255;
		var self = this;
		var changeColor = function () {
			var colorString = 'rgb(' + color + ', ' + color + ', ' + color + ')';
			self.cameraEl.css('background-color', colorString);
			color -= 5;
			if (color <= 0) {
				self.cameraEl.css('background-color', 'black').fadeTo('fast', 1, null);
			}
			else {
				window.setTimeout(changeColor, self.modelSettings.switchOnSpeed);
			}
		};
		this.cameraEl.fadeTo('slow', 0.3, function () {			
			changeColor();
		});
	},
	screenWidth: function () {
		return this.cameraEl.width();
	},
	screenHeight: function () {
		return this.cameraEl.height();
	}
};

// Sight control
function Sight(sightSelector, camera, modelSettings) {
	this.sightEl = $(sightSelector);
	this.camera = camera;
	this.modelSettings = modelSettings;	
}
Sight.prototype = {
	sightEl: null,
	camera: null,
	isSightActive: false,
	modelSettings: null,
	on: function () {
		var w = this.sightEl.width();
		var h = this.sightEl.height();
		var sp = this.sightEl.position();
		this.isSightActive = true;
		var self = this;
		this.sightEl.fadeIn('slow');
		this.camera.cameraEl.mousemove(function (e) {
			if (self.isSightActive) {
				var nX = e.pageX - w / 2;
				var nY = e.pageY - h / 2;
				if (nX > 1 && nY > 1 && (nX + w) < self.camera.cameraEl.width() && (nY + h) < self.camera.cameraEl.height()) {
					self.sightEl.css({ left: nX, top: nY });
					sp = self.sightEl.position();
				}
			}
		});
		this.sightEl.mousedown(function () {
			if (self.isSightActive) {
				$(this).css('background', 'rgba(250, 0, 0, 0.5)');
			}
		});
		this.sightEl.mouseup(function () {
			if (self.isSightActive) {
				$(this).css('background', 'rgba(180, 230, 255, 0.5)');
			}
		});
		this.sightEl.click(function () {
			self.camera.cameraEl.children('.real-object').each(function () {
				var p = $(this).position();
				var tw = $(this).width();
				var th = $(this).height();
				if (p.left > sp.left && p.left + tw < sp.left + w && p.top > sp.top && p.top + th < sp.top + h) {
					self.launchDetector();
				}
			});
		});
	},
	off: function () {
		this.isSightActive = false;
		this.camera.cameraEl.mousemove(null).mousedown(null).mouseup(null);
		this.sightEl.fadeOut('slow');
	},
	launchDetector: function () {
		if (this.targetInSight) {
			this.targetInSight();
		}
	},
	targetInSight: null
};

// Detector
function Detector(modelSettings, sight, camera) {
	this.modelSettings = modelSettings;
	this.sight = sight;
	this.camera = camera;
}
Detector.prototype = {
	modelSettings: null,
	sight: null,
	camera: null,
	isDetectionActive: false,
	on: function () {
		this.sight.isSightActive = false;
		this.isDetectionActive = true;
		this.sight.sightEl.css('background', 'rgba(255, 255, 150, 0.5)');
		if (this.detectionStarted) {
			//$('#release').removeAttr('disabled');
			this.detectionStarted();
		}
		var self = this;
		var applyDetection = function () {
			var sp = self.sight.sightEl.position();
			var sw = self.sight.sightEl.width();
			var sh = self.sight.sightEl.height();
			var q = 0;
			self.camera.cameraEl.children('.real-object').each(function () {
				var p = $(this).position();
				var tw = $(this).width();
				var th = $(this).height();
				var dL = sp.left;
				var dT = sp.top;
				var d = Math.round((sw - tw) / 3);
				var e = self.modelSettings.allowedError;
				if (p.left + e > sp.left && p.top + e > sp.top && p.left + tw - e < sp.left + sw && p.top + th - e < sp.top + sh) {
					if (Math.abs((p.left + tw) - (sp.left + sw)) < e) {
						dL += d;
					}
					if (Math.abs(p.left - sp.left) < e) {
						dL -= d;
					}
					if (Math.abs(p.top - sp.top) < e) {
						dT -= d;
					}
					if (Math.abs((p.top + th) - (sp.top + sh)) < e) {
						dT += d;
					}
					self.sight.sightEl.css({ left: dL, top: dT });
					sp = self.sight.sightEl.position();
					q++;
				}
			});
			if (q != 1) {
				if (self.detectionDropped) {
					self.detectionDropped();
				}
				self.sight.sightEl.children('.inner-sight').css('border', 'solid 1px #ff0000');
			}
			else {
				self.sight.sightEl.children('.inner-sight').css('border', 'solid 1px #009933');
			}
		};
		var detectionTact = function () {
			if (!self.isDetectionActive) {
				return;
			}
			applyDetection();
			window.setTimeout(detectionTact, self.modelSettings.detectionRate);
		}
		//startLocking();
		detectionTact();
	},
	release: function () {
		this.isDetectionActive = false;
		this.sight.isSightActive = true;
		this.sight.sightEl.css('background', 'rgba(180, 230, 255, 0.5)').children('.inner-sight').css('border', 'solid 1px #ffff00');
	},
	off: function () {
		this.isDetectionActive = false;
	},
	detectionStarted: null,
	detectionDropped: null
};

// Lock
function Lock(lockSelector, modelSettings, detector) {
	this.lockEl = $(lockSelector);
	this.modelSettings = modelSettings;
	this.detector = detector;
}
Lock.prototype = {
	lockEl: null,
	modelSettings: null,
	detector: null,
	start: function () {
		var self = this;
		var lock = function () {
			if (!self.detector.isDetectionActive) {
				self.drop();
				return;
			}
			var currentLock = self.lockEl.attr('value');
			if (currentLock < 1) {
				self.lockEl.attr('value', currentLock + 0.01);
				window.setTimeout(lock, self.modelSettings.lockRadarRate);
			}
			else {
				self.drop();
			}
		};
		lock();
	},
	drop: function () {
		this.lockEl.attr('value', 0.0);
	}
};

// Control surface for model operations
function ControlSurface(modelSettings, targetsControl, camera, sight, detector, lock) {
	this.modelSettings = modelSettings;
	this.targetsControl = targetsControl;
	this.camera = camera;
	this.sight = sight;
	this.detector = detector;
	this.lock = lock;
}
ControlSurface.prototype = {
	targetsControl: null,
	modelSettings: null,
	camera: null,
	sight: null,
	detector: null,
	lock: null,
	start: function () {
		this.targetsControl.setNumberOfTargets(this.modelSettings.numberOfTargets);
		this.targetsControl.startAll();
		this.camera.on();
		this.sight.on();
	},
	stop: function () {
		this.detector.off();
		this.camera.off();
		this.targetsControl.stopAll();
		this.sight.off();
	},
	release: function () {
		this.detector.release();
	},
	setTargetRate: function (rate) {
		this.modelSettings.targetRate = rate;
	},
	setTargetSpeed: function (speed) {
		this.modelSettings.targetSpeed = speed;
	},
	setAllowedError: function (errorMargin) {
		this.modelSettings.allowedError = errorMargin;
	},
	setDetectionRate: function (rate) {
		this.modelSettings.detectionRate = rate;
	},
	setNumberOfTargets: function (number) {
		this.modelSettings.numberOfTargets = number;
		this.targetsControl.targets.removeClass('real-object');
		for (var i = 0; i < number; i++) {
			$(this.targetsControl.targets[i]).addClass('real-object');
		}
	},
	detectorOn: null,
	detectorOff: null
};

function TargetDetectionModel(cameraSel, targetsSel, sightSel, lockSel) {
	this.modelSettings = {
			switchOnSpeed: 50,
			targetSpeed: 5,
			targetRate: 50,
			cameraMargin: 32,
			allowedError: 3,
			detectionRate: 50,
			lockRadarRate: 200,
			numberOfTargets: 1
		};
	this.camera = new Camera(cameraSel, this.modelSettings);
	this.targetsControl = new TargetsControl(targetsSel, this.modelSettings, this.camera);
	this.sight = new Sight(sightSel, this.camera, this.modelSettings);
	this.detector = new Detector(this.modelSettings, this.sight, this.camera);
	this.lock = new Lock(lockSel, this.modelSettings, this.detector);
	var self = this;
	this.sight.targetInSight = function () { self.detector.on(); };
	this.detector.detectionStarted = function () { 
		self.lock.start(); 
		if(self.controlSurface.detectorOn){
			self.controlSurface.detectorOn();
		}
	};
	this.detector.detectionDropped = function () { 
		self.lock.drop(); 
		if (self.controlSurface.detectorOff){
			self.controlSurface.detectorOff();
		}
	};
}
TargetDetectionModel.prototype = {
	modelSettings: null,
	camera: null,
	targetsControl: null,
	sight: null,
	detector: null,
	lock: null,
	controlSurface: null,
	getControlSurface: function () {
		this.controlSurface = new ControlSurface(this.modelSettings, this.targetsControl, this.camera, this.sight, this.detector, this.lock);
		return this.controlSurface;
	}
};
	
	function Swipe(param,param1){
		this.leftCallback = param;
		this.rightCallback = param1;
	}
	Swipe.prototype.temp = {
		"startPageX" : '',
		"startPageY" : ''
	}
	Swipe.prototype.start = function(){
		var e = arguments[0];
		e.preventDefault();
		this.temp.startPageX = e.changedTouches[0].pageX;
		this.temp.startPageY = e.changedTouches[0].pageY;
	}
	Swipe.prototype.end = function(){
		var e = arguments[0];
		e.preventDefault();
		if(Math.abs(e.changedTouches[0].pageY - this.temp.startPageY) > 50 || Math.abs(e.changedTouches[0].pageX - this.temp.startPageX) < 20){
			return;
		}
		if(e.changedTouches[0].pageX - this.temp.startPageX > 0){
			this.swipeRight();//����
		}else{
			this.swipeLeft();//����
		}
	}
	Swipe.prototype.swipeLeft = function(){
		if(this.leftCallback)this.leftCallback();
	}
	Swipe.prototype.swipeRight = function(){
		if(this.rightCallback)this.rightCallback();
	}
	Swipe.prototype.swipe = function($ele){
		$ele.addEventListener("touchstart",a.start.bind(a),false);
		$ele.addEventListener("touchend",a.end.bind(a),false);
	}
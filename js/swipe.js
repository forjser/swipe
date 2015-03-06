	
	function Swipe(callback){
		if(!arguments.length) return;
		this.leftCallback = callback.leftCallback ? callback.leftCallback : null;
		this.rightCallback = callback.rightCallback ? callback.rightCallback : null;
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
			this.swipeRight();//向右
		}else{
			this.swipeLeft();//向左
		}
	}
	Swipe.prototype.swipeLeft = function(){
		if(this.leftCallback)this.leftCallback();
	}
	Swipe.prototype.swipeRight = function(){
		if(this.rightCallback)this.rightCallback();
	}
	Swipe.prototype.swipe = function($ele,self){
		$ele.addEventListener("touchstart",self.start.bind(self),false);
		$ele.addEventListener("touchend",self.end.bind(self),false);
	}
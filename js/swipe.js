	/**
	 *  https://github.com/thebeautyoflove/swipe
	 *  
	 */
	
	var liu = (function(){
		var L={};
		var Y;
		var temp = {
			"startPageX" : '',
			"startPageY" : '',
			"movePageX" : '',
			"movePageY" : '',
			"startTime" : '',
			"endTime" : ''
		};
		var timer;
		var longtimer;
		var getId = function(param){
			return param.slice(1);
		}
		var hasJquery = function(){
			var jQuery = window.jQuery;
			return !!jQuery;
		}
		Y = function(dom){
			dom = hasJquery() ? [jQuery(dom)] : [document.getElementById(getId(dom))];
			dom.__proto__ = Y.fn;
			return dom;
		}
		Y.fn = {
			on : function(eventname,callback){
				if(!hasJquery()){
					for(var i=0;i<this.length;i++){
						addEvent.call(this[i],this,eventname,false,callback);
					}
				}else{
					for(var i=0;i<this[0].length;i++){
						addEvent.call(this[0][i],this[0].eq(i),eventname,false,callback);
					}
				}
			}
		}
		
		var addEvent = function(context,eventname,boolen,callback){
			switch(eventname){
				case "swipe" : this.addEventListener('touchstart',s_start.bind(context),boolen);
								this.addEventListener('touchend',s_end(callback).bind(context),boolen);
								break;
				case "tap" : this.addEventListener('touchstart',tap_start(callback).bind(context),boolen);
								this.addEventListener('touchmove',tap_move.bind(context),boolen);
								this.addEventListener('touchend',tap_end(callback).bind(context),boolen);
								break;
				default : log('event error');
			}
		}
		
		function log(param){
			console.log(param);
		}
		/*通用开始函数*/
		
		function setStartCoordinate(e){
			e.preventDefault();
			temp.movePageX = temp.startPageX = e.changedTouches[0].pageX;
			temp.movePageY = temp.startPageY = e.changedTouches[0].pageY;
		}
		
		/*tap开始*/
		var tap_start = function(callback){
			return function(){
				var e = arguments[0];
				var self = this;
				setStartCoordinate(e);
				var date = new Date();
				temp.startTime = date.getTime();
				longtimer = setInterval(function(){
					doEvent.call(self,callback,e,'tap',false);
				},100)
			}
		}
		
		function tap_move(callback){
			var e = arguments[0];
			temp.movePageX = e.changedTouches[0].pageX;
			temp.movePageY = e.changedTouches[0].pageY;
			doEvent.call(this,callback,e,'tap_move',false);
		}
		
		var tap_end = function(callback){
			return function(){
				var e = arguments[0];
				clearInterval(longtimer);
				var self = this;
				doEvent.call(self,callback,e,'tap',true);
			}
		}
		/*tap结束*/
		
		/*swipe开始*/
		function s_start(){
			var e = arguments[0];
			setStartCoordinate(e);
		}
		var s_end = function(callback){
			return function(){
				var e = arguments[0];
				e.preventDefault();
				doEvent.call(this,callback,e,'swipe');
			}
		}
		/*swipe结束*/
		
		function tapIsTrue(){
			if(Math.abs(temp.movePageY - temp.startPageY) > 10 || Math.abs(temp.movePageX - temp.startPageX) > 10){
				return;
			}
		}
		
		function doEvent(callback,e,order){
			switch(arguments[2]){
				case 'swipe' : 
					if(Math.abs(e.changedTouches[0].pageY - temp.startPageY) > 50 || Math.abs(e.changedTouches[0].pageX - temp.startPageX) < 20){
						return;
					}
					if(e.changedTouches[0].pageX - temp.startPageX > 0){
						if(callback.rightCallback)return callback.rightCallback.call(this);
					}else{
						if(callback.leftCallback)return callback.leftCallback.call(this);
					}
					break;
				case 'tap' : 
					var date = new Date();
					temp.endTime = date.getTime();
					var dateins = temp.endTime - temp.startTime;
					if(dateins/1000 > 1 && !arguments[3]){
						tapIsTrue();
						clearInterval(longtimer);
						if(callback.longCallback)return callback.longCallback.call(this);
					}
					if(dateins<100 && arguments[3]){
						tapIsTrue();
						clearInterval(longtimer);
						if(callback.shortCallback)return callback.shortCallback.call(this);
					}
					break;
				case 'tap_move' :
					tapIsTrue();
					clearInterval(longtimer);
					break;
				default : log('event error');
			}
		}
		return Y;
	})();
	window.liu = liu;
	window.Y === undefined && (window.Y = liu);
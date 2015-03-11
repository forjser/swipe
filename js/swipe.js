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
								this.addEventListener('touchend',tap_end(callback).bind(context),boolen);
								break;
				default : log('event error');
			}
		}
		
		function log(param){
			console.log(param);
		}
		/*通用开始函数*/
		
		function start(e){
			e.preventDefault();
			var date = new Date();
			temp.startTime = date.getTime();
			temp.startPageX = e.changedTouches[0].pageX;
			temp.startPageY = e.changedTouches[0].pageY;
		}
		
		/*tap开始*/
		var tap_start = function(callback){
			return function(){
				var e = arguments[0];
				start(e);
				var self = this;
				longtimer = setInterval(function(){
					doEvent.call(self,callback,e,'tap',false);
				},100)
			}
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
			e.preventDefault();
			temp.startPageX = e.changedTouches[0].pageX;
			temp.startPageY = e.changedTouches[0].pageY;
		}
		var s_end = function(callback){
			return function(){
				var e = arguments[0];
				e.preventDefault();
				doEvent.call(this,callback,e,'swipe');
			}
		}
		/*swipe结束*/
		
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
						if(Math.abs(e.changedTouches[0].pageY - temp.startPageY) < 10 && Math.abs(e.changedTouches[0].pageX - temp.startPageX) < 10){
							clearInterval(longtimer);
							//console.log("结束Y："+e.changedTouches[0].pageY+"结束X："+e.changedTouches[0].pageX+"开始y："+temp.startPageY+"开始x："+temp.startPageX)
							if(callback.longCallback)return callback.longCallback.call(this);
						}
					}
					if(dateins<100 && arguments[3]){
						if(Math.abs(e.changedTouches[0].pageY - temp.startPageY) < 10 && Math.abs(e.changedTouches[0].pageX - temp.startPageX) < 10){
							clearInterval(longtimer);
							if(callback.shortCallback)return callback.shortCallback.call(this);
						}
					}
					break;
				default : log('event error');
			}
			
		}
		return Y;
	})();
	window.liu = liu;
	window.Y === undefined && (window.Y = liu);
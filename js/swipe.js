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
					this.callback = {
						leftCallback : callback.leftCallback,
						rightCallback : callback.rightCallback,
						longCallback : callback.longCallback,
						shortCallback : callback.shortCallback
					}
					for(var i=0;i<this.length;i++){
						addEvent.call(this[i],this,eventname,false);
					}
				}else{
					for(var i=0;i<this[0].length;i++){
						this[0].eq(i)[0].callback = {
							leftCallback : callback.leftCallback,
							rightCallback : callback.rightCallback,
							longCallback : callback.longCallback,
							shortCallback : callback.shortCallback
						};
						addEvent.call(this[0][i],this[0].eq(i),eventname,false);
					}
				}
			}
		}
		function addEvent(context,eventname,boolen){
			switch(eventname){
				case "swipe" : this.addEventListener('touchstart',s_start.bind(context),boolen);
								this.addEventListener('touchend',s_end.bind(context),boolen);
								break;
				case "tap" : this.addEventListener('touchstart',tap_start.bind(context),boolen);
								this.addEventListener('touchend',tap_end.bind(context),boolen);
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
		function tap_start(){
			var e = arguments[0];
			start(e);
			var self = this;
			longtimer = setInterval(function(){
				doEvent.call(self,e,'tap',false);
			},100)
		}
		function tap_end(){
			var e = arguments[0];
			clearInterval(longtimer);
			var self = this;
			doEvent.call(self,e,'tap',true);
		}
		/*tap结束*/
		
		/*swipe开始*/
		function s_start(){
			var e = arguments[0];
			e.preventDefault();
			temp.startPageX = e.changedTouches[0].pageX;
			temp.startPageY = e.changedTouches[0].pageY;
		}
		function s_end(){
			var e = arguments[0];
			e.preventDefault();
			doEvent.call(this,e,'swipe');
		}
		/*swipe结束*/
		
		function doEvent(e,order){
			var bindobj = hasJquery() ? this[0] : this;
			switch(arguments[1]){
				case 'swipe' : 
					if(Math.abs(e.changedTouches[0].pageY - temp.startPageY) > 50 || Math.abs(e.changedTouches[0].pageX - temp.startPageX) < 20){
						return;
					}
					if(e.changedTouches[0].pageX - temp.startPageX > 0){
						if(bindobj.callback.rightCallback)return bindobj.callback.rightCallback.call(this);//向右
					}else{
						if(bindobj.callback.leftCallback)return bindobj.callback.leftCallback.call(this);//向左
					}
					break;
				case 'tap' : 
					var date = new Date();
					temp.endTime = date.getTime();
					var dateins = temp.endTime - temp.startTime;
					if(dateins/1000 > 1 && !arguments[2]){
						if(Math.abs(e.changedTouches[0].pageY - temp.startPageY) < 20 || Math.abs(e.changedTouches[0].pageX - temp.startPageX) < 20){
							if(bindobj.callback.longCallback){
								clearInterval(longtimer);
								return bindobj.callback.longCallback.call(this);
							}
						}
					}
					if(dateins<100 && arguments[2]){
						if(Math.abs(e.changedTouches[0].pageY - temp.startPageY) < 20 || Math.abs(e.changedTouches[0].pageX - temp.startPageX) < 20){
							if(bindobj.callback.shortCallback){
								clearInterval(longtimer);
								return bindobj.callback.shortCallback.call(this);
							}
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
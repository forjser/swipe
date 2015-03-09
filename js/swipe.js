	var liu = (function(){
		var L={};
		var Y;
		var temp = {
			"startPageX" : '',
			"startPageY" : ''
		};
		var leftCallback;
		var rightCallback;
		L.fn = {
			on : function(eventname,callback){
				leftCallback = callback.leftCallback || null;
				rightCallback = callback.rightCallback || null;
				for(var i=0;i<this[0].length;i++){
					if(!hasJquery()){
						addEvent.call(this[i],this,eventname,false);
					}else{
						addEvent.call(this[0][i],this[0].eq(i),eventname,false);
					}
				}
			}
		}
		function addEvent(context,eventname,boolen){
			switch(eventname){
				case "swipe" : this.addEventListener('touchstart',t_start.bind(context),boolen);
								this.addEventListener('touchend',t_end.bind(context),boolen);
								break;
				default : log('event error');
			}
		}
		function log(param){
			console.log(param);
		}
		function t_start(){
			var e = arguments[0];
			e.preventDefault();
			temp.startPageX = e.changedTouches[0].pageX;
			temp.startPageY = e.changedTouches[0].pageY;
		}
		function t_end(){
			var e = arguments[0];
			e.preventDefault();
			doEvent.call(this,e);
		}
		function doEvent(e){
			if(Math.abs(e.changedTouches[0].pageY - temp.startPageY) > 50 || Math.abs(e.changedTouches[0].pageX - temp.startPageX) < 20){
				return;
			}
			if(e.changedTouches[0].pageX - temp.startPageX > 0){
				if(rightCallback)return rightCallback.call(this);//向右
			}else{
				if(leftCallback)return leftCallback.call(this);//向左
			}
		}
		var getId = function(param){
			return param.slice(1);
		}
		var hasJquery = function(){
			var jQuery = window.jQuery;
			return !!jQuery;
		}
		Y = function(dom){
			dom = hasJquery() ? [jQuery(dom)] : [document.getElementById(getId(dom))];
			dom.__proto__ = L.fn;
			return dom;
		}
		return Y;
	})();
	window.liu = liu;
	window.Y === undefined && (window.Y = liu);
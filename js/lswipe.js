		var liu = (function(){
			var L={};
			var Y;
			var event = "click swipeLeft".split(" ");
			L.fn = {
				log : function(){console.log('test_l');},
				error : function(){console.log('error');},
				on : function(eventname,callback){
					this.leftCallback = callback.leftCallback ? callback.leftCallback : null;
					this.rightCallback = callback.rightCallback ? callback.rightCallback : null;
					for(var i=0;i<this.length;i++){
						this.addEvent(this,this[i],eventname,callback,false);
					}
				},
				addEvent : function(self,context,eventname,callback,boolen){
					switch(eventname){
						case "swipe" : context.addEventListener('touchstart',this.tstart.bind(self),boolen);
										context.addEventListener('touchend',this.tend.bind(self),boolen);
										break;
						default : self.error();
					}
				},
				tstart : function(){
					var e = arguments[0];
					e.preventDefault();
					this.temp.startPageX = e.changedTouches[0].pageX;
					this.temp.startPageY = e.changedTouches[0].pageY;
				},
				tend : function(){
					var e = arguments[0];
					e.preventDefault();
					if(Math.abs(e.changedTouches[0].pageY - this.temp.startPageY) > 50 || Math.abs(e.changedTouches[0].pageX - this.temp.startPageX) < 20){
						return;
					}
					if(e.changedTouches[0].pageX - this.temp.startPageX > 0){
						console.log('向右');
						this.rightCallback();//向右
					}else{
						console.log('向左');
						this.leftCallback();//向左
					}
				}
			}
			L.fn.temp = {
				"startPageX" : '',
				"startPageY" : '',
				"leftCallback" : '',
				"rightCallback" : ''
			}
			L.Z = function(dom, selector) {
				dom = [document.getElementById(dom)];
				dom.__proto__ = L.fn;
				return dom;
			}
			L.init = function(selector, context){
				return L.Z(selector, context)
			}
			Y = function(selector, context){
				return L.init(selector, context);
			}
			return Y;
		})();
		window.liu = liu;
		window.Y === undefined && (window.Y = liu);
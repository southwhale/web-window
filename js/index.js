
Array.prototype.check=function(a){
		for(var i=0;i<this.length;i++){
			if(a==this[i]){
				return true;
			}
		}
		return false;
	}
	Array.prototype.remove=function(a){
		for(var i=0;i<this.length;i++){
			if(a==this[i]){
				this.splice(i,1);
				break;
			}
		}
		return this;
	}
//全局变量
var mytips, a, canvas, ctx, ctx_tip,running=[],appdata=null,qp;

//app数据获取
$.getJSON("appList/appList.json",appdata,function(data){
	var f = function(){
		$('.loading-file').text('加载完成');
		$('#main').css('background-image','url(img/img0.jpg)');
        setTimeout(function () {
            $(".loading").addClass('hide');
            setTimeout(function () {
                $(".loading").css('display','none');
                $('.spinner').css('animation','none');
				$('.spinner').css('-webkit-animation','none');
            },1000)
            loadWin();
        },2000);
	};
	appdata=data;
	for(var i = 0;i < data.length; i ++){
		var app = data[i];
        $(".windows").find("ul").append('<li>\n' +
            '\t\t\t\t\t\t<a href="javascript:;" app-id="'+ app.appId + '" app-index="'+ i +'">\n' +
            '\t\t\t\t\t\t\t<div data-url="url('+ app.img +')" style="background-image:url('+ app.img +')"></div>\n' +
            '\t\t\t\t\t\t\t<p>'+ app.name +'</p>\n' +
            '\t\t\t\t\t\t</a>\n' +
            '\t\t\t\t\t</li>')
	}
	loadImage(["img/img0.jpg","img/recycle_full.png","img/recycle.png","img/shuihu.png","img/text_edit.png","img/tm.png"],f);
});


//数字频繁增加器
var numInter;
function numUp(ele,num){
	var start = parseInt(ele.text());
	clearInterval(numInter);
	numInter = setInterval(function(){
		if(start < num){
			start +=2;
			ele.text(start + '%');
		} else{
			clearInterval(numInter);
		}
	},5)

}

//图片懒加载器
function loadImage(arr,callback) {
		var f = function (i) {
			$('.loading-file').text('正在加载图片\t\t' + arr[i]);
			$('.loading-bar .bar').css('width',(i+1)/arr.length * 100 + '%');
			numUp($('.loading-bar span'),parseInt((i+1)/arr.length * 100));
            var img = new Image();
            img.src = arr[i];
            if(i < arr.length - 1){
            	i++
			}else{
            	callback();
            	return;
			}
            if(img.complete){
				f(i)
            }else{
            	img.onload = function (ev) {
            		f(i);
				}
			}
        };
		f(0)
}
//windows桌面加载
function loadWin(){
//	document.onclick = function(){
//		launchFullscreen(document.documentElement);
//	}

//	时间定时器
    setInterval(function(){
        var dates=new Date();
        $(".win-datetime p").eq(0).text(dates.getHours()+":"+(dates.getMinutes()<10?("0"+dates.getMinutes()):dates.getMinutes()));
        $(".win-datetime p").eq(1).text(dates.getYear()+1900+"/"+(dates.getMonth()+1)+"/"+dates.getDate());
    },1000);
    if(window.location.href.indexOf("file://")!=-1){
		$("body").append('<div style="width: 100%;height:100%;position: absolute;z-index: 9999999;background: rgba(0,0,0,.4);top: 0;left: 0"><div style="position: relative;top: 50%;left: 50%;transform: translate(-50%,-50%);width: 300px;height: 100px;border: 1px solid #cccccc;background: #fff;"><div style="width: 100%;height: 25px;line-height: 25px;background: #A8C7F0;">error</div><p>请用服务器启动本文件</p></div></div>');
		return;
	}
	$(window).resize(function() {
		$("canvas").attr({
			"width": $("body").width() + "px",
			"height": $("body").height() + "px"
		});
	})
	$("canvas").attr({
		"width": $("body").width() + "px",
		"height": $("body").height() + "px"
	});
	drawInit(); //初始化
	//刷新
	$("#clear").click(function() {
		$('#win-menu').hide();
	})
	//失去焦点操作
	$("#win-menu").mousedown(function(e){
		var event=window.event || e;
		event.stopPropagation();
	});
	$(document).on('touchmove',function () {
		event.preventDefault();
    })
	$(".windows>ul").on('dblclick touchend','a',function() {
		var index = $(this).parent().index();
        if(running.check(appdata[index].appId)){
        	if($('.my_win[app-id="'+ appdata[index].appId +'"]').css('display') == 'none'){
	        	$('.win-task-app[app-id="'+ appdata[index].appId +'"]').trigger('mousedown');
	        	$('.win-task-app[app-id="'+ appdata[index].appId +'"]').trigger('mouseup');
        	}else{
        		$('.my_win[app-id="'+ appdata[index].appId +'"]').trigger('mousedown');
        		$('.my_win[app-id="'+ appdata[index].appId +'"]').trigger('mouseup');
        	}
			return;
		}
		createWin(appdata[index]);
	});
	//右键菜单的按下
	$("body").delegate('#win-menu', 'mousedown touchstart', function(e) {
		var event=window.event ||e;
		event.stopPropagation();
		event.preventDefault();
	})
		//右键菜单的弹起
	$(".mydiv").delegate('#win-menu', 'mouseup touchend', function(e) {
		var event=window.event ||e;
		event.stopPropagation();
		event.isPropagationStopped();
		shadowHide();
	})
		//win窗口的鼠标按下
	$("body").delegate('.my_win', 'mousedown touchstart', function(e) {
		var event=window.event ||e;
		event.stopPropagation();
		event.preventDefault();
	})
		//win窗口的鼠标弹起
	$("body").delegate('.my_win', 'mouseup touchend', function(e) {
		var event=window.event ||e;
		if(event.button==0){
			return;
		}
		event.stopPropagation();
		event.preventDefault();
		$(window).off('mousemove touchmove');
	})
		//win窗口的双击
	$("body").delegate('.win-head', 'dblclick', function(e) {
		var event=window.event ||e;
		event.stopPropagation();
		event.preventDefault();
		winMax(this);
	});
	$("body").delegate('.win-btn','dblclick ',function(e){
		var event=window.event ||e;
		event.stopPropagation();
	})
	$("body").delegate('.win-btn','mousedown touchstart',function(e){
		var event=window.event ||e;
		event.stopPropagation();
	})
	//win窗口的拖动
	$("body").delegate('.win-head', 'mousedown', function(e){
		var event=window.event ||e;
		if(event.button == 0) {
			$(".my_win").css("transition","0");
			lostFocus();
			var ele = $(this);
			var tempx = event.pageX;
			var tempy = event.pageY;
			var lefts = parseInt($(this).parent().css('left'));
			var tops = parseInt($(this).parent().css('top'));
			var state = false;
			var move;
			$(window).mousemove(function(e){
				$(".my_win").css("transition","0");
				var event=window.event ||e;
				if(ele.parent().is(".max")) {
					ele.parent().removeClass('max');
					lefts = (function() {
						if($("body").width() - tempx < ele.parent().width() / 2) {
							return $("body").width() - ele.parent().width();
						} else if(tempx < ele.parent().width() / 2) {
							return lefts;
						} else {
							return tempx - ele.width() / 2;
						}
					})();
				}
				if(event.pageY <= 0 && !state) {
					ele.parent().before('<div class="premax"></div>');
					state = true;
				}
				if(parseInt(ele.parent().css("top")) > 10) {
					ele.parent().prev('.premax').remove();
					state=false;
				}
				var result = {
					top : (function() {
						//顶端处理
						if(event.pageY - tempy + tops < 0) {
							return 0;
						}
						if(event.pageY - tempy + tops-$("body").height()>=-30) {
							return $("body").height() - 30;
						}
						return event.pageY - tempy + tops
					})(),
					left: (event.pageX - tempx + lefts)>$("body").width()-2?$("body").width()-2:(event.pageX - tempx + lefts<2-ele.parent(".my_win").width()?2-ele.parent(".my_win").width():event.pageX - tempx + lefts)
				}
				ele.parent(".my_win").css({
					left : result.left +'px',
					top: result.top + 'px'
				})
			});
			$(window).off('mouseup');
			$(window).mouseup(function(e) {
				var event=window.event ||e;
				$(".premax").remove();
				if(parseInt(ele.parent().css('top')) == 0 && event.pageY <= 0) {
					winMax(ele);
				}
				$(window).off('mousemove');
			})
				//				$("body").off('mouseup');
				//				$("body").mouseup(function(){
				//					
				//				})
		}
	});
	//禁用右键菜单
	document.oncontextmenu = function() {
		return false;
	}
	$('.app-list').on('touchend','.win-btn span',function () {
		var index= $(this).index();
		this.onclick();
    })
		//整个页面的按下
	$("body").mousedown(function(e){
		$("#win-menu").hide();
	});
	$(".windows a").focus(function(){
		$(this).addClass('current');
	})
	$(".windows a").blur(function(){
		$(this).removeClass('current');
	})
	$("body").mousedown(function(e){
		var event=window.event||e;
		event.stopPropagation();
		event.preventDefault();
		$(".windows a").removeClass('current');
	})
	$(".mydiv").mousedown(function(e){
		var event=window.event ||e;
		event.stopPropagation();
		$(".windows a").removeClass('current');
		var tempx = -1,
			tempy = -1;
		var btn = -1;
		//左键按下记录此位置
		if(event.button == 0) {
			$('#win-menu').css('display', 'none');
		}
		if(event.button == 0 && $('#win-menu').css('display') == 'none') {
			btn = 0;
			tempx = event.pageX;
			tempy = event.pageY;
			ctx_tip.fillStyle = "rgba(255,255,255,0.2)";
		}
		//右键按下
		if(event.button == 2) {}
		$(window).off('mousemove');
		$(window).mousemove(function(e) {
			var event=window.event||e;
			//右键
			if(btn == 2) {
				
			}
			if(btn == 0) {
				$('#mytips').css('z-index', '4');
				ctx_tip.clearRect(0, 0, 1900, 1080);
				$(".windows a").each(function(){
					if((function(a){
//						竖向
						var t_l={x:(tempx>event.pageX?event.pageX:tempx),y:(tempy>event.pageY?event.pageY:tempy)};
						var t_r={x:(tempx<event.pageX?event.pageX:tempx),y:(tempy>event.pageY?event.pageY:tempy)};
						var d_l={x:(tempx>event.pageX?event.pageX:tempx),y:(tempy<event.pageY?event.pageY:tempy)};
						var d_r={x:(tempx<event.pageX?event.pageX:tempx),y:(tempy<event.pageY?event.pageY:tempy)};
						if(t_l.x<$(a).offset().left && t_r.x>$(a).offset().left){
							if(t_l.y>$(a).offset().top && t_l.y<$(a).offset().top+$(a).height()){
								return true;
							}
							if(d_l.y>$(a).offset().top && d_l.y<$(a).offset().top+$(a).height()){
								return true;
							}
							if(t_l.y<=$(a).offset().top && d_l.y>=$(a).offset().top+$(a).height()){
								return true;
							}
						}
						if(t_l.x<$(a).offset().left+$(a).width() && t_r.x>$(a).offset().left+$(a).width()){
							if(t_l.y>$(a).offset().top && t_l.y<$(a).offset().top+$(a).height()){
								return true;
							}
							if(d_l.y>$(a).offset().top && d_l.y<$(a).offset().top+$(a).height()){
								return true;
							}
							if(t_l.y<=$(a).offset().top && d_l.y>=$(a).offset().top+$(a).height()){
								return true;
							}
						}
						if(t_l.x>$(a).offset().left && t_r.x<$(a).offset().left+$(a).width()){
							if(t_l.y>$(a).offset().top && t_l.y<$(a).offset().top+$(a).height()){
								return true;
							}
							if(d_l.y>$(a).offset().top && d_l.y<$(a).offset().top+$(a).height()){
								return true;
							}
							if(t_l.y<=$(a).offset().top && d_l.y>=$(a).offset().top+$(a).height()){
								return true;
							}
						}
						if(t_l.x<$(a).offset().left && t_l.y<$(a).offset().top && t_r.x>$(a).offset().left+$(a).width() && d_l.y>$(a).offset().top+$(a).height()){
							return true;
						}
						if(t_l.x>$(a).offset().left && t_l.y>$(a).offset().top && t_r.x<$(a).offset().left+$(a).width() && d_l.y<$(a).offset().top+$(a).height()){
							return true;
						}
						return false;
					})(this)){
						$(this).addClass('current');
					}else{
						$(this).removeClass('current');
					}
				});
				ctx_tip.fillRect(tempx, tempy, event.pageX - tempx, event.pageY - tempy);
			}
		});
		//整个页面的鼠标弹起
		$(window).off("mouseup");
		$(window).mouseup(function(e) {
			var event=window.event ||e;
			if(event.button == 0) {
				//阴影重置
				$(".premax").remove();
				shadowHide();
				$(window).off('mousemove');
				$("*").off('mousemove');
			}
			if(event.button == 2) {
				var x = event.pageX;
				var y = event.pageY;
				if(x + $("#win-menu").outerWidth() >= $("body").width()) {
					x -= $("#win-menu").outerWidth();
				}
				if(y + $("#win-menu").outerHeight() >= $("body").height()) {
					y -= $("#win-menu").outerHeight();
				}
				$('#win-menu').css({
					'left': x,
					'top': y
				})
				$('#win-menu').show();
			}
			$("#mytips").css('z-index', '0');
		});
	});
	//windows桌面的图标按下
	$(".windows a").mousedown(function(e) {
			var event=window.event ||e;
			if(event.button == 0) {
				event.stopPropagation();
			}
			if(event.button == 2) {
				event.stopPropagation();
				$("#win-menu").hide();
			}
	})
	//windows桌面的图标按下
	$(".windows a").mouseup(function(e) {
		var event=window.event ||e;
		event.stopPropagation();
	})
		//开始菜单的弹起
	$(".win-down").mouseup(function(e) {
		var event=window.event ||e;
		if(event.button==0){
			return;
		}
		event.stopPropagation();
	})
		//开始菜单的按下
	$(".win-down").mousedown(function(e) {
		var event=window.event ||e;
		if(event.button==0){
			return;
		}
		event.stopPropagation();
	})
	//进程悬停事件
	$(".win-task").delegate('.win-task-app','mouseover',function(){
		$(this).addClass('current');
	})
	//
	$(".win-task").delegate('.win-task-app','mouseleave',function(){
		$(this).removeClass('current');
	})
	//进程按下拖拽
	$(".win-task").delegate('.win-task-app','mousedown',function(e){
		var event=window.event || e;
		if(event.button!=0){
			return;
		}
		var state=false;
		$(this).addClass('down');
		var nowApp=$(this);
		var html=nowApp.clone();
		var tempx = event.pageX;
		var tempy = event.pageY;
		var yleft=nowApp.position().left;
		$(window).off('keydown');
		$(window).keydown(function(e){
			var event=window.event || e;
			if(event.which){
				$(window).trigger('mouseup');
				$(window).off('mouseup');
			}
		})
		$(window).off('mousemove');
		$(window).mousemove(function(e){
			var event=window.event || e;
			event.stopPropagation();
			if((event.pageX-tempx<=10 && event.pageX-tempx>0)|| (tempx-event.pageX<=10 && tempx-event.pageX>0)){
				return;
			}
			if(!state){
				html.css({
					"position":"absolute",
					"top":"-2px",
					"left":nowApp.position().left+60,
					"z-index":1,
					"height":nowApp.height()+"px"
					
				})
				html.addClass('temp-task');
				html.prependTo(".win-task");
			}
			state=true;
			nowApp.css("opacity",0);

			nowApp.css("left",event.pageX - tempx);
			html.css("left",event.pageX - tempx+yleft);
			$(".win-task-app").each(function(){
				if(nowApp!=$(this)){
					if($(this).position().left+$(this).width()/2>html.position().left && $(this).position().left<html.position().left){
						nowApp.insertBefore($(this));
					}else if($(this).position().left+$(this).width()/2<html.position().left+html.width() && html.position().left+html.width()<$(this).position().left+$(this).width()){
						nowApp.insertAfter($(this));
					}
				}
			});
		});
		$(window).off('mouseup');
		$(window).mouseup(function(e){
			var event=window.event || e;
			event.stopPropagation();
			$(window).off('mousemove');
			$('.win-task-app').removeClass('down');
			$('.win-task-app').css("left","0px");
			$('.win-task-app').css("opacity",1);
			$('.temp-task').remove();
			//进程点击事件
			if((tempx-event.pageX)*(tempx-event.pageX)<100&&(tempy-event.pageY)*(tempy-event.pageY)<100){
				var id=nowApp.attr("app-id");
				if($(".app-list> [app-id="+id+"].my_win").is(".my_win:last-child")){
					if($(".app-list> [app-id="+id+"].my_win").css("opacity")!="1" || $(".app-list> [app-id="+id+"].my_win").css("display")=="none"){
						$(".app-list> [app-id="+id+"].my_win").fadeIn(100);
						$(".app-list> [app-id="+id+"].my_win").insertAfter($(".my_win").last());
						return;
					}else{
						$(".app-list> [app-id="+id+"].my_win").fadeOut(100);
						setTimeout(function(){
							$(".app-list> [app-id="+id+"].my_win").insertBefore($(".my_win").first());
						},100)
						return;
					}
				}else{
					$(".app-list> [app-id="+id+"].my_win").fadeIn(100);
					$(".app-list> [app-id="+id+"].my_win").insertAfter($(".my_win").last());
					return;
				}
			}
		});
	})
	//焦点提前
	$(".app-list").delegate('.my_win','mousedown',function(){
		$(this).insertAfter($(".my_win").last());
	});
}
//			桌面失去焦点
function lostFocus() {
    $("#win-menu").hide();
}
//阴影重置
function shadowHide() {
    var temp = $("#mytips").clone();
    $("#mytips").remove();
    $('body').append(temp);
    drawInit();
}

//创建窗口
function createWin(app){
    running.push(app.appId);
    var html = '<div class="my_win" app-id="'+app.appId+'" style="display:block;width: '+ ( ($(window).width() - 40) > 600 ? 600 :($(window).width() - 40) )+'px" >' +
        '<div class="win-head">' +
        '<span style="background:url(' + app.img + ') no-repeat;background-size:auto 100%;">' + app.name + '</span>' +
        '<div class="win-btn">' +
        '<span style="background: #8ec831;" onclick="winMin(this)"></span>' +
        '<span style="background: #ffd348;" onclick="winMax(this)"></span>' +
        '<span style="background: #ed4646;" onclick="closed(this)"></span>' +
        '</div>' +
        '</div>' +
        '<div class="win-body">' +
        '<p>'+ app.content +'</p>'+
        '</div>' +
        '</div>';
    $(".app-list").append(html);
    $(".win-task").append('<div class="win-task-app" app-id="'+app.appId+'"><i style="background:-webkit-linear-gradient(top,rgba(255,255,255,1.2),rgba(255,255,255,0.9)) content-box,url('+app.img+') no-repeat;"></i><div style="background: url('+app.img+') no-repeat center content-box;background-size: auto 120%;" class="task-img"></div></div>');
    //禁用按钮的拖拽
    $(".win-btn span").off('mousedown');
    $(".win-btn span").mousedown(function(e) {
        var event=window.event || e;
        event.stopPropagation();
    });
}
//关闭窗口
function closed(now){
	var id=$(now).parents(".my_win").attr("app-id");
	running.remove(id);
	$(now).parents(".my_win").fadeOut(100);
	$(".win-task>[app-id="+id+"]div").remove();
	setTimeout(function(){
		$(now).parents(".my_win").remove();
	},100);
}
//最大化
function winMax(now){
	$(".my_win").css("transition","0.2s");
	setTimeout(function(){
		$(".my_win").css("transition","0s");
	},200);
	$(now).parents(".my_win").toggleClass('max');
}
//最小化
function winMin(now){
	$(now).parents(".my_win").fadeOut(100);
}
//初始化
function drawInit(){
	mytips = document.getElementById("mytips");
	ctx_tip = mytips.getContext('2d');
}

//全屏
function launchFullscreen(element) {
	if(qp){
		return;
	}
	document.onmouseover = function(){}
	qp = true;
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

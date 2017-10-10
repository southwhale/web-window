var running=[];
var Win=function(id){
//	this.aa=function(){
//		console.log('我是'+id);
//	}
	var appdata=[];//进程与数据
	$.getJSON("data.json",appdata,function(data){
			appdata=data;
	})
	var logo=$("[app-id="+id+"]a");
	var title=$("[app-id="+id+"]a").children("div").attr("data-url");
	var html = '<div class="my_win" app-id="'+id+'" style="display:block;">' +
			'<div class="win-head">' +
			'<span style="background:' + logo + ' no-repeat;background-size:auto 100%;">' + title + '</span>' +
			'<div class="win-btn">' +
			'<span style="background: #8ec831;" onclick="winMin(this)"></span>' +
			'<span style="background: #ffd348;" onclick="winMax(this)"></span>' +
			'<span style="background: #ed4646;" onclick="closed(this)"></span>' +
			'</div>' +
			'</div>' +
			'<div class="win-body">' +
			'</div>' +
			'</div>';
	this.createText=function(){
		$(html).find(".win-body").append('<p>'+eval('appdata.app'+id)+'</p>');
	}
}


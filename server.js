var express = require("express");


var http = require("http");

express()

.use(express.static("www"))


.get("/api",function(req,res){
	//console.log("接口被调用了");
	
	//对于跨域请求，浏览器没有直接拒绝，而是发送了这个请求，
	//当请求返回时，浏览器会检查本次响应中的
	//Access-Control-Allow-Origin字段，确认本次响应的数据
	//是否被允许跨域访问，如果允许，则会交给页面的js回调函数
	//如果不允许，则报错。
	
	
	//Access-Control-Allow-Origin的值，可以是*，表示允许
	//所有域名访问，也可以是多个域名，表示仅仅允许这几个域名
	//访问。
	res.set("Access-Control-Allow-Origin","*");
	
	res.send("这是请求返回的数据");
})




//浏览器限制跨域请求仅仅限制的是普通ajax请求，对于js文件并
//没有限制，所以可以把想要请求的数据放在一段js代码中，并通过
//<script>标签去访问这段代码。就能实现跨域请求。
.get("/jsonpAPI",function(req,res){
	
	console.log(req.query);
	
	res.jsonp({
		name:"sun",
		age:12
	});
})


//跨域请求限制只在浏览器中存在，其他任何程序都没有这个限制，
//所以可以通过一个中间服务器进行http请求转发，先从网页把请求
//发送给非跨域的服务器A，然后服务器A再将请求转发给真正要请求
//的跨域服务器B，当A接收到B的响应数据时，再把数据转发给页面。
.get("/kuaidi",function(req,res){
	http.get("http://www.kuaidi100.com/query?type="+
	req.query.type+
	"&postid="+
	req.query.postid,function(dres){
		var allData = "";
		dres.on("data",function(data){
			//console.log("收到数据了");
			allData+=data;
		});
		
		dres.on("end",function(){
			//console.log("数据接收完成了");
			
			res.set("Content-Type","application/json");
			
			res.json(JSON.parse(allData));
		});
	});
	
	
})


.listen(8080,function(){
	console.log("服务器已开启");
});

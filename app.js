var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var formidable = require('formidable');
var fs = require('fs');

app.set('view engine','ejs');
app.set('views',path.join(__dirname+'/views'));
app.use(express.static(path.join(__dirname,'/resources')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(morgan("combined"));
mongoose.connect('mongodb://localhost/shop');

var GoddessModel = require('./db').GoddessModel;
var EntityModel = require('./db').EntityModel;

app.get("/",function(req,res){
	var homeEntities = [];
	EntityModel.find({type:"bags"}).limit(2).exec(function(err,bags){
		if(err) return res.send("error happened...");
		else{
			bags.forEach(function(bag){
				console.log(bag);
				homeEntities.push({"thumbnail":bag.thumbnail,"type":bag.type,"style_no":bag.style_no});
			});
			EntityModel.find({type:"wallets"}).limit(2).exec(function(err,wallets){
				if(err) return res.send("error happened...");
				else{
					wallets.forEach(function(wallet){
						homeEntities.push({"thumbnail":wallet.thumbnail,"type":wallet.type,"style_no":wallet.style_no});
					});
					EntityModel.find({type:"accessories"}).limit(2).exec(function(err,accessories){
						if(err) return res.send("error happened...");
						else{
							accessories.forEach(function(accessory){
								homeEntities.push({"thumbnail":accessory.thumbnail,"type":accessory.type,"style_no":accessory.style_no});			
							});
							res.render("index",{"entities":homeEntities});
						}	
					});
				}
			});
		}
	});
});

app.get("/about",function(req,res){
	res.render("about");
});

app.get("/contact",function(req,res){
	res.render("contact");
});

app.get("/goddess",function(req,res){
	var pictures = [];
	GoddessModel.find({}).exec(function(err,goddesses){
		if(err) return res.send("error happened...");
		else{
			goddesses.forEach(function(goddess){
				pictures.push({"thumbnail":goddess.image_url,"source":goddess.image_url});
			});
			res.render("goddess",{"pictures":pictures});	
		}
	});
});




app.get("/collections/:mark",function(req,res){
	var mark = req.params.mark;
	var bags = [];
	var wallets = [];
	var accessories = [];
	EntityModel.find().exec(function(err,entities){
		if(err) return res.send("error happened...");
		else{
			entities.forEach(function(entity){
				if(entity.type=="bags") bags.push(entity);
				if(entity.type=="wallets") wallets.push(entity);
				if(entity.type=="accessories") accessories.push(entity);
				res.render("collections",{"bags":bags,"wallets":wallets,"accessories":accessories,"mark":mark});
			});
		}
	});
});

app.get("/design",function(req,res){
	res.render("design");
});

app.get('/design/edit',function(req,res){
	res.render("designEdit");
});


app.get("/collections_product/:type/:style_no",function(req,res){
	var type = req.params.type;
	var style_no = req.params.style_no;
	EntityModel.find({"type":type,"style_no":style_no}).exec(function(err,entities){
		if(entities!=0) res.render("collections_product",{"entity":entities[0],"type":type});	
		else res.send("err happened");
	});
});

app.get("/create/:type/:style_no/:title/:sub_title/:dimension/:price",function(req,res){
	var type = req.params.type;
	var style_no = req.params.style_no;
	var title = req.params.title;
	var sub_title = req.params.sub_title;
	var dimension = req.params.dimension;
	var price = req.params.price;
	EntityModel.find({"style_no":style_no}).exec(function(err,entity){
		if(err) return res.send("error happened...");
		if(entity!=0) return res.send(entity);
		else{
			var entityModel = new EntityModel({"type":type,"style_no":style_no,"title":title,"sub_title":sub_title,"dimension":dimension,"price":price});
			entityModel.save(function(err,model,count){
				if(err) return res.send("err happened");
				else{
					return res.send(model);
				}
			});
		}
	});
});

app.get("/add_thumbnail/:style_no/:image_url",function(req,res){
	var style_no = req.params.style_no;
	var image_url = "/images/collections/" + req.params.image_url;
	EntityModel.update({"style_no":style_no},{$set:{"thumbnail": image_url}},function(err){
      	if(err) return res.send("error happened...");
      	else res.send("success...");
    });
});

app.get("/add_detail_pictures/:style_no/:image_url",function(req,res){
	var style_no = req.params.style_no;
	var image_url = req.params.image_url;
	EntityModel.update({"style_no":style_no},{$push:{"detail_pictures":image_url}},function(err){
      	if(err) return res.send("error happened...");
      	else res.send("success...");
    });
});


app.post("/upload/:type",function(req,res){
	var type = req.params.type;
	var form = new formidable.IncomingForm();
	if(type=="goddess") form.uploadDir = "./resources/images/goddess";
	else if(type=="colletions") form.uploadDir = "./resources/images/collections";
	else if(type=="design") form.uploadDir = "./resources/images/design";
 	form.keepExtensions = true;
	form.on('file', function(field, file) {
        //rename the incoming file to the file's name
        fs.rename(file.path, form.uploadDir + "/" + file.name);
    })
    .on('error', function(err) {
        console.log("an error has occured with form upload");
        console.log(err);
        request.resume();
    })
    .on('aborted', function(err) {
        console.log("user aborted upload");
    })
    .on('end', function() {
        console.log('-> upload done');
    })
	.parse(req, function(err, fields, files) {
      	
    });
});

var server = app.listen(process.env.PORT || 18080, function() {
    console.log('App started listening on port %d', server.address().port);
});
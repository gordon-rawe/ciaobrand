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
var DesignModel = require('./db').DesignModel;

app.get("/",function(req,res){
	var homeEntities = [];
	EntityModel.find({type:"bags"}).limit(2).exec(function(err,bags){
		if(err) return res.send("error happened...");
		else{
			bags.forEach(function(bag){
				homeEntities.push({"id":bag._id,"thumbnail":bag.detail_pictures[0].url,"type":bag.type,"style_no":bag.style_no});
			});
			EntityModel.find({type:"wallets"}).limit(2).exec(function(err,wallets){
				if(err) return res.send("error happened...");
				else{
					wallets.forEach(function(wallet){
						homeEntities.push({"id":wallet._id,"thumbnail":wallet.detail_pictures[0].url,"type":wallet.type,"style_no":wallet.style_no});
					});
					EntityModel.find({type:"accessories"}).limit(2).exec(function(err,accessories){
						if(err) return res.send("error happened...");
						else{
							accessories.forEach(function(accessory){
								homeEntities.push({"id":accessory._id,"thumbnail":accessory.detail_pictures[0].url,"type":accessory.type,"style_no":accessory.style_no});			
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

app.get("/goddess/edit",function(req,res){
	var pictures = [];
	GoddessModel.find({}).exec(function(err,goddesses){
		if(err) return res.send("error happened...");
		else{
			goddesses.forEach(function(goddess){
				pictures.push({"thumbnail":goddess.image_url,"source":goddess.image_url});
			});
			res.render("goddess_edit",{"pictures":pictures});
		}
	});
});

app.get("/collections/:mark",function(req,res){
	var mark = req.params.mark;
	if(mark=="edit"||mark=="delete") return req.next();
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
			});
			res.render("collections",{"bags":bags,"wallets":wallets,"accessories":accessories,"mark":mark});
		}
	});
});

app.get("/collections/delete/:id",function(req,res){
	var id = req.params.id;
	EntityModel.remove({"_id":id},function(err){
		if(err) return res.send("error happened...");
		else{
			res.redirect("/collections/edit");
		}
	});
});

app.get("/collections/edit",function(req,res){
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
			});
			res.render("collections_edit",{"bags":bags,"wallets":wallets,"accessories":accessories});
		}
	});
});

app.post("/collection/add",function(req,res){
	var type = req.body.type;
	var style_no = req.body.style_no;
	var title = req.body.title;
	var sub_title = req.body.sub_title;
	var dimension = req.body.dimension;
	var price = req.body.price;
	var entityModel = new EntityModel({"style_no":style_no,"title":title,"sub_title":sub_title,"dimension":dimension,"price":price,"type":type});
	entityModel.save(function(err,entity,count){
		if(err) return res.send("error happened...");
		else{
			EntityModel.update({"_id":entity._id},{$push:{"detail_pictures":{"url":"@images@collections@default.jpg"}}},function(err){
				if(err) return res.send("err happened");
				else{
					return res.redirect("/collections/edit");
				}
			});
			
		}
	});
});

app.get("/design",function(req,res){
	DesignModel.find({}).exec(function(err,models){
		if(err) return res.send("error happened...");
		else{
			res.render("design",{"models":models});
		}
	});
});

app.get('/design/edit',function(req,res){
	DesignModel.find({}).exec(function(err,models){
		if(err) return res.send("error happened...");
		else{
			res.render("design_edit",{"models":models});
		}
	});
});

app.get("/design/delete/:index",function(req,res){
	var index = req.params.index;
	DesignModel.remove({"index":index},function(err){
		if(err) return res.send("error happened...");
		else{
			res.redirect("/design/edit");
		}
	});
});

app.get("/collections_product/:id",function(req,res){
	var id = req.params.id;
	if(id=="edit") return req.next();
	EntityModel.find({"_id":id}).exec(function(err,entities){
		console.log(entities);
		if(entities!=0) res.render("collections_product",{"entity":entities[0],"type":entities[0].type});	
		else res.send("err happened");
	});
});

app.get("/collections_product/edit/:id",function(req,res){
	var id = req.params.id;
	EntityModel.find({"_id":id}).exec(function(err,entities){
		if(entities!=0) res.render("collections_product_edit",{"entity":entities[0],"type":entities[0].type});	
		else res.send("err happened");
	});
});

app.get("/collections_product/delete/:imgurl/:id",function(req,res){
	var imgurl = req.params.imgurl;
	var id = req.params.id;
	EntityModel.update({"_id":id},{$pull:{"detail_pictures":{"url":"@images@collections@"+imgurl}}},function(err){
		if(err) res.send(err);
		else{
			res.redirect("/collections_product/edit/"+id);
		}
	});
});

app.post("/upload/design",function(req,res){
	var form = new formidable.IncomingForm();
	form.uploadDir = "./resources/images/design";
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
		DesignModel.find({}).sort("-index").limit(1).exec(function(err,model){
			if(err) res.send("err happened...");
			else{
				var t = 0;
				if(model!=0) t = model[0].index+1; 
				var designModel = new DesignModel({"image_url":"/images/design/"+files.picture.name,"index":t});
				designModel.save(function(err,model,count){
					if(err) res.send("err happened...");
					else{
						res.redirect("/design/edit");
					}
				});
			}
		});
    });
});

app.post("/upload/goddess",function(req,res){
	var form = new formidable.IncomingForm();
	form.uploadDir = "./resources/images/goddess";
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
		GoddessModel.find({}).sort("-index").limit(1).exec(function(err,model){
			if(err) res.send("err happened...");
			else{
				var t = 0;
				if(model!=0) t = model[0].index+1; 
				var godessModel = new GoddessModel({"image_url":"/images/goddess/"+files.picture.name,"index":t});
				godessModel.save(function(err,model,count){
					if(err) res.send("err happened...");
					else{
						res.redirect("/goddess/edit");
					}
				});
			}
		});
    });
});

app.post("/upload/collections/:id",function(req,res){
	var id = req.params.id;
	var form = new formidable.IncomingForm();
	form.uploadDir = "./resources/images/collections";
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
		EntityModel.update({"_id":id},{$push:{"detail_pictures":{"url":"@images@collections@"+files.picture.name}}},function(err){
			if(err) res.send("err happened...");
			else{
				res.redirect("/collections_product/edit/"+id);
			}
		});
    });
});

var server = app.listen(process.env.PORT || 18080, function() {
    console.log('App started listening on port %d', server.address().port);
});
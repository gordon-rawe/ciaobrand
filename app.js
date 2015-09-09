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

app.get("/goddess/edit",function(req,res){
	var pictures = [];
	GoddessModel.find({}).exec(function(err,goddesses){
		if(err) return res.send("error happened...");
		else{
			goddesses.forEach(function(goddess){
				pictures.push({"thumbnail":goddess.image_url,"source":goddess.image_url});
			});
			res.render("goddessEdit",{"pictures":pictures});
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
			});
			console.log({"bags":bags,"wallets":wallets,"accessories":accessories,"mark":mark});
			res.render("collections",{"bags":bags,"wallets":wallets,"accessories":accessories,"mark":mark});
		}
	});
});
app.get("/collection/edit",function(req,res){
	var bags = [];
	var wallets = [];
	var accessories = [];
	EntityModel.find().exec(function(err,entities){
		console.log(entities);
		if(err) return res.send("error happened...");
		else{
			entities.forEach(function(entity){
				if(entity.type=="bags") bags.push(entity);
				if(entity.type=="wallets") wallets.push(entity);
				if(entity.type=="accessories") accessories.push(entity);
			});
			res.render("collectionsEdit",{"bags":bags,"wallets":wallets,"accessories":accessories});
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
	console.log({"style_no":style_no,"title":title,"sub_title":sub_title,"dimension":dimension,"price":price,"type":type});
	var entityModel = new EntityModel({"style_no":style_no,"title":title,"sub_title":sub_title,"dimension":dimension,"price":price,"type":type});
	entityModel.save(function(err,entity,count){
		if(err) return res.send("error happened...");
		else{
			EntityModel.update({"_id":entity._id},{$push:{"detail_pictures":"/images/collections/default.jpg"}},function(err){
				if(err) return res.send("err happened");
				else{
					return res.redirect("/collection/edit");
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
			res.render("designEdit",{"models":models});
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

app.get("/collections_product/:type/:style_no",function(req,res){
	var type = req.params.type;
	var style_no = req.params.style_no;
	EntityModel.find({"type":type,"style_no":style_no}).exec(function(err,entities){
		if(entities!=0) res.render("collections_product",{"entity":entities[0],"type":type});	
		else res.send("err happened");
	});
});

// app.get("/create/:type/:style_no/:title/:sub_title/:dimension/:price",function(req,res){
// 	var type = req.params.type;
// 	var style_no = req.params.style_no;
// 	var title = req.params.title;
// 	var sub_title = req.params.sub_title;
// 	var dimension = req.params.dimension;
// 	var price = req.params.price;
// 	EntityModel.find({"style_no":style_no}).exec(function(err,entity){
// 		if(err) return res.send("error happened...");
// 		if(entity!=0) return res.send(entity);
// 		else{
// 			var entityModel = new EntityModel({"type":type,"style_no":style_no,"title":title,"sub_title":sub_title,"dimension":dimension,"price":price});
// 			entityModel.save(function(err,model,count){
// 				if(err) return res.send("err happened");
// 				else{
// 					return res.send(model);
// 				}
// 			});
// 		}
// 	});
// });

// app.get("/add_thumbnail/:style_no/:image_url",function(req,res){
// 	var style_no = req.params.style_no;
// 	var image_url = "/images/collections/" + req.params.image_url;
// 	EntityModel.update({"style_no":style_no},{$set:{"thumbnail": image_url}},function(err){
//       	if(err) return res.send("error happened...");
//       	else res.send("success...");
//     });
// });

// app.get("/add_detail_pictures/:style_no/:image_url",function(req,res){
// 	var style_no = req.params.style_no;
// 	var image_url = req.params.image_url;
// 	EntityModel.update({"style_no":style_no},{$push:{"detail_pictures":image_url}},function(err){
//       	if(err) return res.send("error happened...");
//       	else res.send("success...");
//     });
// });


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
						console.log(files);
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
						console.log(files);
						res.redirect("/goddess/edit");
					}
				});
			}
		});
    });
});

var server = app.listen(process.env.PORT || 18080, function() {
    console.log('App started listening on port %d', server.address().port);
});
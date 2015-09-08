var express = require('express');
var router = express.Router();
var db = require("../db");
// var BlogModel = db.BlogModel;

//新增博客,跳转到用户展示界面
router.post("/upload/logo",function(req,res){
	var form = new formidable.IncomingForm();
	form.uploadDir = "./resources/userlogos";
	form.keepExtensions = true;
	form.on('file', function(field, file) {
        //rename the incoming file to the file's name
        // fs.rename(file.path, form.uploadDir + "/" + file.name);
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
		// res.send(files);
      	var username = req.cookies.username;
      	UserModel.update({username:username},{$set:{logo:files.logo.path.split("\\")[2]}},function(err){
      		if(err) return res.render("err",{message:err});
      		else res.redirect("/users/"+username+"/about")
      	});
    });
});

module.exports = router;
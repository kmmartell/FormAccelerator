/* Cloudant application calls  by Kayla Martell */

var express = require('express');

var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var bodyParser   =    require("body-parser");
var Promise = require('promise');
var http = require("http");
var nano = require('nano')('https://user:password@host');

// create an alias for working with that database
var db = nano.db.use('acceleration');
// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');


var Cloudant = require('cloudant')({account:"user", password:"password"});
var cloud_db = Cloudant.db.use("db_name");


// create a new express server
var app = express();

app.set('view engine', 'jade');
// Set path to Jade template directory
app.set('views', __dirname + '/views');

// Set path to JavaScript files
app.set('js', __dirname + '/js');

// Set path to CSS files
app.set('css', __dirname + '/css');

// Set path to image files
app.set('images', __dirname + '/images');

// Set path to sound files
app.set('sounds', __dirname + '/sounds');

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json())
app.use(bodyParser.json({ type: 'application/*+json' }))

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// GET an existing record
app.get("/record/:id", function(req, res){
	db.get(req.params.id,  function(err, body) {
	  
	  res.send(body);
	  });

});

app.get("/table/records/:form_id", function(req, res){


	db.get(req.params.form_id,  function(err, body) {
	  var headers={};
	  
	  var columns=[{"data":"main_header", "ordering":false, "width":"100%"}];
	  for (var i=0; i<body.fields.length; i++){
	  	headers[body.fields[i].cid]=body.fields[i].cid;
	  	columns.push({"data":body.fields[i].cid, "class":"col_"+body.fields[i].cid, "id":"col-"+body.fields[i].cid, "title":body.fields[i].label,  "visible":false});

	  }

	  var data =[];

	  cloud_db.search('find', 'parent_id', {q:'parent_id:formA', include_docs:true}, function(er, result) {
		 
		  for (var i = 0; i < result.rows.length; i++){

		  		

// Create the main description
	var column1=" <h5 class='special-title'>"+result.rows[i].doc[body.fields[0].cid]+" <small>"+result.rows[i].doc[body.fields[1].cid]+"<div class='options'>";
        column1+="<a onclick='viewRecord(\""+result.rows[i].doc["_id"]+"\")'><span class='glyphicon glyphicon-eye-open'></span> View</span></a>";
          column1+="<a onclick='editRecord(\""+result.rows[i].doc["_id"]+"\")'><span class='glyphicon glyphicon-pencil'></span> Edit</a>";
         column1+= "<a onclick='deleteRecord(\""+result.rows[i].doc["_id"]+"\")'><span class='glyphicon glyphicon-trash'></span> Delete</a></div></h5>";
       column1+="<div class='details'>";
           column1+="<b>Created By:</b> <span>"+result.rows[i].doc["created_by"]+"</span>";
           column1+= "| <b>Created On:</b> <span>"+result.rows[i].doc["created_by"]+"</span>";
           if (result.rows[i].doc["updated_on"]){
           	column1+="| <b>Last Updated:</b> <span>"+result.rows[i].doc["updated_on"]+"</span>";
           }
           if (result.rows[i].doc["updated_by"]){
           	column1+="| <b>Updated By:</b> <span>"+result.rows[i].doc["updated_by"]+"</span>";
           }

      column1+="</div>";
           var temp={"main_header":column1, "width":"600px", "id":"" "sorting":false};
           
           

		  		for (var j = 0; j < body.fields.length; j++){
		  			var value="";
		  			if (result.rows[i].doc[body.fields[j].cid]){
		  				value=result.rows[i].doc[body.fields[j].cid];
		  			}
		  			else{
		  				value="";
		  			}
		  			temp[body.fields[j].cid]=value;
		  			
		  		}
		  		data.push(temp);
		  		
		  		
		  }
 
		  res.send({"data": data, "columns":columns});
		   
	})
	 

	  
	  });
	
	

})


// Get and document and send JSON back
app.get("/doc/:id", function(req, res){
	db.get(req.params.id,  function(err, body) {
	  res.send(body);
	 });

})
app.post('/project/delete/:id', function(req, res){
	//var _id=req.body._id;
	db.get(_id,  function(err, body) {
		var _rev = body._rev;
		db.destroy(_id, _rev, function(err, body) {
			res.send(body);
		});

	});
	
});


app.get("/query/formsforproject/:parent_Id", function(req, res){
	cloud_db.search('find', 'parent_id', {q:'parent_id:'+req.params.project_id, include_docs:true}, function(er, result) {
		var forms_list=[];
		 for (var i = 0; i < result.rows.length; i++){
			
			forms_list.push(result.rows[i].doc);
		 }
		 res.send(forms_list);
	});
});


app.get("/allprojects", function(req, res){
	cloud_db.search('find', 'type', {q:'type:project', include_docs:true}, function(er, result) {
		var project_list=[];
		 for (var i = 0; i < result.rows.length; i++){
			
			project_list.push(result.rows[i].doc);
		 }
		 res.render('index', {projects: project_list, scripts: [ 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', '/js/project.js', '/plugins/validate/dist/jquery.validate.min.js', '/plugins/sweetalert/lib/sweet-alert.min.js']});
	
	});
	
});

app.post('/project/save', function(req, res){
	

	if (req.body._id){
		console.log("Updating existing record...");
			db.get(req.body._id,  function(err, body) {
				var _rev = body._rev;
				req.body["_rev"]=_rev;
				db.insert(req.body, function(err, body, header) {
				
				res.send(body);

			});
		 
		});
		
		
	}
	else{
		console.log("Inserting new record...");
		db.insert(req.body, function(err, body, header) {
			
			res.send(body);

		});
	}
	
})
// View Only Record
app.get('/project/record/view/:id', function(req, res){
	console.log("Requesting view for "+req.params.project_id+ " with id "+req.params.id);
	db.get(req.params.id,  function(err, record) {
	
	   		db.get(record["parent_id"],  function(err, form_config) {
	   			
	   		res.render('view', {record:record, name:form_config["name"], description:form_config["description"], fields:form_config["fields"]});
	   		});
	   
	 });
});

app.get('/project/filters/:form_id', function(req, res){
	
	   db.get(req.params.form_id,  function(err, form_config) {

	   		res.render('filters', {form_id: req.params.form_id, fields:form_config["fields"]});
	   });
	  
});

// Edit Only Record
app.get('/project/edit/:id', function(req, res){
	
	db.get(req.params.id,  function(err, record) {
		
	   if (record["type"]=="record"){
	   		db.get(record["parent_id"],  function(err, form_config) {
	   			
	   		res.render('edit', {record:record, project_id: req.params.project_id, form_id: record["parent_id"], record_id: record["_id"], name:form_config["name"], description:form_config["description"], fields:form_config["fields"]});
	   		});
	   }
	 });
})

// Create form
app.get('/project/:project_id/form/:form_id/create', function(req, res){

		db.get(req.params.form_id,  function(err, form_config) {
			
			res.render('edit', {record:{}, project_id: req.params.project_id, form_id: req.params.form_id, record_id: "", name:form_config["name"], description:form_config["description"], fields:form_config["fields"]});
		});
	  
})

app.get('/form/fields/:form_id', function(req, res){
	db.get(req.params.form_id,  function(err, body) {
		
		res.send(body.fields);
	});
})

app.get('/project/:id', function(req, res){
	
	// Get the requested ID record and render it given the parent form

	db.get(req.params.id,  function(err, body) {
		console.log(body);
		if (body){
			console.log("Project Exists - Rendering Project.jade view");
			res.render('project', { links:['/plugins/bootstrap/css/bootstrap.min.css', '/plugins/datatables/media/css/jquery.dataTables.css', '/plugins/sweetalert/lib/sweet-alert.css', '/css/style.css'], scripts: [ 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', '/js/project.js', '/plugins/bootstrap/js/bootstrap.min.js', '/plugins/validate/dist/jquery.validate.min.js', '/plugins/sweetalert/lib/sweet-alert.min.js', '/plugins/datatables/media/js/jquery.dataTables.js', 'plugins/datatables/extensions/TableTools/js/dataTables.tableTools.min.js'], forms_list:body["forms"], pageTitle: body['project_name'], project_id:body["_id"]});
		}
	    else{
	    	console.log("View Not Found. Rendering viewnotfound.jade view");
	    	res.render("viewnotfound.jade");
	    }
	 });
	
});
app.get('/dashboard/:project_id', function(req, res){
	console.log("Requested project for ID: "+req.params.project_id);

	// Get the requested ID record and render it given the parent form
	cloud_db.search('find', 'parent_id', {q:'parent_id:'+req.params.project_id, include_docs:true}, function(er, result) {
		var forms_list=[];
		var forms={};
		 for (var i = 0; i < result.rows.length; i++){

			console.log(result.rows[i].doc);
			forms_list.push(result.rows[i].doc);
			forms[result.rows[i].doc._id]=result.rows[i].doc["name"];
		 }
		 console.log("FORMS ");
		 console.log(forms);
		 console.log(forms_list);
			 db.get(req.params.project_id,  function(err, body) {
				
				if (body){
					console.log("Project Exists - Rendering dashboard.jade view");
					res.render('dashboard', {forms:forms,  forms_list:forms_list,  scripts: [ 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', '/js/project.js', '/plugins/bootstrap/js/bootstrap.min.js',  '/plugins/validate/dist/jquery.validate.min.js', '/plugins/sweetalert/lib/sweet-alert.min.js', '/plugins/datatables/media/js/jquery.dataTables.js', 'plugins/datatables/extensions/TableTools/js/dataTables.tableTools.min.js'], 
					 pageTitle: body['project_name'], project_id:req.params.project_id});
				}
			    else{
			    	console.log("View Not Found. Rendering viewnotfound.jade view");
			    	res.render("index.jade");
			    }
		 });
		 
	});
	
	
});

app.get('/dashboard/:project_id/form/:form_id', function(req, res){
	
	db.get(req.params.form_id,  function(err, body) {
		if (body){
			res.render('formedit', {project_id:req.params.project_id, parent_id: body["parent_id"], fields:body["fields"], name:body["name"], form_id:req.params.form_id,  scripts: [ 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', '/js/dashboard.js', '/plugins/bootstrap/js/bootstrap.min.js', '/plugins/formbuilder/vendor/js/vendor.js', '/plugins/formbuilder/dist/formbuilder.js', '/plugins/validate/dist/jquery.validate.min.js', '/plugins/sweetalert/lib/sweet-alert.min.js', '/plugins/datatables/media/js/jquery.dataTables.js', 'plugins/datatables/extensions/TableTools/js/dataTables.tableTools.min.js']});
		}
	    else{
	    	res.render("index.jade");
	    }
		
	});

	
	
});

app.get('/create/project/', function(req, res){
	res.render('newproject', {scripts: [ 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', '/js/project.js', '/plugins/validate/dist/jquery.validate.min.js', '/plugins/sweetalert/lib/sweet-alert.min.js']});
	
    
});

app.get('/create/form/:id', function(req, res){
	db.get(req.params.id,  function(err, body) {
	   console.log(body);

	   res.render('form', {name:body["name"], description:body["description"], fields:body["fields"]});
	 });
	
    
});

// start server on the specified port and binding host
app.listen(appEnv.port, appEnv.bind, function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

// http://101.78.220.133:8099/22.316109/114.180459
// http://101.78.220.133:8099/?lat=22.316109&lon=114.180459&zoom=18

var rn = require('random-number');
var options = {
  min:  0
, max:  100
, integer: true
}
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('express-flash');
var http = require('http');
var url = require('url');
var express = require('express');
var app = express();
var assert = require('assert');
var mongourl = 'mongodb://test:123456@ds050869.mlab.com:50869/restaurant';
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var fileUpload = require('express-fileupload');
app.set('view engine', 'ejs');

app.use(express.static(__dirname +  '/public'));
app.use(fileUpload());
app.use(flash());
app.use(cookieParser());
app.use(session({ secret: '123' }));

app.get("/createpage", function(req,res) {
res.render("createac.ejs");
	res.end();

});

app.get("/new", function(req,res) {
res.render("newRes.ejs");
	res.end();

});



//==================================================================

app.post("/newRes", function(req,res) {
	
	var name = req.body.name;
	var pwd  = req.body.pwd;
	console.log(name);
	console.log(pwd);
	MongoClient.connect(mongourl, function(err, db) {
		assert.equal(err,null);
		console.log('*Connected to MongoDB\n');
		createaccount(db,name, pwd, function() {

			db.close();
		var object = { 
		"name" : req.body.name
			}    
		MongoClient.connect(mongourl, function(err, db) {
		assert.equal(err,null);
		console.log('Connected to MongoDB\n');
		Checkpwd(db,object,function(account) {
			db.close();
			console.log('Disconnected MongoDB\n');
			res.render('userinfo.ejs',{c:account});
			//res.end();
		});
	});
	

		
	
}	
)
});

});
function newRes(db,name, pwd,callback) {
var id = rn(options);
  console.log('function'+name);
  db.collection('account').insertOne({
    "name" : name,
    "pwd" : pwd,
    "id": id
  }, function(err,result) {
    //assert.equal(err,null);
    if (err) {
      console.log('insertOne Error: ' + JSON.stringify(err));
      result = err;
    } else {
	
	callback();
	}


  });
}



//============================================================

app.post("/createac", function(req,res) {
	
	var name = req.body.name;
	var pwd  = req.body.pwd;
	console.log(name);
	console.log(pwd);
	MongoClient.connect(mongourl, function(err, db) {
		assert.equal(err,null);
		console.log('*Connected to MongoDB\n');
		createaccount(db,name, pwd, function() {

			db.close();
		var object = { 
		"name" : req.body.name
			}    
		MongoClient.connect(mongourl, function(err, db) {
		assert.equal(err,null);
		console.log('Connected to MongoDB\n');
		Checkpwd(db,object,function(account) {
			db.close();
			console.log('Disconnected MongoDB\n');
			res.render('userinfo.ejs',{c:account});
			//res.end();
		});
	});
	

		
	
}	
)
});

});
function createaccount(db,name, pwd,callback) {
var id = rn(options);
  console.log('function'+name);
  db.collection('account').insertOne({
    "name" : name,
    "pwd" : pwd,
    "id": id
  }, function(err,result) {
    //assert.equal(err,null);
    if (err) {
      console.log('insertOne Error: ' + JSON.stringify(err));
      result = err;
    } else {
	
	callback();
	}


  });
}







//=========================================================================================================
app.post("/check", function(req,res) {

var name = req.body.name;
var pwd  = req.body.password;
console.log(name);console.log(pwd);

	var object = { 
	"name" : req.body.name
}    


console.log(object)
	
	MongoClient.connect(mongourl, function(err, db) {
		assert.equal(err,null);
		console.log('Connected to MongoDB\n');
		Checkpwd(db,object,function(account) {
			
			db.close();
			console.log('Disconnected MongoDB\n');
	
			if (name==account[0].name && pwd==account[0].pwd)
			{
			console.log('Login OK!!');
			
	MongoClient.connect(mongourl, function(err, db) {
		assert.equal(err,null);
		console.log('Connected to MongoDB\n');
		findNCafe(db,function(cafes) {
			db.close();
			console.log('Disconnected MongoDB\n');
			res.render('list.ejs',{c:cafes});
			//res.end();
		});
	});

			}
			else
			{
			console.log('Please login again!!');			
			
			res.render('Login.ejs');
			}
			
			//res.end();
		});
	});
});

function Checkpwd(db,object,callback) {
		console.log(object);
		var account = [];
		db.collection('account').find(object,function(err,result) {
			assert.equal(err,null);
			result.each(function(err,doc) {
				if (doc != null) {
					account.push(doc);
				} else {
					callback(account);
				}
			});
		})
}




//===============================================================================================================================





app.get("/", function(req,res) {
	

	res.render("Login.ejs");
	res.end();
});
//==========================================================================================================
app.get('/list', function(req,res) {
	MongoClient.connect(mongourl, function(err, db) {
		assert.equal(err,null);
		console.log('Connected to MongoDB\n');
		findNCafe(db,function(cafes) {
			db.close();
			console.log('Disconnected MongoDB\n');
			res.render('list.ejs',{c:cafes});
			//res.end();
		});
	});
});
function findNCafe(db,callback) {
		var cafes = [];
		db.collection('rastaurantMap').find(function(err,result) {
			assert.equal(err,null);
			result.each(function(err,doc) {
				if (doc != null) {
					cafes.push(doc);
				} else {
					callback(cafes);
				}
			});
		})
}
//==================================================================================================================
app.get("/showonmap", function(req,res) {
	MongoClient.connect(mongourl, function(err, db) {
    assert.equal(err,null);
    console.log('Connected to MongoDB\n');
		var criteria = {'id':req.query.id};
		console.log(req.query.id);
    findCafe(db,criteria,function(cafe) {
      db.close();
      console.log('Disconnected MongoDB\n');
			res.render('gmap.ejs',{lat:cafe.coord[0],lon:cafe.coord[1],zoom:18});
			res.end();
		});
	});
});

function findCafe(db,criteria,callback) {
	console.log(criteria);
	db.collection('rastaurantMap').findOne(criteria,function(err,result) {
		assert.equal(err,null);
		callback(result);
	});
}

//====================================================================================================================

app.get("/restaurantinfo", function(req,res) {

	var name = req.query.name;
	console.log('RI'+req.query);

	MongoClient.connect(mongourl, function(err, db) {
    assert.equal(err,null);
    console.log('Connected to MongoDB\n');
		var criteria = {'name': name};
		console.log(req.query.name);
    findCafe(db,criteria,function(cafe) {
	console.dir(cafe);
      db.close();
      console.log('Disconnected MongoDB\n');
			
			res.render('restaurantinfo.ejs',{c:cafe});
			res.end();
		});
	});
});







//=========================================================================================================
//---------------------------------------------photo upload /download--------------------------------------
app.post('/upload', function(req, res) {
    var sampleFile;

    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }

    MongoClient.connect(mongourl,function(err,db) {
      console.log('Connected to mlab.com');
      assert.equal(null,err);
      create(db, req.files.sampleFile, function(result) {
        db.close();
        if (result.insertedId != null) {
          res.status(200);
          res.end('Inserted: ' + result.insertedId)
        } else {
          res.status(500);
          res.end(JSON.stringify(result));
        }
      });
    });
    /*
    sampleFile = req.files.sampleFile;
    sampleFile.mv(__dirname + '/somewhere/on/your/server/filename.jpg', function(err) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.send('File uploaded!');
        }
    });
    */
});

app.get('/download', function(req,res) {
  MongoClient.connect(mongourl,function(err,db) {
    console.log('Connected to mlab.com');
    console.log('Finding key = ' + req.query.key)
    assert.equal(null,err);
    var bfile;
    var key = req.query.key;
	  if (key != null) {
      read(db, key, function(bfile,mimetype) {
        if (bfile != null) {
          console.log('Found: ' + key)
          res.set('Content-Type',mimetype);
          res.end(bfile);
        } else {
          res.status(404);
          res.end(key + ' not found!');
          console.log(key + ' not found!');
        }
        db.close();
      });
    } else {
      res.status(500);
      res.end('Error: query parameter "key" is missing!');
    }
  });
});

function create(db,bfile,callback) {
  console.log(bfile);
  db.collection('photo').insertOne({
    "data" : new Buffer(bfile.data).toString('base64'),
    "mimetype" : bfile.mimetype,
  }, function(err,result) {
    //assert.equal(err,null);
    if (err) {
      console.log('insertOne Error: ' + JSON.stringify(err));
      result = err;
    } else {
      console.log("Inserted _id = " + result.insertId);
    }
    callback(result);
  });
}

function read(db,target,callback) {
  var bfile = null;
  var mimetype = null;
  db.collection('photo').findOne({"_id": ObjectId(target)}, function(err,doc) {
    assert.equal(err,null);
    if (doc != null) {
      bfile = new Buffer(doc.data,'base64');
      mimetype = doc.mimetype;
    }
    callback(bfile,mimetype);
  });
}

















app.listen(process.env.PORT || 8099);

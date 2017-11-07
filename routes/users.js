var secrets = require('../config/secrets');
var User = require('../models/user');

module.exports = function (router,db) {
	router.get('/users', function (req, res) {
		var QueryWhere = eval("("+req.query.where+")");
		var QuerySort = eval("("+req.query.sort+")");
		var QuerySelect = eval("("+req.query.select+")");
		var QuerySkip = eval("("+req.query.skip+")");
		var QueryLimit = eval("("+req.query.limit+")");
		var QueryCount = eval("("+req.query.count+")");
		if(QueryCount){
			User.count(QueryCount).exec(function(err,users){
			if(err){
				res.status(500);
				res.json({message:'Server error'});
				res.send(err);
			}else{
				res.status(200);
				res.json({message:'The number of users is in the data',data:users});
			}

		});
		}else{
			User.find(QueryWhere).sort(QuerySort).select(QuerySelect).skip(QuerySkip).limit(QueryLimit).exec(function(err,users){
				if(err){
					res.status(500);
					res.json({message:'Server error'});
					res.send(err);
				}else{
					res.status(200);
					res.json({message:'All the users are listed',data:users});
				}

			});
		}

    });

    router.post('/users', function (req, res) {
    	var user = new User();
		user.name = req.body.name;
		user.email = req.body.email;
		user.pendingTasks = req.body.pendingTasks;
		user.save(function(err, result) {

			if(err){
				res.status(404);
				res.json({message:'An error has occurred'});
				return console.error(err);			
    		}else{
    			res.status(201);
				res.json({message:'A user is created',data: result});
			}
		})


    });
	router.get('/users/:id', function (req, res) {
		User.findById(req.params.id, function(err, user){
			if(err){
				res.status(404);
				res.json({message:'Cannot find the user'});
				return console.error(err);			
    		}else if(user==null){
				res.status(404);
				res.json({message:'Cannot find the user'});
    		}else{
    			res.status(200);
				res.json({message:'The user is found',data: user});
			}
		})

    });


	router.put('/users/:id', function (req, res) {
		User.findById(req.params.id, function(err, user){
			if(err){
				res.status(404);
				res.json({message:'Cannot find the user'});
				return console.error(err);			
    		}else{
				user.name = req.body.name;
				user.email = req.body.email;
				user.pendingTasks = req.body.pendingTasks;
				user.dateCreated = req.body.dateCreated;
				user.save(function(err, result){
					if(err){
						res.status(404);
						res.json({message:'An error has occurred'});
						return console.error(err);			
		    		}else{
		    			res.status(200);
						res.json({message:'The user is replaced',data: user});
					}
				}) 			
			}
		})

    });


	router.delete('/users/:id', function (req, res) {
		User.findById(req.params.id, function(err, user){
			if(err){
				res.status(404);
				res.json({message:'Cannot find the user'});
				return console.error(err);			
    		}else if(user==null){
				res.status(404);
				res.json({message:'Cannot find the user'});
    		}else{
				User.remove({_id: req.params.id}, function(err){
					if(err){
						res.status(404);
						res.json({message:'An error has occurred'});
						return console.error(err);			
		    		}else{
		    			res.status(200);
						res.json({message:'The user is deleted'});
					}
				}) 			
			}
		})

    });


    // router.post('/users', function (req, res) {


    // });

    return router;
}

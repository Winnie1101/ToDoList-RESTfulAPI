var secrets = require('../config/secrets');
var Task = require('../models/task');

module.exports = function (router) {

router.get('/tasks', function (req, res) {
		var QueryWhere = eval("("+req.query.where+")");
		var QuerySort = eval("("+req.query.sort+")");
		var QuerySelect = eval("("+req.query.select+")");
		var QuerySkip = eval("("+req.query.skip+")");
		var QueryLimit = eval("("+req.query.limit+")");
		var QueryCount = eval("("+req.query.count+")");

		Task.find(QueryWhere).sort(QuerySort).select(QuerySelect).skip(QuerySkip).limit(QueryLimit).exec(function(err,tasks){
			if(err){
				res.status(500);
				res.json({message:'Server error'});
				res.send(err);
			}else{
				res.status(200);
				res.json({message:'All the tasks are listed',data:tasks});
			}

		});

    });

    router.post('/tasks', function (req, res) {
    	var task = new Task();
		task.name = req.body.name;
		task.description = req.body.description;
		task.deadline = req.body.deadline;
		task.completed = req.body.completed;		
		task.assignedUser = req.body.assignedUser;
		task.type = req.body.type;
		task.assignedUserName = req.body.assignedUserName;
		task.dateCreated = req.body.dateCreated;

		task.save(function(err, result) {

			if(err){
				res.status(404);
				res.json({message:'An error has occurred'});
				return console.error(err);			
    		}else{
    			res.status(201);
				res.json({message:'A task is created',data: task});
			}
		})


    });

	router.get('/tasks/:id', function (req, res) {
		Task.findById(req.params.id, function(err, task){
			if(err){
				res.status(404);
				res.json({message:'Cannot find the task'});
				return console.error(err);			
    		}else{
    			res.status(200);
				res.json({message:'The task is found',data: task});
			}
		})

    });


	router.put('/tasks/:id', function (req, res) {
		Task.findById(req.params.id, function(err, task){
			if(err){
				res.status(404);
				res.json({message:'Cannot find the task'});
				return console.error(err);			
    		}else{
				task.name = req.body.name;
				task.description = req.body.description;
				task.deadline = req.body.deadline;
				task.completed = req.body.completed;		
				task.assignedUser = req.body.assignedUser;
				task.type = req.body.type;
				task.assignedUserName = req.body.assignedUserName;
				task.dateCreated = req.body.dateCreated;
				task.save(function(err, result){
					if(err){
						res.status(404);
						res.json({message:'An error has occurred'});
						return console.error(err);			
		    		}else{
		    			res.status(200);
						res.json({message:'The task is replaced',data: task});
					}
				}) 			
			}
		})

    });


	router.delete('/tasks/:id', function (req, res) {
		Task.findById(req.params.id, function(err, task){
			if(err){
				res.status(404);
				res.json({message:'Cannot find the task'});
				return console.error(err);			
    		}else{
				Task.remove({_id: req.params.id}, function(err){
					if(err){
						res.status(404);
						res.json({message:'An error has occurred'});
						return console.error(err);			
		    		}else{
		    			res.status(200);
						res.json({message:'The task is deleted'});
					}
				}) 			
			}
		})

    });

    return router;
}

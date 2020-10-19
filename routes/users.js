const { query } = require('express');
const { use } = require('.');
var router = require('express').Router()
var User = require('../models/user')
var faker = require('faker')


// Each visit on /users/generate-fake-data inserts 90 new items to database: from 
// app.js
// Than redirected to / index page. 

router.get('/generate-fake-data', function(req, res, next) {
  for (var i = 0; i < 90; i++) {
      var user = new User()

      user.username= faker.name.firstName()+" "+faker.name.jobType(),
      user.IPaddress= faker.internet.ip(),
      user.jobstat=faker.fake("NeverRun"),
      user.report=faker.fake("NoReportYet"),
      user.location = faker.name.jobArea(), 
      user.reportURL ="http://localhost:3000"+"/users/report/"+user._id,

      user.save(function(err) {
          if (err) throw err
      })
  }
  res.redirect('/')
})



/* GET userlist. */
router.get('/userlist', function(req, res) {
  var db = req.db;
  var collection = db.get('userlists');
  collection.find({},{},function(e,docs){
    res.json(docs);
  });
});

/* POST to adduser. */
router.post('/adduser', function(req, res) {
  var db = req.db;
  var collection = db.get('userlists');

  collection.insert(req.body, function(err, result){
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});


/*  POST to updateUser info */
router.updateinfo = function(db) {
  return function(req, res) {
      var userToUpdate = req.params.id;
      var doc = {$set: req.body};
      db.collection('userlists').update(userToUpdate, doc, function(err, result) {
          res.send((result == 1) ? {msg: ''} : {msg: 'Error: ' + err});
      });
  }
};


/* DELETE to deleteuser. */
router.delete('/deleteuser/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('userlists');
  var userToDelete = req.params.id;
  collection.remove({ '_id' : userToDelete }, function(err) {
    res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
  });
});


/* POST TO USER from Duplicati. */
router.post('/report/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('userreport');
  var userID = req.params.id;
  req.body.userID = userID; 
  collection.insert(req.body, function(err, result){
    db.get('userlists').update({_id:userID},{$set:{jobstat:result.Data.ParsedResult,report:result.Data.BackendStatistics}});

    console.log(result.userID)
    
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

module.exports = router;

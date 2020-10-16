// var router = require('express').Router()
// var faker = require('faker')
// var User = require('../models/user')

// module.exports = router


// // Each visit on /generate-fake-data inserts 90 new items to database: from 
// // app.js
// // Than redirected to / index page. 

// router.get('/generate-fake-data', function(req, res, next) {
//     for (var i = 0; i < 90; i++) {
//         var user = new User()

//         user.username= faker.name.firstName(),
//         user.IPaddress= faker.internet.ip(),
//         user.jobstat=faker.fake("NeverRun"),
//         user.report=faker.fake("NoReportYet"),
//         user.location = faker.commerce.department(),
//         user.reportURL ="http://localhost:3000"+"/users/report/"+user._id,

//         user.save(function(err) {
//             if (err) throw err
//         })
//     }
//     res.redirect('/')
// })

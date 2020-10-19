var express = require('express');
var router = express.Router();
var async = require('async');



/* GET home page. */
router.get('/', function(req, res, next) {

    var db = req.db;

    /* Set our collection */
    users = db.get('userlists');
     users.distinct("location",{},function(e,array){

        res.render('index', { title: 'Informant',array:array});
    });
});

/* GET users filter page. */
router.get('/usersfilter', function(req, res, next) {
  res.render('users', { title: 'Users filter' });
});

/* Handles the pagination. */
router.post('/users/view-front', function(req, res){
  
  /* Set our internal DB variable */
  var db = req.db;
  
      /* Set our collection */
      users = db.get('userlists');
      
      pag_content = '';
      pag_navigation = '';
  
      page = parseInt(req.body.data.page); /* Page we are currently at */
      name = req.body.data.name; /* Name of the column name we want to sort */
      sort = req.body.data.sort == 'ASC' ? 1 : -1; /* Order of our sort (DESC or ASC) */
      max = parseInt(req.body.data.max); /* Number of items to display per page */
      search = req.body.data.search; /* Keyword provided on our search box */
      
      cur_page = page;
      page -= 1;
      per_page = max ? max : 20; 
      previous_btn = true;
      next_btn = true;
      first_btn = true;
      last_btn = true;
      start = page * per_page;
  
      where_search = {};
  
  /* Check if there is a string inputted on the search box */
  if( search != '' ){
      /* If a string is inputted, include an additional query logic to our main query to filter the results */
      var filter = new RegExp(search, 'i');
      where_search = {
          '$or' : [
              {'username' : filter},
              {'jobstat' : filter},
          ]
      }
  }
  
  var all_items = '';
  var count = '';
  var sort_query = {};
  
  /* We use async task to make sure we only return data when all queries completed successfully */
  async.parallel([
      function(callback) {
          /* Use name and sort variables as field names */
          sort_query[name] = sort;
          
          /* Retrieve all the posts */
          users.find( where_search, {
              limit: per_page,
              skip: start,
              sort: sort_query
              
          }, function(err, docs){
              if (err) throw err;
            //   console.log(docs);
              all_items = docs;
              callback();
              
          });
      },
      function(callback) {
          users.count(where_search, function(err, doc_count){
              if (err) throw err;
              // console.log(count);
              count = doc_count;
              callback();
          });
      }
  ], function(err) { //This is the final callback
      /* Check if our query returns anything. */
      if( count ){
   
            for (var key in all_items) {
              pag_content += 
                          '<tr>' + '<td><a href="#" class="linkshowuser" rel="' + all_items[key].username + '">' + all_items[key].username + '</a></td>'+'<td id="jobstat-td" class="jobstat-class-'+ all_items[key].jobstat + '">' + all_items[key].jobstat + '</td>'+
                          '<td><a href="http://' + all_items[key].IPaddress + '" target="_blank" class="linkremotedash">' + all_items[key].IPaddress + ':8200 </a></td>'+
                          '<td><a href="#" class="linkdeleteuser" rel="' + all_items[key]._id + '">delete</a></td>'+'<td><a href="#" class="linkupdateinfo" rel="' + all_items[key]._id + '">update</a></td>'+'</tr>'
          }
      }
      
      pag_content = pag_content + "<br class = 'clear' />";
      
   

      no_of_paginations = Math.ceil(count / per_page);

      if (cur_page >= 7) {
          start_loop = cur_page - 3;
          if (no_of_paginations > cur_page + 3)
              end_loop = cur_page + 3;
          else if (cur_page <= no_of_paginations && cur_page > no_of_paginations - 6) {
              start_loop = no_of_paginations - 6;
              end_loop = no_of_paginations;
          } else {
              end_loop = no_of_paginations;
          }
      } else {
          start_loop = 1;
          if (no_of_paginations > 7)
              end_loop = 7;
          else
              end_loop = no_of_paginations;
      }
        
      pag_navigation += "<ul>";

      if (first_btn && cur_page > 1) {
          pag_navigation += "<li p='1' class='active'>First</li>";
      } else if (first_btn) {
          pag_navigation += "<li p='1' class='inactive'>First</li>";
      } 

      if (previous_btn && cur_page > 1) {
          pre = cur_page - 1;
          pag_navigation += "<li p='" + pre + "' class='active'>Previous</li>";
      } else if (previous_btn) {
          pag_navigation += "<li class='inactive'>Previous</li>";
      }
      for (i = start_loop; i <= end_loop; i++) {

          if (cur_page == i)
              pag_navigation += "<li p='" + i + "' class = 'selected' >" + i + "</li>";
          else
              pag_navigation += "<li p='" + i + "' class='active'>" + i + "</li>";
      }
      
      if (next_btn && cur_page < no_of_paginations) {
          nex = cur_page + 1;
          pag_navigation += "<li p='" + nex + "' class='active'>Next</li>";
      } else if (next_btn) {
          pag_navigation += "<li class='inactive'>Next</li>";
      }

      if (last_btn && cur_page < no_of_paginations) {
          pag_navigation += "<li p='" + no_of_paginations + "' class='active'>Last</li>";
      } else if (last_btn) {
          pag_navigation += "<li p='" + no_of_paginations + "' class='inactive'>Last</li>";
      }

      pag_navigation = pag_navigation + "</ul>";
      
      var response = {
          'content': pag_content,
          'navigation' : pag_navigation
      };
      
      res.send(response);
      
  });

});

module.exports = router;

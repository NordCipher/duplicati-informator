// Userlist data array for filling in info box
var userListData = [];
var userListDataPage = [];

// DOM Ready =============================================================
$(document).ready(function() {

 

  // Populate the user table on initial page load
  populateTable();
 
// Username link click
$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

// Update User link click
$('#userList table tbody').on('click', 'td a.linkupdateinfo', injectIntoUpdateChunk);

// Delete User link click
$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

// Remote User panel access link click
$('#userList table tbody').on('click', 'td a.linkremotedash',function(){});

// Add User button click
$('#btnAddUser').on('click', addUser);

// Add class to updated fields
$('#updateInfo input').on('change', function(){$(this).addClass('updated')});

// Update info button click
$('#btnUpdateUser').on('click', updateInfo);
$('#btnUpdateUser').click(function(){
  $("#updateInfo").hide();
})

// Cancel Update User button click
// $('#btnCancelUpdateInfo').on('click', toggleAddUpdateChunks);
$('#btnCancelUpdateInfo').click(function(){
      $("#updateInfo").hide();
  })

$("tbody").on( "click", ".fa-pencil", function(){
  $("#btnUpdateUser").prop('disabled', false);
  $("#updateInfo").show();
})


// Toggle Add User card
$(".fa-plus").click(function(){
  $("#addUser").toggle();
  $(this).hide();
  $(".fa-minus").show();
})

$(".fa-minus").click(function(){
  $("#addUser").toggle();
  $(this).hide();
  $(".fa-plus").show();
})

// Add user on click on button and close card 
$("#btnAddUser").click(function(){
  $("#addUser").hide();
  $(".fa-minus").hide();
  $(".fa-plus").show();

})

});


  // Functions =============================================================

// Toggle Displaying Add and Update Chunks
function toggleAddUpdateChunks() {
  // $('#addUserForm').toggle();
  $("#updateInfoChunk").toggleClass('hidden');
}

// Fill table with data
function populateTable() {
  // jQuery AJAX call for JSON
  $.getJSON( '/users/userlist', function( data ) {

    // Stick our user data array into a userlist variable in the global object
    userListData = data;
  });

  $(".pagination-nav .selected").click();

  // Empty content string
  // var tableContent = '';

  // // jQuery AJAX call for JSON
  // $.getJSON( '/users/userlist', function( data ) {

  //   // Stick our user data array into a userlist variable in the global object
  //   userListData = data;

    // // For each item in our JSON, add a table row and cells to the content string
    // $.each(data, function(){
    //   tableContent += '<tr>';
    //   tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
    //   tableContent += '<td>' + this.jobstat + '</td>';
    //   tableContent += '<td><a href="http://' + this.IPaddress + '" target="_blank" class="linkremotedash">' + this.IPaddress + '</a></td>';
    //   tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
    //   tableContent += '<td><a href="#" class="linkupdateinfo" rel="' + this._id + '">update</a></td>';
    //   tableContent += '</tr>';
    // });

    // // Inject the whole content string into our existing HTML table
    // $('#userList table tbody').html(tableContent);

  // });
};

// Show User Info
function showUserInfo(event) {

  // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');
    console.log(1,thisUserName)
    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);
    console.log(2,arrayPosition)
    // Get our User Object
    var thisUserObject = userListData[arrayPosition];
   
    //Populate Info Box
    var reporortext = JSON.stringify(thisUserObject.report, null ,10);
    $('#userInfoName').text(thisUserObject.username);
    $('#userInfoReport').text(reporortext);
    $('#userInfoIP').text(thisUserObject.IPaddress);
    $('#userInfoJobStat').text(thisUserObject.jobstat);
    $('#userInfoLocation').text(thisUserObject.location);
    $('#userInfoUserURL').text(hosturl+path+thisUserObject._id);
    // $('#userInfo').toggle();
  
};

// Add User
function addUser(event) {
    event.preventDefault();
  
    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUserForm input').each(function(index, val) {
      if($(this).val() === '') { errorCount++; }
    });
  
    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {
  
      // If it is, compile all user info into one object
      var newUser = {
        'username': $('#addUser fieldset input#inputUserName').val(),
        'IPaddress': $('#addUser fieldset input#inputUserIP').val(),
        'jobstat': $('#addUser fieldset input#inputUserJobStat').val(),
        'report': $('#addUser fieldset input#inputUserReport').val(),
        'location': $('#addUser fieldset input#inputUserLocation').val(),
  
        
      }
      // Use AJAX to post the object to our adduser service
      $.ajax({
        type: 'POST',
        data: newUser,
        url: '/users/adduser',
        dataType: 'JSON'
      }).done(function( response ) {
  
        // Check for successful (blank) response
        if (response.msg === '') {
  
          // Clear the form inputs
          $('#addUser fieldset input').val('');
          $('#addUser fieldset input#inputUserReport').val('NeverRun');
          $('#addUser fieldset input#inputUserJobStat').val('NoReport');
  
          // Update the table
          populateTable();
  
        }
        else {
  
          // If something goes wrong, alert the error message that our service returned
          alert('Error: ' + response.msg);
  
        }
      });
    }
    else {
      // If errorCount is more than 0, error out
      alert('Please fill in all fields');
      return false;
    }
};

// inject User info into the Update fields
function injectIntoUpdateChunk(event) {
 
  event.preventDefault();

  if($('#addUserForm').is(":visible")){
      toggleAddUpdateChunks();
  }

  var _id = $(this).attr('rel');
  var arrayPosition = userListData.map(function(arrayItem) {return arrayItem._id; }).indexOf(_id);

  var thisUserObject = userListData[arrayPosition];
  $('#updateUserName').val(thisUserObject.username);
  $('#updateUserIP').val(thisUserObject.IPaddress);
  $('#updateUserLocation').val(thisUserObject.location);
  // $('#updateUserName').val(thisUserObject.username);
  // $('#updateUserEmail').val(thisUserObject.email);

  $('#updateInfoChunk').attr('rel',thisUserObject._id);
}


// Update User
function updateInfo(event) {
 
  event.preventDefault();

  var _id = $('#updateInfoChunk').attr('rel');
    var fieldsToBeUpdated = $('#updateInfo input.updated');

  var updatedFields = {};
  $(fieldsToBeUpdated).each(function(){
      var key = $(this).attr('placeholder').replace(" ","");
      var value = $(this).val();
      updatedFields[key]=value;
  });
  $.ajax({
  type: 'PUT',
  url: '/updateinfo/' + _id,
  data: updatedFields
  }).done(function( response ) {
      if( response.msg === '' ) {
         alert('Error: ' + response.msg);
      }
      else {
          console.log(00,response.msg);
          toggleAddUpdateChunks();
      }

      populateTable();
  });
};



// Delete User
function deleteUser(event) {

    event.preventDefault();
  
    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');
  
    // Check and make sure the user confirmed
    if (confirmation === true) {
  
      // If they did, do our delete
      $.ajax({
        type: 'DELETE',
        url: '/users/deleteuser/' + $(this).attr('rel')
      }).done(function( response ) {
  
        // Check for a successful (blank) response
        if (response.msg === '') {
        }
        else {
          alert('Error: ' + response.msg);
        }
  
        // Update the table
        populateTable();
  
      });
  
    }
    else {
  
      // If they said no to the confirm, do nothing
      return false;
  
    }
  
};
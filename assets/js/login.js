firebase.firestore().enablePersistence()
var db = firebase.firestore();
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
    	var user = firebase.auth().currentUser
    	var users = db.collection('users');
      	 users.where("email", "==", user.email).get().then(function(querySnapshot){
			if(querySnapshot.empty){
				$('#loginError').removeClass('hide');
        		$('#loginError').text('Username is not registered. Please try again.');
        		$("#loginBtn").show();
    			$('#loginProgress').addClass('hide');	
				
				firebase.auth().signOut().then(function() {
			    }).catch(function(error) {
			      alert(error.message);
			    });
			}else{
				if(user.uid === 'C7WLwOKq9ufefZ8s6Ol0MMmsrV32'){
      				window.location.replace("index.html");
      			}else{
      				window.location.replace("student.html");
      			}
			}
		});

    } else {
    }});

function validateEmail(sEmail) {
  var reEmail = /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;
  if(!sEmail.match(reEmail)) {
    $('#signUpErrMsg').removeClass('hide');	
    $('.sem').html('Wrong email format. Please try again');	
    setTimeout(function(){ $('#signUpErrMsg').addClass('hide'); },3000);
    console.log('wrong email format');
    return false;
  }
  return true;}

function loginUser(){
  	var email = $("#loginEmail").val();
  	var password = $("#loginPassword").val();
  	$("#loginBtn").hide();
  	$('#loginProgress').removeClass('hide');

    if(email != "" && password != ""){

      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error){
        $('#loginError').removeClass('hide');
        $('#loginError').text(error.message);
        $("#loginBtn").show();
    	$('#loginProgress').addClass('hide');
      })

    }}

$(document).on('click', '#loginBtn', function (event) {
  event.preventDefault();
  loginUser();
});
$("form#loginForm").on("submit",function(event){
	event.preventDefault();
	loginUser();
});

$("#signUpBtn").on("click",function(event){
	event.preventDefault();
	
	var student_id = $('#student_number').val();
	var student_email = $('#email').val();
	var password = $('#password').val();
	var repassword = $('#repassword').val();
	var students = db.collection('students');
	var users = db.collection('users');
	
	//check for same passwords
	if(password !== repassword){
		$('#signUpErrMsg').removeClass('hide');	
	    $('.sem').html('Passwords do not match. Please try again');	
	    setTimeout(function(){ $('#signUpErrMsg').addClass('hide'); },3000);
	    console.log('Password do not match');
	    throw "Passwords do not match";			
	}

	//check for valid student number
	students.where("student_id", "==", student_id).get().then(function(querySnapshot) {
	    	if(querySnapshot.empty){
	    		$('#signUpErrMsg').removeClass('hide');	
	    		$('.sem').html('Invalid Student Number. Please try again');	
	    		setTimeout(function(){ $('#signUpErrMsg').addClass('hide'); },3000);
	    		console.log('No Student');
	    	}else{
		        querySnapshot.forEach(function(doc) {
			        
			        //check users for existing email.
			        users.where("email", "==", student_email).get().then(function(querySnapshot){
			        	if(querySnapshot.empty){
		    				users.add({
							    email: student_email,
							    first_name: doc.data().first_name,
							    last_name: doc.data().last_name,
							    middle_initial: doc.data().middle_name
							})
							.then(function(docRef) {
							    var x = db.collection("users").doc(docRef.id);
							    x.update({ user_id: docRef.id });
							    console.log("Document written with ID: ", docRef.id);
							})
							.catch(function(error) {
							    console.error("Error adding document: ", error);
							});
							
							
							firebase.auth().createUserWithEmailAndPassword(student_email, password).catch(function(error) {
							  // Handle Errors here.
							  var errorCode = error.code;
							  var errorMessage = error.message;
							  // ...
							  console.log(errorMessage);
							});


			        	}else{
			        		$('#signUpErrMsg').removeClass('hide');	
		    				$('.sem').html('Email Already taken. Please try again');	
		    				setTimeout(function(){ $('#signUpErrMsg').addClass('hide'); },3000);
		    				console.log('email taken');
			        	}
			        });

		        });
	    	}
	    })
	    .catch(function(error) {
	        console.log("Error getting documents: ", error);
	    });
});
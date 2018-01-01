firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // window.location.href = 'index.html';
      // window.location.replace("index.html");
       var user = firebase.auth().currentUser;
       if (user != null) {
		  user.providerData.forEach(function (profile) {
		    // console.log("Sign-in provider: " + profile.providerId);
		    // console.log("  Provider-specific UID: " + profile.uid);
		    // console.log("  Name: " + profile.displayName);
		    // console.log("  Email: " + profile.email);
		    // console.log("  Photo URL: " + profile.photoURL);
		    getNamebyEmail(profile.email);
		    getUserIDbyEmail(profile.email);
		    getBorrowedBooks();
		  });
		}
			if(user.uid === 'C7WLwOKq9ufefZ8s6Ol0MMmsrV32'){
					firebase.auth().signOut().then(function() {
				      // Sign-out successful.
				      window.location.replace('login.html');
				    }).catch(function(error) {
				      alert(error.message);
				    });
      		}
    } else {
      // No user is signed in.
      window.location.replace("login.html");
    }
});
firebase.firestore().enablePersistence()
var db = firebase.firestore();
	var d = new Date();
var curr_date = d.getDate();
var curr_month = d.getMonth();
var curr_year = d.getFullYear();
var month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";
var n = month[d.getMonth()];
var due_date_day = curr_date + 2;
var datenow = curr_date + "-" + n + "-" + curr_year;
var date_due_from_now = due_date_day + "-" + n + "-" + curr_year;

function getNamebyEmail(email){
	db.collection("users").where("email", "==", email)
	    .get()
	    .then(function(querySnapshot) {
	        querySnapshot.forEach(function(doc) {
	        	$('#user_name').html(doc.data().first_name);
	        	$('#user_fullname').val(doc.data().last_name + ', ' + doc.data().first_name + ' ' + doc.data().middle_initial);
	        	getMyPendingApprovalCounter(doc.data().last_name + ', ' + doc.data().first_name + ' ' + doc.data().middle_initial);
	        	getMyApprovedCounter(doc.data().last_name + ', ' + doc.data().first_name + ' ' + doc.data().middle_initial);
				getOverdueCounter(doc.data().last_name + ', ' + doc.data().first_name + ' ' + doc.data().middle_initial);
				getMyPendingApprovalList(doc.data().last_name + ', ' + doc.data().first_name + ' ' + doc.data().middle_initial);
				getMyApprovedList(doc.data().last_name + ', ' + doc.data().first_name + ' ' + doc.data().middle_initial);
				getMyOverdueList(doc.data().last_name + ', ' + doc.data().first_name + ' ' + doc.data().middle_initial);
	        });
	    })
	    .catch(function(error) {
	        console.log("Error getting documents: ", error);
	    });
}
function getUserIDbyEmail(email){
	db.collection("users").where("email", "==", email)
	    .get()
	    .then(function(querySnapshot) {
	        querySnapshot.forEach(function(doc) {
	        	$('#user_id').val(doc.data().user_id);
	            // console.log(doc.id, " => ", doc.data());
	        });
	    })
	    .catch(function(error) {
	        console.log("Error getting documents: ", error);
	    });
}
function returnUserIDbyEmail(email){
	db.collection("users").where("email", "==", email)
	    .get()
	    .then(function(querySnapshot) {
	        querySnapshot.forEach(function(doc) {
	        	return doc.data().user_id;
	            // console.log(doc.id, " => ", doc.data());
	        });
	    })
	    .catch(function(error) {
	        console.log("Error getting documents: ", error);
	    });
}
function searchBook(kw){
	if(kw !== ''){
		$('#results').html('');
		// console.log(1);
	db.collection("books").where("book", "==", kw)
	    .get()
	    .then(function(querySnapshot) {
			$('#results').html('');
	        querySnapshot.forEach(function(doc) {
	            // console.log(doc.id, " => ", doc.data());
    			$('#results').append('<a class="modal-trigger bookModal" href="#bookInfoModal" key="'+ doc.id +'"' 
    									+ doc.id + '><ul class="collection hoverable search_item"><li class="collection-item black-text">' 
    									+ doc.data().book + ' (' + doc.data().copyright_year + ')<br><sub class="grey-text">' + doc.data().author + '</sub></li></ul></a>');
	        });
	    })
	    .catch(function(error) {
	        console.log("Error getting documents: ", error);
	    });
	}else{
		$('#results').addClass('hide');
		$('#results').html('');
	}
}

function randomQuote(ceiling){
	var quotesRecords = db.collection('quotes');
	var x = Math.floor((Math.random() * ceiling) + 1);
	var lastKnownKey = null;
	var quote = null;
	var quote_author = null;
	quotesRecords.orderBy("quote").limit(x).get().then(function(querySnapshot){
		 querySnapshot.forEach(function(doc) {
		 	lastKnownKey = doc.data().quote_id;
		 	quote = doc.data().quote;
		 	quote_author = doc.data().author;
		 });
		 // console.log(quote_author + ': ' + quote);
		 $('#randomQuote').html(quote);
      	 $('#randomQuoteAuthor').html('~' + quote_author);
	});
}

function getGreeting(){
  var thehours = new Date().getHours();
  var themessage;
  var morning = ('Good Morning');
  var afternoon = ('Good Afternoon');
  var evening = ('Good Evening');

  if (thehours >= 0 && thehours < 12) {
    themessage = morning; 

  } else if (thehours >= 12 && thehours < 17) {
    themessage = afternoon;

  } else if (thehours >= 17 && thehours < 24) {
    themessage = evening;
  }

  $('.greeting').html(themessage);
}

$('.searchtrigger2').on('input',function(e){
	var kw = $('.searchtrigger2').val();
	// console.log(kw);
	$('#results').removeClass('hide');
	searchBook(kw);
});
$('.searchtrigger').on('input',function(e){
	var kw = $('.searchtrigger').val();
	// console.log(kw);
	$('#results').removeClass('hide');
	searchBook(kw);
});
function newBooks(){
	var bookRecords = db.collection('books');
	bookRecords.orderBy("date_added", "desc").limit(3).get().then(function(querySnapshot){
		querySnapshot.forEach(function(doc){
			// console.log(doc.data());
			$('#newly_added_books').append('<a class="modal-trigger bookModal" href="#bookInfoModal" key="'+ doc.id +'"><ul class="collection hoverable"><li class="collection-item black-text">' + doc.data().book + 
				'<br><sub class="grey-text text-darken-2">'+ doc.data().author +"</sub></li></ul></a>");
		});
	});
}
$(".signOutBtn").click(function(){
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      window.location.replace('login.html');
    }).catch(function(error) {
      alert(error.message);
    });
});


$(document).on('click', '.bookModal', function (event) {
	var book_id = $(this).attr("key");
	var docRef = db.collection("books").doc(book_id);

	docRef.get().then(function(doc) {
	    if (doc.exists) {
	    	$('#bookInfoID').val(book_id);
	        $('#bookInfoTitle').val(doc.data().book);
	        $('#bookInfoAuthor').val(doc.data().author);
	        $('#bookInfoYear').val(doc.data().copyright_year);
	        $('#bookInfoPages').val(doc.data().pages);
	        $('#bookInfoPublisher').val(doc.data().publisher);
	        $('#bookInfoCallNumber').val(doc.data().call_number);
	        $('#bookInfoAccessionNumber').val(doc.data().accession_number);
	        $('#bookInfoDDClass').val(doc.data().ddc_class);
	    } else {
	        console.log("No such document!");
	    }
	}).catch(function(error) {
	    console.log("Error getting document:", error);
	});
});

function getBorrowedBooks(){
	var user = firebase.auth().currentUser;
	if (user != null) { var email = user.email; } 
	// console.log(email);
	db.collection("users").where("email", "==", email)
	    .get()
	    .then(function(querySnapshot) {
	        querySnapshot.forEach(function(doc) {
	       		var user_id = doc.data().user_id;
	        	// console.log(user_id);
	            // console.log(doc.id, " => ", doc.data());(
	            docRef = db.collection("users").doc(user_id).collection('borrowed_book').get().then(function(querySnapshot){
	            	if(querySnapshot.empty){ $('#empty_borrowed').removeClass('hide') }else{
	            		$('#borrowed_table').append('<thead><tr><th>Book</th><th>Date Borrowed</th><th>Date of Return</th></tr></thead><tbody id="borrowed_table_body"></tbody>');
	            	}
					querySnapshot.forEach(function(doc){
						if (doc.exists) {
					        // console.log("Document data:", doc.data());
					        
					        // console.log(book);
					        $('#borrowed_table_body').append('<tr><td>'+ doc.data().book +
					        								'</td><td>'+ doc.data().date_borrowed +
					        								'</td><td>'+ doc.data().date_due +'</td></tr>')
					    }
					});
				});
	        });
	    });}

$(document).on('click', '.borrow_book_btn', function (event) {
	var book_id = $('#borrow_bookID').val();
	var book_title = $('#borrow_bookTitle').val();
	var user_id = $('#user_id').val();
	var user_borrowed_books = db.collection("users").doc(user_id).collection('borrowed_book').doc(book_id);
	user_borrowed_books.set({
	    book: book_title,
	    date_borrowed: datenow,
	    date_due: date_due_from_now
	}).then(function(docRef) {
	    // console.log("Document written with ID: ", docRef);
	    location.reload();
	})
	.catch(function(error) {
	    console.error("Error adding document: ", error);
	});
});
function getMyPendingApprovalCounter(user_fullname){
	var requestRef = db.collection("requests");
	var counter = 0;
	requestRef.where("borrower_name", "==", user_fullname).where("status", "==" , "Pending Approval")
	    .onSnapshot(function(snapshot){
	    	snapshot.docChanges.forEach(function(change){
	    		if (change.type === "added") {
	        		counter += 1;
	            }
	            if (change.type === "removed") {
	        		counter -= 1;
	            }
	    	});
	        $('.myPendingCount').html(counter);
	    });
}
function getMyApprovedCounter(user_fullname){
	var requestRef = db.collection("requests");
	var counter = 0;
	requestRef.where("borrower_name", "==", user_fullname).where("status", "==" , "Approved")
	    .onSnapshot(function(snapshot){
	    	snapshot.docChanges.forEach(function(change){
	    		if (change.type === "added") {
	        		counter += 1;
	            }
	            if (change.type === "removed") {
	        		counter -= 1;
	            }
	    	});
	        $('.myApprovedCount').html(counter);
	    });
}
function getOverdueCounter(user_fullname){
	var requestRef = db.collection("requests");
	var counter = 0;
	requestRef.where("borrower_name", "==", user_fullname).where("status", "==" , "Overdue")
	    .onSnapshot(function(snapshot){
	    	snapshot.docChanges.forEach(function(change){
	    		if (change.type === "added") {
	        		counter += 1;
	            }
	            if (change.type === "removed") {
	        		counter -= 1;
	            }
	    	});
	        $('.myOverdueCount').html(counter);
	    });
}
function getMyPendingApprovalList(user_fullname){
	var requestRef = db.collection("requests");
	requestRef.where("borrower_name", "==", user_fullname).where("status", "==" , "Pending Approval")
		.onSnapshot(function(snapshot){
	    	snapshot.docChanges.forEach(function(change){
	    		if (change.type === "added") {
	        		var currentRequest = '<a href="#requestView" class="modal-trigger requestView" id="'+ change.doc.id +'"><ul class="collection hoverable"><li class="collection-item black-text">' + change.doc.data().book_name + '<br><sub class="grey-text">Request Date: ' + change.doc.data().date_of_request + '</sub></li></ul></a>';
	        		$('#pendingApprovalList').append(currentRequest);
	            }
	            if (change.type === "removed") {
	        		$('#' + change.doc.id).remove();
	            }
	    	});
	    });
}

function getMyApprovedList(user_fullname){
	var requestRef = db.collection("requests");
	requestRef.where("borrower_name", "==", user_fullname).where("status", "==" , "Approved")
		.onSnapshot(function(snapshot){
	    	snapshot.docChanges.forEach(function(change){
	    		if (change.type === "added") {
	        		var currentRequest = '<a href="#requestView" class="modal-trigger requestView" id="'+ change.doc.id +'"><ul class="collection hoverable"><li class="collection-item black-text">' + change.doc.data().book_name + '<br><sub class="grey-text">Request Date: ' + change.doc.data().date_due + '</sub></li></ul></a>';
	        		$('#approvedList').append(currentRequest);
	            }
	            if (change.type === "removed") {
	        		$('#' + change.doc.id).remove();
	            }
	    	});
	    });
}

function getMyOverdueList(user_fullname){
	var requestRef = db.collection("requests");
	requestRef.where("borrower_name", "==", user_fullname).where("status", "==" , "Overdue")
		.onSnapshot(function(snapshot){
	    	snapshot.docChanges.forEach(function(change){
	    		if (change.type === "added") {
	        		var currentRequest = '<a href="#requestView" class="modal-trigger requestView" id="'+ change.doc.id +'"><ul class="collection hoverable"><li class="collection-item black-text">' + change.doc.data().book_name + '<br><sub class="grey-text">Request Date: ' + change.doc.data().date_due + '</sub></li></ul></a>';
	        		$('#overdueList').append(currentRequest);
	            }
	            if (change.type === "removed") {
	        		$('#' + change.doc.id).remove();
	            }
	    	});
	    });
}

randomQuote(8);
getGreeting();
newBooks();


function getAllBooks(){
	db.collection('books').onSnapshot(function(snapshot) {
        snapshot.docChanges.forEach(function(change) {
            if (change.type === "added") {
                var currentBook = '<tr id="'+ change.doc.id +'"><td><a href="#bookInfoModal" class="modal-trigger" id="bookInfoModalBtn" key="'
	        							+ change.doc.id +'">' + change.doc.data().book + '</td><td>' 
	        							+ change.doc.data().author + '</td><td>'+ change.doc.data().copyright_year +'</td></tr>';
	        	$('#booksTableBody').append(currentBook);
            }
            if (change.type === "modified") {
                $('tr#' + change.doc.id).remove();
             	var currentBook = '<tr id="'+ change.doc.id +'"><td><a href="#bookInfoModal" class="modal-trigger" id="bookInfoModalBtn" key="'
	        							+ change.doc.id +'">' + change.doc.data().book + '</td><td>' 
	        							+ change.doc.data().author + '</td><td>'+ change.doc.data().copyright_year +'</td></tr>';
	        	$('#booksTableBody').append(currentBook);   
            }
            if (change.type === "removed") {
                $('tr#' + change.doc.id).remove();
            }
		    });
	        $('#booksTable').DataTable({
		        responsive: true,
		        "order": [[ 2, "desc" ]]
    		});
    		 $.fn.dataTable.ext.errMode = 'none';

		    $('#booksTable').on( 'error.dt', function ( e, settings, techNote, message ) {
		    } ) ;
        });
}

$(document).on('click', '#viewMessageBtn', function (event) { 
	$('.senderList').addClass('hide');
	$('.messageList').removeClass('hide');
	var user_fullname = $('#user_fullname').val();
							$('#msgListing').empty();
	var docRef = db.collection("messages").where("student_name", "==", user_fullname);
		docRef.get().then(function(querySnapshot) {
	        querySnapshot.forEach(function(doc) {
				var user_messagesRef = db.collection("messages").doc(doc.id).collection('user_messages').orderBy('current_timestamp', 'asc');
				user_messagesRef.onSnapshot(function(snapshot){
					snapshot.docChanges.forEach(function(change){
						if(change.type === 'added'){
							var from = '';
						if(change.doc.data().from === 'user'){
							from = 'right-align';
						} 
						// console.log(change.doc.data());
						var currentMessageInfo = '<li id="'+ change.doc.id +'" class="msg collection-item ' + from + '">' + change.doc.data().message + '</li>';
			        	$('#msgListing').append(currentMessageInfo);
						}
						if (change.type === "removed") {
							$('#' + change.doc.id).remove();
						}
					});
				});
	        });
	    });

});

$(document).on('click', '#backMessageBtn', function (event) { 
	$('.senderList').removeClass('hide');
	$('.messageList').addClass('hide');
});

$(document).on('click', '#cancelRequestBtn', function (event) {
	event.preventDefault();
	var requestID = $('#requestID').val();
	db.collection("requests").doc(requestID).delete().then(function() {
	    Materialize.toast('You have successfully cancelled your request.', 5000);
	    $('#requestView').modal('close');
	}).catch(function(error) {
	    Materialize.toast('Oh Bollocks! An error occured. <br>Please try again.', 5000);
	    $('#requestView').modal('close');
	});
});

$(document).on('click', '#sendMessageBtn', function (event) {
	event.preventDefault();
	var user_fullname = $('#user_fullname').val();
	var message = $('#sendMessageMsg').val();
	var docRef = db.collection("messages").where("student_name", "==", user_fullname);
		docRef.get().then(function(querySnapshot) {
	        querySnapshot.forEach(function(doc) { 
	        	console.log(doc.id);
	        	var messageRef = db.collection('messages').doc(doc.id);
					messageRef.update({
				    	status: 'Unread'
					});
	        	messageRef.collection("user_messages").add({
	        		current_timestamp: firebase.firestore.FieldValue.serverTimestamp(),
				    date_sent: datenow,
				    from: 'user',
				    message: message,
				    status: 'Unread'
	        	});
	        	$('#sendMessageMsg').val('');
	        });
	    });
});
$(document).on('click', '#borrowBookBtn', function (event) {
	event.preventDefault();
	var bookID = $('#bookInfoID').val();
	var user_fullname = $('#user_fullname').val();
	var requestsRef = db.collection('requests');
	var book_name = $('#bookInfoTitle').val();
	requestsRef.add({
	    book_id: bookID,
	    book_name: book_name,
	    borrower_name: user_fullname,
	    date_of_request: datenow,
	    status: 'Pending Approval'
	});
	$('#bookInfoModal').modal('close');
	return Materialize.toast('You have requested for book successfully.<br>Please wait for the Librarian\'s Approval.', 5000);
});
$(document).on('click', '.overdueView', function (event) {
	event.preventDefault();
	var requestID = $(this).attr("id");
	var docRef = db.collection("requests").doc(requestID);
	
	docRef.get().then(function(doc) {
	    if (doc.exists) {
	        $('#overdueBookTitle').val(doc.data().book_name);
	        $('#overdueBookBorrowDate').val(doc.data().date_borrowed);
	        $('#overdueBookDueDate').val(doc.data().date_due);
	    } else {
	        console.log("No such document!");
	    }
	}).catch(function(error) {
	    console.log("Error getting document:", error);
	});	
});
$(document).on('click', '.requestView', function (event) {
	event.preventDefault();
	var requestID = $(this).attr("id");
	var docRef = db.collection("requests").doc(requestID);
	
	docRef.get().then(function(doc) {
	    if (doc.exists) {
	    	$('#requestID').val(requestID);
	        $('#requestBookTitle').val(doc.data().book_name);
	        $('#requestBookDate').val(doc.data().date_of_request);
	        $('#requestBookStatus').val(doc.data().status);
	    } else {
	        console.log("No such document!");
	    }
	}).catch(function(error) {
	    console.log("Error getting document:", error);
	});	
});
$(document).on('click', '#bookInfoModalBtn', function (event) {
	event.preventDefault();
	var book_id = $(this).attr("key");
	var docRef = db.collection("books").doc(book_id);

	docRef.get().then(function(doc) {
	    if (doc.exists) {
	    	$('#bookInfoID').val(book_id);
	        $('#bookInfoTitle').val(doc.data().book);
	        $('#bookInfoAuthor').val(doc.data().author);
	        $('#bookInfoYear').val(doc.data().copyright_year);
	        $('#bookInfoPages').val(doc.data().pages);
	        $('#bookInfoPublisher').val(doc.data().publisher);
	        $('#bookInfoCallNumber').val(doc.data().call_number);
	        $('#bookInfoAccessionNumber').val(doc.data().accession_number);
	        $('#bookInfoDDClass').val(doc.data().ddc_class);
	    } else {
	        console.log("No such document!");
	    }
	}).catch(function(error) {
	    console.log("Error getting document:", error);
	});
});

$(document).on('click', '.backToInbox', function (event) {
	if($(window).width() < 601){
  		$('.inboxList').removeClass('hide');
  		$('.messageList').addClass('hide-on-small-only');
	    $('.messageList').addClass('hide');
	    $('.messageList').removeClass('s12');
  	}
});

$(document).on('click', '.show-message', function (event) {
  event.preventDefault();

  if($(window).width() < 601){
  	$('.inboxList').addClass('hide');
  }else{
  	$('.inboxList').removeClass('hide');
  }

  $('.messageList').removeClass('hide-on-small-only');
  $('.messageList').removeClass('hide');
  $('.messageList').addClass('s12');
  $('.newMessageIndicator').remove();
  //update message_status - set to read
  var key = $(this).attr("key");
  var name = $(this).html();
  $('#messageID').val(key);
  $('#messageSender').html(name);
	  var messageRef = db.collection("messages").doc(key);
		messageRef.update({
	    	status: 'Read'
		});

  $('.msg').remove();
	messageRef.collection('user_messages').orderBy('current_timestamp', 'asc').onSnapshot(function(snapshot){
		snapshot.docChanges.forEach(function(change){
			if(change.type === 'added'){

			var user_messageRef = messageRef.collection('user_messages').doc(change.doc.id);
				user_messageRef.update({
			    	status: 'Read'
				});
			var from = '';
			if(change.doc.data().from === 'admin'){
				from = 'right-align';
			} 
			var currentMessageInfo = '<a id="'+ change.doc.id +'" class="msg collection-item ' + from + '">' + change.doc.data().message + '</a>';
        	$('.msglist').append(currentMessageInfo);
			
			}
			if (change.type === "removed") {
				$('#' + change.doc.id).remove();
			}
		});
	});
});

function getMessages(){
	db.collection("messages").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
        	var unread = '';
        	if(doc.data().status === 'Unread'){
        		unread = '<span class="new badge newMessageIndicator"></span>';
        	}
        	var currentMessage = '<a href="#" class="collection-item show-message" id="'+ doc.id +'" key="'+ doc.id +'">' + doc.data().student_name + unread + '<i class="material-icons right">navigate_next</i></a>';
        	$('.inboxList').append(currentMessage);
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}

$(document).on('click', '.myAccountModal', function (event) {
  event.preventDefault();
	var user = firebase.auth().currentUser;
	$('#myAccountEmail').val(user.email);
});

$(document).on('click', '#replyToBtn', function (event) {
  event.preventDefault();
    var messageID = $('#messageID').val();
	var reply = $('#reply').val();
	var user_messageRef = db.collection("messages").doc(messageID).collection('user_messages');
		$('#reply').val('');
	user_messageRef.add({
	    current_timestamp: firebase.firestore.FieldValue.serverTimestamp(),
	    date_sent: datenow,
	    from: 'admin',
	    message: reply,
	    status: 'User-Unread'
	});

});

$(document).on('click', '#updateMyAccountBtn', function (event) { 
	var user = firebase.auth().currentUser;
	var newPassword = $('#myAccountPassword').val();

	user.updatePassword(newPassword).then(function() {
	  Materialize.toast('Your password has been changed.', 5000);
	  $('#myAccount').modal('close');
	}).catch(function(error) {
	  Materialize.toast('Oh Bollocks. An error occured. <br>Please try again.', 5000);
	  $('#myAccount').modal('close');
	});
});

$('#myAccountPassword').on('input',function() { 
	var password = $('#myAccountPassword').val();
	if(password.length < 6){
        $('.myAccountError').removeClass('hide');
		$('.myAccountError').html('Your password should be atleast 6 characters.');
        $('#updateMyAccountBtn').addClass('disabled');
	}else{
        $('.myAccountError').addClass('hide');
        $('#updateMyAccountBtn').removeClass('disabled');
	}
});

$('#myAccountCPassword').on('input',function() {
    if ($('#myAccountPassword').val() != $('#myAccountCPassword').val()) {
        $('.myAccountError').removeClass('hide');
        $('.myAccountError').html('Your passwords do not match. Please try again.');
        $('#updateMyAccountBtn').addClass('disabled');
    } else {
        $('.myAccountError').addClass('hide');
        $('#updateMyAccountBtn').removeClass('disabled');
    }
});
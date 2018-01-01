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
			if(user.uid !== 'C7WLwOKq9ufefZ8s6Ol0MMmsrV32'){
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

function addNewBook(accession, author, book, callnumber, copyright_year, pages, publisher, dd_class){
	db.collection("books").add({
	    accession_number : accession,
	    author: author,
	    book: book,
	    call_number: callnumber,
	    copyright_year: copyright_year,
	    date_added: datenow,
	    ddc_class: dd_class,
	    pages: pages,
	    publisher: publisher
	})
	.then(function(docRef) {
	})
	.catch(function(error) {
	    console.error("Error adding document: ", error);
	});
}

function getNamebyEmail(email){
	db.collection("users").where("email", "==", email)
	    .get()
	    .then(function(querySnapshot) {
	        querySnapshot.forEach(function(doc) {
	        	$('#user_name').html(doc.data().first_name);
	            // console.log(doc.id, " => ", doc.data());
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

$("form#addNewQuote").on("submit",function(event){
	event.preventDefault();
	var new_quote = $('#new_quote').val();
	var quote_author = $('#quote_author').val();
	db.collection("quotes").add({
	    author: quote_author,
	    quote: new_quote
	})
	.then(function(docRef) {
	    // console.log("Document written with ID: ", docRef.id);
	    var x = db.collection("quotes").doc(docRef.id);
	    x.update({ quote_id: docRef.id });
	})
	.catch(function(error) {
	    console.error("Error adding document: ", error);
	});

	$('#addNewQuote')[0].reset();
	$('.quoteSubmitMessage').removeClass('hide');
	setTimeout(function(){ $('.quoteSubmitMessage').addClass('hide'); },3000);
});

$(document).on('click', '#submitQuote', function (event) {
  event.preventDefault();
  var new_quote = $('#new_quote').val();
  var quote_author = $('#quote_author').val();
		db.collection("quotes").add({
		    author: quote_author,
		    quote: new_quote
		})
		.then(function(docRef) {
		    // console.log("Document written with ID: ", docRef.id);
		    var x = db.collection("quotes").doc(docRef.id);
		    x.update({ quote_id: docRef.id });
		})
		.catch(function(error) {
		    console.error("Error adding document: ", error);
		});
	$('#addNewQuote')[0].reset();
	$('.quoteSubmitMessage').removeClass('hide');
	setTimeout(function(){ $('.quoteSubmitMessage').addClass('hide'); },3000);
	Materialize.toast('Brilliant! New Quote has been added.', 3000);
 });

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

// $(document).on('click', '.bookModal', function (event) {
// 	var book_id = $(this).attr("key");
// 	var docRef = db.collection("books").doc(book_id);

// 	docRef.get().then(function(doc) {
// 	    if (doc.exists) {
// 	        // console.log("Document data:", doc.data());
// 	        $('#borrow_bookID').val(doc.id);
// 	        $('#borrow_bookTitle').val(doc.data().book);
// 	        $('#bookModalTitle').html(doc.data().book);
// 	        $('#bookModalAuthor').html(doc.data().author + '<br><sub>Published by: ' + doc.data().publisher + ' (' + doc.data().copyright_year + ')');
// 	    } else {
// 	        console.log("No such document!");
// 	    }
// 	}).catch(function(error) {
// 	    console.log("Error getting document:", error);
// 	});
// });

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
randomQuote(5);
getGreeting();
newBooks();
// var xxxx = db.collection("users").doc("gnGh4qpe46aHfikT6AMY"); 
// xxxx.collection("borrowed_book").doc("nEqBXuOggjbYFxbP3nLf").delete().then(function() {
//     console.log("Document successfully deleted!");
// }).catch(function(error) {
//     console.error("Error removing document: ", error);
// });
$(document).on('click', '#submitBook', function (event) {
	event.preventDefault();

	var book_accession_number = $('#book_accession_number').val();
	var book_author = $('#book_author').val();
	var book_title = $('#book_title').val();
	var book_callnumber = $('#book_callnumber').val();
	var book_copyright_year = $('#book_copyright_year').val();
	var book_pages = $('#book_pages').val();
	var book_publisher = $('#book_publisher').val();
	var ddc_class = $('#ddc_class').val();

	addNewBook(book_accession_number, book_author, book_title, book_callnumber, book_copyright_year, book_pages, book_publisher, ddc_class);

	$('#addNewBook')[0].reset();
	$('.bookSubmitMessage').removeClass('hide');
	setTimeout(function(){ $('.bookSubmitMessage').addClass('hide'); },3000);
	Materialize.toast('Brilliant! ' + book_title + ' has been added.', 3000);

});

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

$(document).on('click', '#updateBookBtn', function (event) {
	event.preventDefault();
	var book_id = $('#bookInfoID').val();
    var book_title = $('#bookInfoTitle').val();
    var book_author = $('#bookInfoAuthor').val();
    var book_copyright_year = $('#bookInfoYear').val();
    var book_pages = $('#bookInfoPages').val();
    var book_publisher = $('#bookInfoPublisher').val();
    var book_callnumber = $('#bookInfoCallNumber').val();
    var book_accession_number = $('#bookInfoAccessionNumber').val();
    var book_ddclass = $('#bookInfoDDClass').val();
	var bookRef = db.collection("books").doc(book_id);

	return bookRef.update({
    	accession_number: book_accession_number,
    	author: book_author,
    	book: book_title,
    	call_number: book_callnumber,
    	copyright_year: book_copyright_year,
    	ddc_class: book_ddclass,
    	pages: book_pages,
    	publisher: book_publisher
	})
	.then(function() {
		Materialize.toast('Brilliant! Book has been updated.', 3000);
		$('#bookInfoModal').modal('close');
	})
	.catch(function(error) {
	    // The document probably doesn't exist.
	    console.error("Error updating document: ", error);
	});

});

$(document).on('click', '#deleteBookBtn', function (event) {
	event.preventDefault();
	var book_id = $('#bookInfoID').val();
    var book_title = $('#bookInfoTitle').val();

	db.collection("books").doc(book_id).delete().then(function() {
		Materialize.toast('Brilliant! ' + book_title + ' has been deleted.', 3000);
		$('#bookInfoModal').modal('close');
	}).catch(function(error) {
		Materialize.toast('Oh Bollocks! Error deleting ' + book_title + '.', 3000);
		$('#bookInfoModal').modal('close');
	});
});

function getAllQuotes(){
	db.collection('quotes').onSnapshot(function(snapshot) {
        snapshot.docChanges.forEach(function(change) {
            if (change.type === "added") {
                var currentQuote = '<tr id="'+ change.doc.data().quote_id +'"><td class="trnc8"><a href="#quoteInfoModal" class="modal-trigger " id="quoteInfoModalBtn" key="'
	        							+ change.doc.data().quote_id +'">' + change.doc.data().quote + '</td><td>' 
	        							+ change.doc.data().author + '</td></tr>';
	        	$('#quotesTableBody').append(currentQuote);
            }
            if (change.type === "modified") {
                $('tr#' + change.doc.data().quote_id).remove();
             	var currentQuote = '<tr id="'+ change.doc.data().quote_id +'"><td class="trnc8"><a href="#quoteInfoModal" class="modal-trigger " id="quoteInfoModalBtn" key="'
	        							+ change.doc.data().quote_id +'">' + change.doc.data().quote + '</td><td>' 
	        							+ change.doc.data().author + '</td></tr>';
	        	$('#quotesTableBody').append(currentQuote);
            }
            if (change.type === "removed") {
                $('tr#' + change.doc.data().quote_id).remove();
            }
		    });
	        $('#quotesTable').DataTable({
		        responsive: true,
		        "order": [[ 1, "desc" ]]
    		});
    		 $.fn.dataTable.ext.errMode = 'none';

		    $('#quotesTable').on( 'error.dt', function ( e, settings, techNote, message ) {
		    } ) ;
        });
}

$(document).on('click', '#quoteInfoModalBtn', function (event) {
	event.preventDefault();
	var quote_id = $(this).attr("key");
	var docRef = db.collection("quotes").doc(quote_id);

	docRef.get().then(function(doc) {
	    if (doc.exists) {
	    	$('#quoteInfoID').val(quote_id);
	        $('#quoteInfoAuthor').val(doc.data().author);
	        $('#quoteInfo').val(doc.data().quote);
	        
	    } else {
	        console.log("No such document!");
	    }
	}).catch(function(error) {
	    console.log("Error getting document:", error);
	});
});

$(document).on('click', '#updateQuoteBtn', function (event) {
	event.preventDefault();
	var quote_id = $('#quoteInfoID').val();
    var quote_author = $('#quoteInfoAuthor').val();
    var quote = $('#quoteInfo').val();
	var quoteRef = db.collection("quotes").doc(quote_id);

	return quoteRef.update({
    	author: quote_author,
    	quote: quote
	})
	.then(function() {
		Materialize.toast('Brilliant! Quote has been updated.', 3000);
		$('#quoteInfoModal').modal('close');
	})
	.catch(function(error) {
	    // The document probably doesn't exist.
	    console.error("Error updating document: ", error);
	});

});

$(document).on('click', '#deleteQuoteBtn', function (event) {
	event.preventDefault();
	var quote_id = $('#quoteInfoID').val();

	db.collection("quotes").doc(quote_id).delete().then(function() {
		Materialize.toast('Brilliant! Quote has been deleted.', 3000);
		$('#quoteInfoModal').modal('close');
	}).catch(function(error) {
		Materialize.toast('Oh Bollocks! Error deleting quote.', 3000);
		$('#quoteInfoModal').modal('close');
	});
});

function getNewRequests(){
	db.collection('requests').where("status", "==", "Pending Approval").onSnapshot(function(snapshot) {
        snapshot.docChanges.forEach(function(change) {
            if (change.type === "added") {
                var currentRequest = '<ul id="'+ change.doc.id +'" class="collection"><li class="collection-item"><a href="#requestModal" class="modal-trigger requestModal" key="'
	        							+ change.doc.id +'">' + change.doc.data().borrower_name + '</a><br><sub class="grey-text text-darken-2">' 
	        							+ change.doc.data().book_name + '</sub></li></ul>';
	        	$('#newRequestCards').append(currentRequest);
            }
            if (change.type === "modified") {
                $('ul#' + change.doc.id).remove();
                var currentRequest = '<ul id="'+ change.doc.id +'" class="collection"><li class="collection-item"><a href="#requestModal" class="modal-trigger requestModal" key="'
	        							+ change.doc.id +'">' + change.doc.data().borrower_name + '</a><br><sub class="grey-text text-darken-2">' 
	        							+ change.doc.data().book_name + '</sub></li></ul>';
	        	$('#newRequestCards').append(currentRequest);   
            }
            if (change.type === "removed") {
                $('ul#' + change.doc.id).remove();
            }
		    });
        });
}
function getApprovedRequests(){
	db.collection('requests').where("status", "==", "Approved").onSnapshot(function(snapshot) {
        snapshot.docChanges.forEach(function(change) {
            if (change.type === "added") {
                var currentRequest = '<ul id="'+ change.doc.id +'" class="collection"><li class="collection-item"><a href="#approvedRequestModal" class="modal-trigger approvedRequestModal" key="'
	        							+ change.doc.id +'">' + change.doc.data().borrower_name + '</a><br><sub class="grey-text text-darken-2">' 
	        							+ change.doc.data().book_name + '</sub></li></ul>';
	        	$('#approvedRequestCards').append(currentRequest);
            }
            if (change.type === "modified") {
                $('ul#' + change.doc.id).remove();
                var currentRequest = '<ul id="'+ change.doc.id +'" class="collection"><li class="collection-item"><a href="#approvedRequestModal" class="modal-trigger approvedRequestModal" key="'
	        							+ change.doc.id +'">' + change.doc.data().borrower_name + '</a><br><sub class="grey-text text-darken-2">' 
	        							+ change.doc.data().book_name + '</sub></li></ul>';
	        	$('#approvedRequestCards').append(currentRequest);   
            }
            if (change.type === "removed") {
                $('ul#' + change.doc.id).remove();
            }
		    });
        });
}
function getOverdueBooks(){
	db.collection('requests').where("status", "==", "Overdue").onSnapshot(function(snapshot) {
        snapshot.docChanges.forEach(function(change) {
            if (change.type === "added") {
                var currentRequest = '<ul id="'+ change.doc.id +'" class="collection"><li class="collection-item"><a href="#approvedRequestModal" class="modal-trigger approvedRequestModal" key="'
	        							+ change.doc.id +'">' + change.doc.data().borrower_name + '</a><br><sub class="grey-text text-darken-2">' 
	        							+ change.doc.data().book_name + '</sub></li></ul>';
	        	$('#overdueBookCards').append(currentRequest);
            }
            if (change.type === "modified") {
                $('ul#' + change.doc.id).remove();
                var currentRequest = '<ul id="'+ change.doc.id +'" class="collection"><li class="collection-item"><a href="#approvedRequestModal" class="modal-trigger approvedRequestModal" key="'
	        							+ change.doc.id +'">' + change.doc.data().borrower_name + '</a><br><sub class="grey-text text-darken-2">' 
	        							+ change.doc.data().book_name + '</sub></li></ul>';
	        	$('#overdueBookCards').append(currentRequest);   
            }
            if (change.type === "removed") {
                $('ul#' + change.doc.id).remove();
            }
		    });
        });
}

$(document).on('click', '.requestModal', function (event) {
	event.preventDefault();
	var key = $(this).attr("key");
	var docRef = db.collection("requests").doc(key);

	docRef.get().then(function(doc) {
	    if (doc.exists) {
	    	$('#requestID').val(key);
	    	$('#requestBorrowerName').val(doc.data().borrower_name);
	        $('#requestBookName').val(doc.data().book_name);
	        $('#requestDate').val(doc.data().date_of_request);
	       
	    } else {
	        console.log("No such document!");
	    }
	}).catch(function(error) {
	    console.log("Error getting document:", error);
	});
});
$(document).on('click', '#approveRequestBtn', function (event) {
	event.preventDefault();
	var requestID = $('#requestID').val(); 
	var requestRef = db.collection("requests").doc(requestID);

	return requestRef.update({
    	status: 'Approved',
    	date_borrowed: datenow,
    	date_due: date_due_from_now
	})
	.then(function() {
		Materialize.toast('Brilliant! Borrow Request has been approved.', 3000);
		$('#requestModal').modal('close');
	})
	.catch(function(error) {
	    // The document probably doesn't exist.
	    console.error("Error updating document: ", error);
	});
});

$(document).on('click', '.approvedRequestModal', function (event) {
	event.preventDefault();
	var key = $(this).attr("key");
	var docRef = db.collection("requests").doc(key);

	docRef.get().then(function(doc) {
	    if (doc.exists) {
	    	$('#requestID').val(key);
	    	$('#requestABorrowerName').val(doc.data().borrower_name);
	        $('#requestABookName').val(doc.data().book_name);
	        $('#requestADate').val(doc.data().date_of_request);
	        $('#borrowedDate').val(doc.data().date_borrowed);
	        $('#dateDue').val(doc.data().date_due);
	    } else {
	        console.log("No such document!");
	    }
	}).catch(function(error) {
	    console.log("Error getting document:", error);
	});
});

$(document).on('click', '#deleteRequestBtn', function (event) {
	event.preventDefault();
	var requestID = $('#requestID').val(); 
	var requestRef = db.collection("requests").doc(requestID);

	return requestRef.update({
    	status: 'Denied'
	})
	.then(function() {
		Materialize.toast('Brilliant! Book Request has been denied.', 3000);
		$('#requestModal').modal('close');
	})
	.catch(function(error) {
	    console.error("Error updating document: ", error);
	});
});
$(document).on('click', '#returnBookBtn', function (event) {
	event.preventDefault();
	var requestID = $('#requestID').val(); 
	var requestRef = db.collection("requests").doc(requestID);

	return requestRef.update({
    	status: 'Returned',
    	date_returned: datenow
	})
	.then(function() {
		Materialize.toast('Brilliant! Book has been returned.', 3000);
		$('#approvedRequestModal').modal('close');
	})
	.catch(function(error) {
	    console.error("Error updating document: ", error);
	});
});

function getBorrowRequestCount(){
	var x = 0;
	db.collection("requests").where("status", "==", 'Pending Approval')
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            x += 1;
        });
        $('.brcount').html(x);
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

}

function scanOverdueBooks(){
	db.collection("requests").where("status", "==", 'Approved')
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            if(doc.data().date_due < datenow){
            	console.log('overdue' + doc.data().book_name);
            	var requestRef = db.collection("requests").doc(doc.id);

				return requestRef.update({
			    	status: 'Overdue'
				});
            }
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}
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

function getUnreadMessagesCount(){
	var x = 0;
	db.collection("messages").where("status", "==", 'Unread')
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            x += 1;
        });
        $('.urmcount').html(x);
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

}

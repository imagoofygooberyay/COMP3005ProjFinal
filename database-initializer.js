//ORIGINAL CODE BY DAVID MCKENNEY
//EDITED BY TIANYOU ZUO

const PRICEMAX=300;
const PRICEMIN=10;
const ROYALTYMAX=10;
const ROYALTYMIN=1;
const MAXSTOCK = 15
const MINSTOCK = 5
const BOOKDBSIZE= 8586;


const genreList = ["Sci-Fi","Fiction","Fantasy","Art","Music","Horror","Travel"]
const pubList = ["Book.co","PrintGuys","MoreBooks","Penguin"]

//only auto generates owners
const users=["a","aa","aaa","aaaa"]

function randomStock(){
return Math.floor(Math.random()*(MAXSTOCK-MINSTOCK+1) +MINSTOCK)
}

function randomPub(){

return pubList[Math.floor(Math.random()*pubList.length)];

}

function randomGenre(){

return genreList[Math.floor(Math.random()*genreList.length)];

}

function randomPrice(){

return Math.floor(Math.random()*(PRICEMAX-PRICEMIN+1) +PRICEMIN)+0.99

}

function randomRoyalty(){

return Math.floor(Math.random()*(ROYALTYMAX-ROYALTYMIN+1) +ROYALTYMIN)

}

const mongoose = require('mongoose');
const User = require("./UserModel");
const Book = require("./BookModel")
const books = require("./bookdata.json")

mongoose.connect('mongodb://localhost/bookstore', {useNewUrlParser: true});
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	mongoose.connection.db.dropDatabase(function(err, result){
		if(err){
			console.log("Error dropping database:");
			console.log(err);
			return;
		}
		console.log("Dropped database. Starting re-creation.");

		let numBooks=0;

		books.forEach( book=>{
			let b = new Book();
			b.isbn=book.isbn13;
			b.title=book.title;
			b.author=book.authors;
		  b.genre=randomGenre();
			b.pub_name=[randomPub()]
			b.price=randomPrice();
			b.royalty=randomRoyalty();
			b.tags=book.tags;
			b.year=book.year;
			b.pages=book.page_count;
			b.stock=randomStock();
			b.save(function(err, result){
				if(err){
					console.log("Error saving: " + JSON.stringify(b));
					console.log(err.message);
				}
					numBooks++
					if(numBooks==BOOKDBSIZE){
					let finishedUsers=0
					users.forEach(user =>{
						let u = new User();

						u.username = user;
						u.password = user;
						u.last_name = user;
						u.first_name =user
						u.address =user
						u.type="owner"

						u.save(function(err, result){
							if(err){
								console.log("Error saving question: " + JSON.stringify(u));
								console.log(err.message);

							}//end usave if err

							finishedUsers++;
							if(finishedUsers == users.length){
								console.log("Finished Users.");
								mongoose.connection.close()
							}

						});//end usave func
					});//end userforea
				}
				})//end b save func

		})//end book for ea

/*
		let finishedQuestions = 0;
		questions.forEach(question => {
			let q = new Question();
			q.question = question.question
			q.correct_answer = question.correct_answer;
			q.incorrect_answers = question.incorrect_answers;

			q.save(function(err, result){
				if(err){
					console.log("Error saving question: " + JSON.stringify(q));
					console.log(err.message);
				}

				finishedQuestions++;
				if(finishedQuestions == questions.length){
					console.log("Finished Questions.");
					let finishedUsers = 0;
					users.forEach(user =>{
						let u = new User();
						u.username = user;
						u.password = user;
						u.privacy = false;
						u.save(function(err, result){
							if(err){
								console.log("Error saving question: " + JSON.stringify(q));
								console.log(err.message);
							}

							finishedUsers++;
							if(finishedUsers == users.length){
								console.log("Finished Users.");
								mongoose.connection.close()
							}
						});
					});
				}
			});
		});*/
	});
});

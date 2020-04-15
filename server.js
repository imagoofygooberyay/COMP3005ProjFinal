//Written by David McKenney
//Edited By Tianyou Zuo 101019866
DEBUGPARAMS=false;
DEBUGSESSION=false;
MAXAGE=1000*60*60
MILITOSEC =1000;
SECTOMIN=60
MINTOHOUR=60
HOURTODAY=24
TESTORDERSTAT=false
TESTONEDAY="2020-04-08"
TESTTHREEDAY="2020-04-07"
TESTCOMPLETED="2020-04-01"
TESTMONGOOSEID=true

//requires
const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);
const express = require('express');
var ObjectId=require('mongodb').ObjectId
var MObjectId = require('mongoose').Types.ObjectId;
const session =require('express-session')
//const Question = require("./QuestionModel");
const User = require("./UserModel");
const Book = require("./BookModel");
const Cart = require("./CartModel");


let genres =[];
let pubs =[];

//Database variables
let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;


const MongoDBStore = require('connect-mongodb-session')(session);
//Create the new mongo store, using the database we have been
// using already, and the collection sessiondata
const store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/tokens',
  collection: 'sessiondata'
});

const app = express();
var bp=require("body-parser")

//routes
app.set("view engine", "pug");
app.use(express.static("public"));
app.use(express.json());
app.use(session({
        secret:"spookysecret",
        cookie:{maxAge:MAXAGE},
        saveUninitialized: false,
        store: store
      }));
app.use(bp.urlencoded({extended:true}));
app.use(bp.json())
app.post("/login", validate)
app.post("/logout",logout)
app.post("/register",regvalidate)
//app.get("/profile/:userID",profile)
app.get("/profile", profile)
app.post("/privacy",privacy)
app.get("/register")
app.get("/searchbooks",parseQuery,getBooks)
app.get("/searchpage")
app.get("/book/:bookID",getBook)
app.post("/cart",cart)
app.get("/cart",getCart)
app.get("/cart/:cartID",getACart)
app.post("/verifycart",verifyCart)
app.get("/addBook")
app.post("/addBook",addBook)
app.post("/removeBook",removeBook)
app.get("/removeBook")
app.get("remfromstore")


app.get('/remfromstore', function(req, res, next) {

//  console.log(req.session.remlist)
  let remlist=req.session.remlist
  if(remlist.length==0){
    res.render("pages/removeBook",{remmessage:"Nothing to Remove",type:req.session.type,result:req.session.remlist,loggedin:req.session.loggedin,genres:genres,pubs:pubs});

  }
  else{
    let remisbn =[]
    remlist.forEach(book=>{
      remisbn.push(book.isbn)
    })

    Book.deleteMany({isbn:{$in:remisbn}},function(err,result){
      if (err) throw err
      req.session.remlist=[]
      res.render("pages/removeBook",{remmessage:"Successfully Removed",type:req.session.type,result:req.session.remlist,loggedin:req.session.loggedin,genres:genres,pubs:pubs});
    })
  }





//	res.render("pages/removeBook",{type:req.session.type,result:req.session.remlist,loggedin:req.session.loggedin,genres:genres,pubs:pubs});


});

app.get('/removeBook', function(req, res, next) {
	res.render("pages/removeBook",{type:req.session.type,result:req.session.remlist,loggedin:req.session.loggedin,genres:genres,pubs:pubs});

  return;
});


function removeBook(req,res){

  let remArr=[]
  let query = {}
  remBooks = req.body.remBooks
  remlistBooks =req.body.remlistBooks
  //console.log(remBooks)
  console.log(remlistBooks)
  if(remlistBooks){
    tmpCart=req.session.remlist
    for (rembook in remlistBooks){
      for(tmp in tmpCart){
        if (remlistBooks[rembook]==tmpCart[tmp].isbn)
            tmpCart.splice(tmp,1);
      }
    }

    req.session.remlist=tmpCart
    res.send({url:"/removeBook"});

  }else{


  if(remBooks.length==0)
    res.send(JSON.stringify({message:"NOTHING TO REMOVE"}))
  //only 1 item
  else if(remBooks.length==1)
    query.isbn=cartBooks[0]

  else{
  for(remBook in remBooks){
    let bookids = {}
    bookids.isbn=remBooks[remBook]
    remArr.push(bookids)
  }

  query.$or=remArr
  Book.find(query,function(err,result){
      console.log(result)
      if(result){
        var remlist=req.session.remlist

        //uninitialized list
        if(!remlist){
          req.session.remlist=result
          res.send({url:"/removeBook"});
        }else{
        //initialized cart
        for(rez in result)
          remlist.push(result[rez])
        req.session.remlist=remlist

        res.send({url:"/removeBook"});
      }
    }
  })
}
}
}
/*
    Book.deleteMany({isbn:{$in:remArr}},function(err,result){
      if(result){
        var seshcart=req.session.cart

        //uninitialized cart
        if(!seshcart){
          req.session.cart=result
          res.send({url:"/cart"});
        }
        else{
        //initialized cart
        for(rez in result)
          seshcart.push(result[rez])
        req.session.cart=seshcart

        res.send({url:"/cart"});
      }
      }
      });
    }//end else
  }
*/



function addBook(req,res){

console.log(req.body)

  let b = new Book();
  b.isbn=req.body.isbn;
  b.title=req.body.title;
  b.author=req.body.author;
  b.genre=req.body.genre;
  b.pub_name=req.body.pub;
  b.price=req.body.price;
  b.royalty=req.body.royalty;
  b.tags=req.body.tags;
  b.year=req.body.year;
  b.pages=req.body.pages;
  b.stock=req.body.stock;
  Book.find({isbn:req.body.isbn},function(err,findres){
    if(findres.length>=1){
      console.log(findres)
      res.send({message:"Already Have This"})
    }else{

        b.save(function(err, result){
        if(err){
          res.send({message:"Error saving: " + JSON.stringify(b)});
        }else{
          res.send({message:"Successfully Added"})
        }
      })
  }
})
}

function packageTrack(date){
  let stat=""
  let currDate = new Date()
  let orderDate = new Date(date)

  let diff = (currDate.getTime()-orderDate.getTime())/(MILITOSEC*SECTOMIN*MINTOHOUR*HOURTODAY)

  if(diff<=0)
    stat="ORDER RECIEVED"
  else if(diff>0&&diff<=1)
    stat="PACKING ORDER"
  else if(diff>1&&diff<=4)
    stat="IN TRANSIT"
  else
    stat="COMPLETED"

  return stat
}

function getACart(req,res){
let cid= req.params.cartID
let upres={}

console.log(cid)

var mongoid=new ObjectId(cid)
console.log(mongoid)
//var mongooseid =new Object

db.collection("carts").findOne({_id:mongoid},function(err,result){
  if(err) throw err
  if(result){

  let newstat = packageTrack(result.date)
  console.log(newstat)
  db.collection("carts").updateOne({_id:mongoid},{$set:{status:newstat}},function(err,results){
    if(err) throw err
    if(result){
    db.collection("carts").findOne({_id:mongoid},function(err,upresult){
    res.render("pages/cartcontents",{id:cid,
                                     status:upresult.status,
                                     date:upresult.date,
                                     shipping:upresult.shipping_address,
                                     paidby: upresult.payment_info,
                                     books:upresult.contents})

                                   })
                                 }
                                })
                              }
                            })
}

function verifyCart(req,res){

  if(req.session.loggedin){

    if(!TESTORDERSTAT)
    var today = new Date();
    if(!TESTORDERSTAT)
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    if(TESTORDERSTAT){
      date=TESTCOMPLETED
    }

    let uid = new mongo.ObjectID()

    //let uid= new mongoose.Types.ObjectId()
    console.log(uid)
    db.collection("carts").insertOne({_id:uid, date:new Date(),payment_info:req.body.card, status:"ORDER RECEIVED",shipping_address:req.body.shipping,contents:req.session.cart})


    db.collection("users").findOne({username:req.session.username},function(err,result){
       if(err) throw err;
       var checkoutcarts=[]
           checkoutcarts=result.carts

       if(!checkoutcarts)
          db.collection("users").updateOne({username:req.session.username},{$set:{carts:[uid]}},{upsert:true})
        else{
          checkoutcarts.push(uid)
          db.collection("users").updateOne({username:req.session.username},{$set:{carts:checkoutcarts}},{upsert:true})
          //rests the checkout cart


          req.session.cart=[]
          res.send({url:"/cart/"+uid})
        }
     })

  }else{
    res.send({message:"You must be registered to checkout"})
  }



}


function cart(req,res){

var cartArr=[]
let query = {}
cartBooks = req.body.addCart
remCartBooks =req.body.remCart
console.log(remCartBooks)
if(remCartBooks){
  tmpCart=req.session.cart
  for (remCart in remCartBooks){
    for(tmp in tmpCart){
      if (remCartBooks[remCart]==tmpCart[tmp].isbn)
          tmpCart.splice(tmp,1);
    }
  }

  req.session.cart=tmpCart
  res.send({url:"/cart"});

}else{

if(cartBooks.length==0)
  res.send(JSON.stringify({message:"DONT BE CHEAP ADD A BOOK"}))
//only 1 item
else if(cartBooks.length==1)
  query.isbn=cartBooks[0]

else{
for(cartBook in cartBooks){
  let bookids = {}
  bookids.isbn=cartBooks[cartBook]
  cartArr.push(bookids)
}
  query.$or=cartArr
  Book.find(query,function(err,result){
    if(result){
      var seshcart=req.session.cart

      //uninitialized cart
      if(!seshcart){
        req.session.cart=result
        res.send({url:"/cart"});
      }
      else{
      //initialized cart
      for(rez in result)
        seshcart.push(result[rez])
      req.session.cart=seshcart

      res.send({url:"/cart"});
    }
    }
    });
  }//end else
}
}

function getCart(req,res){

  res.render("pages/cart",{type:req.session.type,loggedin:req.session.loggedin,username:req.session.username,result:req.session.cart,address:req.session.address})
}

function getBook(req,res){
  console.log(req.params)
  let isbn= req.params.bookID

  Book.findOne({isbn:isbn}, function(err,result){

    console.log(result)
    if(err) throw err;
    if(result){
        res.render("pages/book",{isbn:result.isbn,
                                genre:result.genre,
                                titlename:result.title,
                                authors:result.author,
                                publishers:result.pub_name,
                                price:result.price,
                                pages:result.pages,
                                year:result.year})
    }else{
      res.render("pages/search",{type:req.session.type,loggedin:req.session.loggedin,genres:genres,message:"NO RESULTS FOUND"})

    }
  })//end find one
  }//end func


//Purpose:parses query
function parseQuery(req, res, next){
  let bookquery={}
  var queryArr=[]
  console.log(req.query)

  let isbn = req.query.isbn
  let title=req.query.titlename
  let author =req.query.author
  let pub =req.query.publisher
  let genre =req.query.genre
  let tag = req.query.tag
  let minprice =req.query.minprice
  let maxprice =req.query.maxprice

  if(isbn)
    queryArr.push({isbn:isbn})
  if(title)
    queryArr.push({title:{"$regex": new RegExp(decodeURIComponent(title),"i")}})
  if(pub)
    queryArr.push({pub_name:{"$regex": new RegExp(decodeURIComponent(pub),"i")}})
  if(genre)
    bookquery.genre=genre
  if(tag){
    var tagArr = tag.split(',')
    console.log(tagArr)
    for (querytag in tagArr)
      console.log(querytag)
      queryArr.push({tags:{"$regex": new RegExp(decodeURIComponent(tagArr[querytag]),"i")}})
    }
  if(author)
    queryArr.push({author:{"$regex": new RegExp(decodeURIComponent(author),"i")}})
  if(minprice)
    queryArr.push({"$gte": parseInt(minprice)})
  if(maxprice)
    queryArr.push({"$lte": parseInt(maxprice)})

  //no search params
  if(queryArr.length==0)
    req.booksearch
  else if(queryArr.length==1)
    req.booksearch=queryArr[0]
  else
  req.booksearch={$and: queryArr}

  //console.log(bookquery)

	next();
}

function getBooks(req,res){

  db.collection("books").find(req.booksearch).toArray(function (err,results){
		if(err) throw err;

		if(results.length==0){
			res.render("pages/search",{type:req.session.type,loggedin:req.session.loggedin,genres:genres,message:"NO RESULTS FOUND"})
		}else{
			res.format({
			'text/html': function () {
					res.render("pages/search",{type:req.session.type,loggedin:req.session.loggedin,books:results,genres:genres})
			},

			'application/json': function () {
					res.status(200).send(JSON.stringify({books:results}));
			},

		});//end resformat
		}//end else
	})//end dbfind
	}//end func

//Purpose: logs user out
function logout(req,res,next){
//destroys the session data
req.session.destroy();
res.json({url: "/"});
}

//changes the privacy setting of user in database
function privacy(req,res,next){

  let bool=false;

  if(req.body.stat=='private')
    bool=true;

  User.updatePriv(req.session.username,bool)
      .exec()

//sends new privacy status back to user
  res.send(JSON.stringify(req.body.stat))
}

//Purpose:validates registration of user
function regvalidate(req,res,next){

let uname=req.body.username
let fname=req.body.fname
let lname=req.body.lname
let addy=req.body.addy
let payinfo=req.body.payinfo
let pass=req.body.password

User.findOne({username:uname}, function(err,result){
   if(err) throw err;
   if(!result){
     let uid = new mongo.ObjectID()
     db.collection("users").insertOne({_id:uid,username:uname,password:pass,first_name:fname,last_name:lname,address:addy,payment_info:payinfo})
       req.session.username=uname
       req.session.loggedin=true;
       req.session.address=addy
       res.send({url:"/profile"});
    }else if(result){
       res.send({message:"REGISTRATION FAILED USERNAME TAKEN"});
 }
})//end find username


}//end func


//Purpose:validates login credentials of user
function validate(req,res,next){

console.log(req.body)
let password=req.body.password
let username=req.body.username


 db.collection("users").findOne({$and: [{username:username}, {password:password}]}, function(err,result){

		if(err) throw err;
    if(!result)
        res.render("pages/index",{loggedin:req.session.loggedin})
    else if(result.type=="owner"){
      req.session.username=username
      req.session.loggedin=true;
      req.session.type="owner"
      res.render("pages/profile",{type:req.session.type,results: result.carts,loggedin:req.session.loggedin,username:result.username})



		}else{
        req.session.username=username
        req.session.loggedin=true;
			res.render("pages/profile",{type:req.session.type,results: result.carts,loggedin:req.session.loggedin,username:result.username})
		}
 })
}

//Purpose:retrives user profiles from database
function profile(req,res,next){
let searchName= req.session.username

db.collection("users").findOne({username:searchName}, function(err,result){
  if(err) throw err;

  if(result){
    //renders user's own profile
  res.render("pages/profile",{type:req.session.type,results: result.carts,loggedin:req.session.loggedin,username:result.username})


  }
})//end find one
}//end func


//Purpose renders homepage for loggedin/loggedout user
app.get('/', function(req, res, next) {
  if(req.session.username)
  res.render("pages/index",{type:req.session.type,loggedin:true, username: req.session.username })
  else
	res.render("pages/index");
	return;
});

//Purpose renders homepage for loggedin/loggedout user
app.get('/register', function(req, res, next) {
	res.render("pages/register");
	return;
});

app.get('/addBook', function(req, res, next) {
	res.render("pages/addBook",{type:req.session.type,loggedin:req.session.loggedin,genres:genres,pubs:pubs});

  return;
});

app.get('/searchpage', function(req, res, next) {
	res.render("pages/search",{type:req.session.type,loggedin:req.session.loggedin,genres:genres});

  return;
});

mongoose.connect('mongodb://localhost/bookstore', {useNewUrlParser: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

  db.collection("books").distinct("genre",function(err,results){
    if(err) throw err;

    genres=results


    });

    db.collection("books").distinct("pub_name",function(err,results){
      if(err) throw err;

      pubs=results

      });





	app.listen(3000);
	console.log("Server listening on port 3000");
});

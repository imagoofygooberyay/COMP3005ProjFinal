var cartBooks=[]


function remFromStore(){

  let list = document.getElementsByClassName("buybook");
  list = Array.prototype.slice.call(list);
  for(var i=0;i<list.length;i++){
    if(list[i].checked)
      cartBooks.push(list[i].id)
  }
  req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status == 200){
      let response = JSON.parse(req.responseText)
      if(response.url)
        window.location.href = response.url;
      if(response.message)
          document.getElementById("searchmessage").innerHTML=response.message
		}
	}
	req.open("POST", "/removeBook",true);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify({addCart:cartBooks}));


}

function addValidate(){

      let isbn = document.getElementById('isbn').value
      let title = document.getElementById('title').value
      let author= document.getElementById('author').value
      let genre=  document.getElementById('genre').value
      let pub=  document.getElementById('pub').value
      let price = document.getElementById('price').value

      let royalty=  document.getElementById('royalty').value
      let tags=  document.getElementById('tags').value
      let year = document.getElementById('year').value
      let stock=  document.getElementById('stock').value
      let pages = document.getElementById('pages').value

      let intpage =parseInt(pages)
      let intstock =parseInt(stock)
      let intprice = parseInt(price)
      let introyalty = parseInt(royalty)

  if(!intpage)
    document.getElementById('pageslab').innerHTML=document.getElementById('pageslab').innerHTML+"* Requires Input"

  if(!intstock)
    document.getElementById('stocklab').innerHTML= document.getElementById('stocklab').innerHTML+"* Requires Input"

  if(!intprice)
    document.getElementById('pricelab').innerHTML= document.getElementById('pricelab').innerHTML + "* Requires Input"

  if(!introyalty)
    document.getElementById('royaltylab').innerHTML=document.getElementById('royaltylab').innerHTML+ "* Requires Input"

  if(!isbn)
    document.getElementById('isbnlab').innerHTML=document.getElementById('isbnlab').innerHTML+ "* Requires Input"
  if(!year)
    document.getElementById('yearlab').innerHTML=document.getElementById('yearlab').innerHTML+ "* Requires Input"

  if(!title)
    document.getElementById('titlelab').innerHTML=document.getElementById('titlelab').innerHTML+ "* Requires Input"

  if(!author)
      document.getElementById('authorlab').innerHTML=document.getElementById('authorlab').innerHTML+ "* Requires Input"
  if(!genre)
      document.getElementById('genrelab').innerHTML=document.getElementById('genrelab').innerHTML+ "* Requires Input"
  if(!pub)
      document.getElementById('publab').innerHTML=document.getElementById('publab').innerHTML+ "* Requires Input"

  if(!tags)
      document.getElementById('tagslab').innerHTML=document.getElementById('tagslab').innerHTML+ "* Requires Input"



  if(isbn&&title&&author&&genre&&pub&&tags&&intpage&&intstock&&intprice&&introyalty&&year){

        var tagArr = tags.split(',')
        var pubArr =pub.split(',')
        var authArr =author.split(',')
        let obj = {}
        obj.isbn=isbn
        obj.title=title
        obj.author=authArr
        obj.genre=genre
        obj.pub=pubArr
        obj.tags=tagArr
        obj.pages=intpage
        obj.stock=intstock
        obj.price=intprice
        obj.royalty=introyalty
        obj.year=year

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
              let response = JSON.parse(xhttp.responseText)
              console.log(response)
              if(response.message)
                document.getElementById("addmessage").innerHTML=response.message
              if(response.url)
                window.location.href = response.url;
              }
        };
        xhttp.open("POST", "/addBook", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(obj));
}


  }//end validate









function regvalidate(){

    let uname = document.getElementById('regusername').value
    let pass = document.getElementById('regpassword').value
    let fname= document.getElementById('fname').value
    let lname=  document.getElementById('lname').value
    let addy=  document.getElementById('address').value
    let payinfo = document.getElementById('payinfo').value


//alert("HI")
if(!uname)
  document.getElementById('regusernamelab').innerHTML=document.getElementById('regusernamelab').innerHTML+"* Requires Input"

if(!pass)
  document.getElementById('regpasswordlab').innerHTML= document.getElementById('regpasswordlab').innerHTML+"* Requires Input"

if(!fname)
  document.getElementById('fnamelab').innerHTML= document.getElementById('fnamelab').innerHTML + "* Requires Input"

if(!lname)
  document.getElementById('lnamelab').innerHTML=document.getElementById('lnamelab').innerHTML+ "* Requires Input"

if(!addy)
  document.getElementById('addresslab').innerHTML=document.getElementById('addresslab').innerHTML+ "* Requires Input"

if(!payinfo)
  document.getElementById('payinfolab').innerHTML=document.getElementById('payinfolab').innerHTML+ "* Requires Input"

if(uname&&pass&&fname&&lname&&addy&&payinfo){

    console.log("HERE")
      let obj = {}
      obj.username=uname
      obj.password=pass
      obj.fname=fname
      obj.lname=lname
      obj.addy=addy
      obj.payinfo=payinfo
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(xhttp.responseText)
            console.log(response)
            if(response.message)
              document.getElementById("regmessage").innerHTML=response.message
            if(response.url)
              window.location.href = response.url;
            }
      };
      xhttp.open("POST", "/register", true);
      xhttp.setRequestHeader("Content-Type", "application/json");
      xhttp.send(JSON.stringify(obj));


}
}//end validate

//logs user out
function logout(){

	req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status == 200){
			//redirect to appropriate page
			window.location.href = JSON.parse(req.responseText).url;
		}
	}
	req.open("POST", "/logout");
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify({logout:true}));
}

function removeFromCart(){

  let list = document.getElementsByClassName("rembook");
  list = Array.prototype.slice.call(list);
  for(var i=0;i<list.length;i++){
    if(list[i].checked)
      cartBooks.push(list[i].id)
  }
  req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if(this.readyState==4 && this.status == 200){
      let response = JSON.parse(req.responseText)
      if(response.url)
        window.location.href = response.url;
      if(response.message)
          document.getElementById("searchmessage").innerHTML=response.message
    }
  }
  req.open("POST", "/cart",true);
  req.setRequestHeader("Content-Type", "application/json");
  req.send(JSON.stringify({remCart:cartBooks}));



}


function checkCart(){

  let addy= document.getElementById("shippingaddress").value
  let cardnum = document.getElementById("cardnum").value


  if(!addy)
      document.getElementById('shippingaddresslab').innerHTML=document.getElementById('shippingaddresslab').innerHTML+" * Requires Input"
  if(!cardnum)
      document.getElementById('cardnumlab').innerHTML=document.getElementById('cardnumlab').innerHTML+" * Requires Input"

  if(addy&&cardnum){

  var obj={}
  obj.shipping=addy
  obj.card=cardnum
  req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if(this.readyState==4 && this.status == 200){
      let response = JSON.parse(req.responseText)
      if(response.url)
        window.location.href = response.url;
      if(response.message)
          document.getElementById("cartmessage").innerHTML=response.message

    }
  }
  req.open("POST", "/verifycart",true);
  req.setRequestHeader("Content-Type", "application/json");
  req.send(JSON.stringify(obj));
  }
}


function addToCart(){

  let list = document.getElementsByClassName("buybook");
  list = Array.prototype.slice.call(list);
  for(var i=0;i<list.length;i++){
    if(list[i].checked)
      cartBooks.push(list[i].id)
  }
  req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status == 200){
      let response = JSON.parse(req.responseText)
      if(response.url)
        window.location.href = response.url;
      if(response.message)
          document.getElementById("searchmessage").innerHTML=response.message
		}
	}
	req.open("POST", "/cart",true);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify({addCart:cartBooks}));
}

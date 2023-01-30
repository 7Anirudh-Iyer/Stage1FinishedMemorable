let db = firebase.database()
let nor

if(window.innerHeight/window.innerWidth < 1){
    document.getElementById("styler").href="rate.css"
} else {
    document.getElementById("styler").href="phone.css"
}

$("#submit").click(()=>{
	let review = $("#entry").text()
	let nameOfP = $("#name").text()
	if(review && nameOfP){
		db.ref("noOfRatings").on("value", (data)=>{
			nor = data.val()
			nor+=1
			db.ref("Ratings/"+nor).update({
				name: nameOfP,
				entry: review
			})
		})
		let yay = setTimeout(()=>{
			db.ref("/").update({
				noOfRatings: nor
			})
			location.href = "../MainPage/main.html"
		}, 2000)
	} else{
		alert("You have not entered the fields")
	}
})

$("document").ready(()=>{
	let nor2
	db.ref("noOfRatings").on("value", (data)=>{
		nor2 = data.val()
		for(let i = 1; i <= nor2; i++){
			let pn, pr 
			db.ref("Ratings/"+i+"/name").on("value", (data)=>{
				pn = data.val()
				db.ref("Ratings/"+i+"/entry").on("value", (data)=>{
					pr = data.val()
					let para2 = document.createElement("p")
					para2.innerHTML = pr
					para2.class = "para2"
					document.getElementById("reviews").appendChild(para2)
					let para1 = document.createElement("p")
					para1.innerHTML = "- "+pn
					para1.style.textAlign = "right"
					document.getElementById("reviews").appendChild(para1)
					let space = document.createElement("h2")
					space.innerHTML = "lkdflknsfd"
					space.style.color = "transparent"
					document.getElementById("reviews").appendChild(space)
				})
			})
		}
	})
})

$("#move").hover(()=>{
	let element = document.getElementById("reviews");
	element.scrollIntoView();
})
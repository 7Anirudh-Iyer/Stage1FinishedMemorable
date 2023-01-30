if(window.innerHeight/window.innerWidth < 1){

	let db = firebase.database()
	let uid, profile, email, name, image, cursorP, isDeleted, Mode, doNothing
	let bold = false
	let finalText
	let firstTime = 0
	let fontSize = 14

	firebase.auth().onAuthStateChanged(user => {  
		if(user && firstTime === 0) {
		    uid = user.uid
		    email = user.email
		    let noOfNotes
		    db.ref('Users/'+uid+'/NoOfNotes/').on('value', (data)=>{
				noOfNotes = data.val()
				for(let i=0; i<noOfNotes; i++){
					let title, date, content
					let j = i+1
					db.ref('Users/'+uid+'/Notes/'+j+'/title/').on('value', (data)=>{
						title = data.val()
					})
					db.ref('Users/'+uid+'/Notes/'+j+'/date/').on('value', (data)=>{
						date = data.val()
					})
					db.ref('Users/'+uid+'/Notes/'+j+'/content/').on('value', (data)=>{
						content = data.val()
					})
					db.ref('Users/'+uid+'/Mode/').on('value', (data)=>{
						Mode = data.val()
						if(Mode === "dark") {
							db.ref('Users/'+uid+'/Notes/'+j+'/isDeleted/').on('value', (data)=>{
								isDeleted = data.val()
								let myTimeout
								isDeleted == "no"
									? myTimeout = setTimeout(()=>{NoteDark(title, date, content, i)}, 500)
									: doNothing = "did nothing"
							})
						}
						if(Mode === "light") {
							db.ref('Users/'+uid+'/Notes/'+j+'/isDeleted/').on('value', (data)=>{
								isDeleted = data.val()
								let myTimeout
								isDeleted == "no"
									? myTimeout = setTimeout(()=>{NoteLight(title, date, content, i)}, 500)
									: doNothing = "did nothing"
							})
						}
					})
				}

				const d = new Date();
				let month = d.getMonth() + 1
				let day = d.getDate() + "/" + month + "/" + d.getFullYear();
				let i = noOfNotes+1
				let idOfSave = "save"+i
				let cuMo
				db.ref('Users/'+uid+'/Mode/').on('value', (data)=>{
					cuMo = data.val()
					if(cuMo === "dark"){
						$('#add1').click(()=>{
							NoteDark("New Note", day, "Type here", noOfNotes)
							db.ref('Users/'+uid).update({
								NoOfNotes: noOfNotes+1
							})
							
							db.ref('Users/'+uid+'/Notes/'+i).update({
								title: "New note",
								date: day,
								content: "type here",
								isDeleted: "no"
							})
							window.location.reload()
						})
					}
					if(cuMo === "light"){
						$('#add').click(()=>{
							NoteLight("New Note", day, "Type here", noOfNotes)
							db.ref('Users/'+uid).update({
								NoOfNotes: noOfNotes+1
							})
							db.ref('Users/'+uid+'/Notes/'+i).update({
								title: "New note",
								date: day,
								content: "type here",
								isDeleted: "no"
							})
							window.location.reload()
						})
					}
				})
			})
			firstTime = 1
		} if(!user) {
			location.href = '../SignInPage/signIn.html'
		}
	})

	$('#so').click(()=>{
		firebase.auth().signOut()
	})

	bro = true
	$('#bro').click(()=>{
		window.open("https://www.google.com", "Google", {left:0, width:40})
	})

	$('#bro1').click(()=>{
		window.open("https://www.google.com", "Google", {left:0, width:40})
	})

	ai = true
	$("#ai").click(()=>{
		if(ai === true){
			document.getElementById("aiInt").style.display = "block"
			ai = false
		} else {
			document.getElementById("aiInt").style.display = "none"
			ai = true
		}
	})

	$("#ai1").click(()=>{
		if(ai === true){
			document.getElementById("aiInt").style.display = "block"
			ai = false
		} else {
			document.getElementById("aiInt").style.display = "none"
			ai = true
		}
	})

	$('#dm').click(()=>{
		db.ref('Users/'+uid).update({
			Mode: "dark"
		})
		timerwhoo = setInterval(() => {
			window.location.reload()
		}, 200);
	})

	$('#so1').click(()=>{
		firebase.auth().signOut()
	})

	$('#dm1').click(()=>{
		db.ref('Users/'+uid).update({
			Mode: "light"
		})
		timerwhoo = setInterval(() => {
			window.location.reload()
		}, 200);
	})

	function NoteLight(title, date, content, i){

		let idOfDiv = "note"+i
		let div = document.createElement('div')
		div.id = idOfDiv
		document.getElementById('contentbar').appendChild(div)

		$('#'+idOfDiv).css({
			backgroundColor: "transparent",
			borderColor: "black",
			border: "groove",
			width: "100%",
			height: "10%",
			textAlign: "center",
			cursor: "pointer",
		})

		$('#'+idOfDiv).click(()=>{
			let remEl = document.getElementById('editor')
			while (remEl.lastElementChild) {
				remEl.removeChild(remEl.lastElementChild);
			}

			document.getElementById('edits').style.display = "block"

			let input = document.createElement('input')
			let idOfIn = "input"+i
			input.id = idOfIn
			input.value = title
			document.getElementById('editor').appendChild(input)
			$('#'+idOfIn).css({
				width: "30%",
				height: "5%",
				backgroundColor: "transparent",
				marginLeft: "37%",
				borderWidth: "1vw",
				borderRight: "none",
				borderTop: "none",
				borderBottom: "none",
				border: "none",
				textAlign: "center",
				borderColor: "skyblue",
				backgroundColor: "transparent",
				fontSize: "2vw",
				marginTop: "2%",
				fontFamily: "Annie use your telescope"
			})

			let ta = document.createElement('div')
			let pSpace = document.createElement('p')
			document.getElementById('editor').appendChild(pSpace)
			document.getElementById('editor').appendChild(ta)
			let idOfTa = "ta"+i
			ta.id = idOfTa
			$('#'+idOfTa).css({
				marginTop: "2%",
				marginLeft: "5%",
				backgroundColor: "white",
				width: "94%",
				fontFamily: "arial",
				maxHeight: "90%",
				overflow: "scroll"
			})

			let pCont = document.createElement('p')
			pCont.innerHTML = content
			pCont.contentEditable = "true"
			let idOfP = "p"+i
			pCont.id = idOfP
			document.getElementById(idOfTa).appendChild(pCont)
			$('#'+idOfP).css({
				marginTop: "5%",
				marginLeft: "4%",
				marginRight: "4%",
				marginBottom: "5%"
			})

			{
				$('#bold').click(()=>{
					document.execCommand('bold');
				})

				$('#italic').click(()=>{
					document.execCommand('italic');
				})

				$('#underline').click(()=>{
					document.execCommand('underline');
				})

				$('#left').click(()=>{
					document.execCommand('justifyLeft');
				})

				$('#right').click(()=>{
					document.execCommand('justifyRight');
				})

				$('#left').click(()=>{
					document.execCommand('justifyLeft');
				})

				$('#center').click(()=>{
					document.execCommand('justifyCenter');
				})

				$('#number').click(()=>{
					document.execCommand('insertOrderedList');
				})

				$('#bullet').click(()=>{
					document.execCommand('insertUnorderedList');
				})

				$('#font_change').click(()=>{
					let inp = document.createElement('input')
					inp.id = "inp"
					inp.value = "Enter new font here"
					document.getElementById('editor').appendChild(inp)
					$('#inp').css({
						position: "absolute",
						width: "20%",
						height: "7%",
						top: "35%",
						left: "28%"
					})
					$('#inp').keyup(e => {
						var code = (e.keyCode ? e.keyCode : e.which)
						if(code == 13){
							let newF = document.getElementById('editor').value
							document.execCommand('fontName', false, newF);
							document.getElementById('editor').removeChild(inp)
						}
					})
				})

				$('#font_size').mousedown(function(event) {
				    switch (event.which) {
				        case 1:
				            document.execCommand("fontSize", false, "2")
						    let fontElements = window.getSelection().anchorNode.parentNode
						    fontElements.id = "fe"
						    fontElements.removeAttribute("size");
						    console.log(fontElements)
						    fontSize = fontSize+1
						    final = fontSize+"px"
						    fontElements.style.fontSize = final;
						    document.getElementById("font_size").title = fontSize-13
				            break;
				        case 2:
				            break;
				        case 3:
				        	fontSize = 14
				            document.execCommand("fontSize", false, "2")
						    fontElements = window.getSelection().anchorNode.parentNode
						    fontElements.style.fontSize = 14;
						    document.getElementById("font_size").title = "click to increase; right to click to reset to smallest font size"
				            break;
				        default:
				            alert('Nothing');
				    }
				})

				$('#strike').click(()=>{
					document.execCommand('strikethrough');
				})
			}

			let save = document.createElement('button')
			let idOfSave = "save"+i
			save.id = idOfSave
			save.innerHTML = "Save"
			document.getElementById('editor').appendChild(save)
			$('#'+idOfSave).css({
				backgroundColor: "red",
				color: "white",
				fontFamily: "spirax",
				width: "10%",
				height: "5%",
				position: "absolute",
				top: 1,
				marginLeft: "66%",
				border: "none",
				borderRadius: 10,
				curson: "pointer"
			})
			$('#'+idOfSave).click(()=>{
				let j = i+1
				db.ref('Users/'+uid+"/Notes/"+j).update({
					title: $('#'+idOfIn).val(),
					content: $('#'+idOfP).html()
				})
				window.location.reload()
			})
		})

		//creating editor
		{
			let idOfTitle = "title"+i
			let tON = document.createElement('h5')
			tON.innerHTML = title
			tON.id = idOfTitle
			tON.style.marginTop = "2%"
			tON.style.fontSize = "1vw"
			tON.style.fontWeight = "bold"
			document.getElementById(idOfDiv).appendChild(tON)

			let idOfDate = "date"+i
			let dON = document.createElement('h6')
			dON.innerHTML = "Created on: "+date
			dON.id = idOfDate
			dON.style.fontSize = "1vw"
			dON.style.marginTop = "-10%"
			document.getElementById(idOfDiv).appendChild(dON)

			let idOfDel = "del"+i
			let deON = document.createElement('h6')
			deON.innerHTML = "Delete"
			deON.id = idOfDel
			deON.style.fontSize = "1vw"
			deON.style.marginTop = "-10%"
			deON.style.textDecorationLine = "underline"
			deON.onclick = function(){
				let noOfNotes
				db.ref('Users/'+uid+'/NoOfNotes/').on('value', (data)=>{
					noOfNotes = data.val()
				})
				timer = setTimeout(function() {
					let j = i+1
					db.ref('Users/'+uid+'/Notes/'+j).update({
						isDeleted: "yes",
						content: "",
						title: "",
						date: ""
					})
					window.location.reload()
				}, 100);
			}
			$('#'+idOfDiv).mouseenter(()=>{
				document.getElementById(idOfDiv).appendChild(deON)
			})
			$('#'+idOfDiv).mouseleave(()=>{
				document.getElementById(idOfDiv).removeChild(deON)
			})
		}
	}

	function NoteDark(title, date, content, i){

		$('#optionsbar').css("display", "none")
		$('#optionsbardark').css("display", "block")

		$('#edits').css("display", "none")
		$('#editsdark').css("display", "block")

		$('#contentbar').css("display", "none")
		$('#contentbardark').css("display", "block")

		$('#editor').css("display", "none")
		$('#editordark').css("display", "block")

		$('#vc').css("display", "none")
		$('#vc2').css("display", "block")

		let idOfDiv = "note"+i
		let div = document.createElement('div')
		div.id = idOfDiv
		document.getElementById('contentbardark').appendChild(div)

		$('#'+idOfDiv).css({
			backgroundColor: "transparent",
			borderLeftColor: "red",
			border: "solid",
			borderWidth: 1,
			width: "100%",
			height: "10%",
			textAlign: "center",
			cursor: "pointer",
			color: "white"
		})

		$('#'+idOfDiv).mouseenter(()=>{
			$('#'+idOfDiv).css("backgroundColor", "rgb(0, 0, 50)")
		})
		$('#'+idOfDiv).mouseleave(()=>{
			$('#'+idOfDiv).css("backgroundColor", "transparent")
		})

		$('#'+idOfDiv).click(()=>{
			let remEl = document.getElementById('editordark')
			while (remEl.lastElementChild) {
				remEl.removeChild(remEl.lastElementChild);
			}

			document.getElementById('edits').style.display = "block"

			let input = document.createElement('input')
			let idOfIn = "input"+i
			input.id = idOfIn
			input.value = title
			document.getElementById('editordark').appendChild(input)
			$('#'+idOfIn).css({
				width: "30%",
				height: "5%",
				backgroundColor: "rgb(0, 0, 30)",
				color: "white",
				marginLeft: "37%",
				borderWidth: "1vw",
				borderRight: "none",
				borderTop: "none",
				borderBottom: "none",
				border: "none",
				textAlign: "center",
				fontSize: "2vw",
				marginTop: "2%",
				fontFamily: "Annie use your telescope",
			})

			let ta = document.createElement('div')
			let pSpace = document.createElement('p')
			document.getElementById('editordark').appendChild(pSpace)
			document.getElementById('editordark').appendChild(ta)
			let idOfTa = "ta"+i
			ta.id = idOfTa
			$('#'+idOfTa).css({
				marginTop: "2%",
				marginLeft: "5%",
				backgroundColor: "rgb(0, 7, 0)",
				width: "94%",
				fontFamily: "arial",
				maxHeight: "90%",
				overflow: "scroll",
				color: "white"
			})

			let pCont = document.createElement('p')
			pCont.innerHTML = content
			pCont.contentEditable = "true"
			let idOfP = "p"+i
			pCont.id = idOfP
			document.getElementById(idOfTa).appendChild(pCont)
			$('#'+idOfP).css({
				marginTop: "5%",
				marginLeft: "4%",
				marginRight: "4%",
				marginBottom: "5%"
			})

			{
				$('#bold1').click(()=>{
					document.execCommand('bold');
				})

				$('#italic1').click(()=>{
					document.execCommand('italic');
				})

				$('#underline1').click(()=>{
					document.execCommand('underline');
				})

				$('#left1').click(()=>{
					document.execCommand('justifyLeft');
				})

				$('#right1').click(()=>{
					document.execCommand('justifyRight');
				})

				$('#left1').click(()=>{
					document.execCommand('justifyLeft');
				})

				$('#center1').click(()=>{
					document.execCommand('justifyCenter');
				})

				$('#number1').click(()=>{
					document.execCommand('insertOrderedList');
				})

				$('#bullet1').click(()=>{
					document.execCommand('insertUnorderedList');
				})

				$('#font_change1').click(()=>{
					let inp = document.createElement('input')
					inp.id = "inp"
					inp.value = "Enter new font here"
					document.getElementById('editordark').appendChild(inp)
					$('#inp').css({
						position: "absolute",
						width: "20%",
						height: "7%",
						top: "35%",
						left: "28%"
					})
					$('#inp').keyup(e => {
						var code = (e.keyCode ? e.keyCode : e.which)
						if(code == 13){
							let newF = document.getElementById('editordark').value
							document.execCommand('fontName', false, newF);
							document.getElementById('editordark').removeChild(inp)
						}
					})
				})

				// $('#font_size1').click(()=>{
				// 	document.execCommand("fontSize", false, "2")
				//     let fontElements = window.getSelection().anchorNode.parentNode
				//     fontElements.id = "fe"
				//     fontElements.removeAttribute("size");
				//     console.log(fontElements)
				//     fontSize = fontSize+1
				//     final = fontSize+"px"
				//     fontElements.style.fontSize = final;
				// })

				$('#font_size1').mousedown(function(event) {
				    switch (event.which) {
				        case 1:
				            document.execCommand("fontSize", false, "2")
						    let fontElements = window.getSelection().anchorNode.parentNode
						    fontElements.id = "fe"
						    fontElements.removeAttribute("size");
						    console.log(fontElements)
						    fontSize = fontSize+1
						    final = fontSize+"px"
						    fontElements.style.fontSize = final;
						    document.getElementById("font_size1").title = fontSize-13
				            break;
				        case 2:
				            break;
				        case 3:
				        	fontSize = 14
				            document.execCommand("fontSize", false, "2")
						    fontElements = window.getSelection().anchorNode.parentNode
						    fontElements.style.fontSize = 14;
						    document.getElementById("font_size1").title = "click to increase; right to click to reset to smallest font size"
				            break;
				        default:
				            alert('Nothing');
				    }
				})

				$('#strike1').click(()=>{
					document.execCommand('strikethrough');
				})
			}

			let save = document.createElement('button')
			let idOfSave = "save"+i
			save.id = idOfSave
			save.innerHTML = "Save"
			document.getElementById('editordark').appendChild(save)
			$('#'+idOfSave).css({
				backgroundColor: "red",
				color: "white",
				fontFamily: "spirax",
				width: "10%",
				height: "5%",
				position: "absolute",
				top: 1,
				marginLeft: "66%",
				border: "none",
				borderRadius: 10,
				curson: "pointer"
			})
			$('#'+idOfSave).click(()=>{
				let j = i+1
				db.ref('Users/'+uid+"/Notes/"+j).update({
					title: $('#'+idOfIn).val(),
					content: $('#'+idOfP).html()
				})
				window.location.reload()
			})
		})

		//creating editordark
		{
			let idOfTitle = "title"+i
			let tON = document.createElement('h5')
			tON.innerHTML = title
			tON.id = idOfTitle
			tON.style.marginTop = "2%"
			tON.style.fontSize = "1vw"
			tON.style.fontWeight = "bold"
			document.getElementById(idOfDiv).appendChild(tON)

			let idOfDate = "date"+i
			let dON = document.createElement('h6')
			dON.innerHTML = "Created on: "+date
			dON.id = idOfDate
			dON.style.fontSize = "1vw"
			dON.style.marginTop = "-10%"
			document.getElementById(idOfDiv).appendChild(dON)

			let idOfDel = "del"+i
			let deON = document.createElement('h6')
			deON.innerHTML = "Delete"
			deON.id = idOfDel
			deON.style.fontSize = "1vw"
			deON.style.marginTop = "-10%"
			deON.style.textDecorationLine = "underline"
			deON.onclick = function(){
				let noOfNotes
				db.ref('Users/'+uid+'/NoOfNotes/').on('value', (data)=>{
					noOfNotes = data.val()
				})
				timer = setTimeout(function() {
					let j = i+1
					db.ref('Users/'+uid+'/Notes/'+j).update({
						isDeleted: "yes",
						content: "",
						title: "",
						date: ""
					})
					window.location.reload()
				}, 100);
			}
			$('#'+idOfDiv).mouseenter(()=>{
				document.getElementById(idOfDiv).appendChild(deON)
			})
			$('#'+idOfDiv).mouseleave(()=>{
				document.getElementById(idOfDiv).removeChild(deON)
			})
		}
	}
} else {
	let db = firebase.database()
	let uid, profile, email, name, image, cursorP, isDeleted, Mode, doNothing
	let bold = false
	let finalText
	let firstTime = 0
	let fontSize = 14

	firebase.auth().onAuthStateChanged(user => {  
		if(user && firstTime === 0) {
		    uid = user.uid
		    email = user.email
		    let noOfNotes
		    db.ref('Users/'+uid+'/NoOfNotes/').on('value', (data)=>{
				noOfNotes = data.val()
				for(let i=0; i<noOfNotes; i++){
					let title, date, content
					let j = i+1
					db.ref('Users/'+uid+'/Notes/'+j+'/title/').on('value', (data)=>{
						title = data.val()
					})
					db.ref('Users/'+uid+'/Notes/'+j+'/date/').on('value', (data)=>{
						date = data.val()
					})
					db.ref('Users/'+uid+'/Notes/'+j+'/content/').on('value', (data)=>{
						content = data.val()
					})
					db.ref('Users/'+uid+'/Mode/').on('value', (data)=>{
						Mode = data.val()
						if(Mode === "dark") {
							db.ref('Users/'+uid+'/Notes/'+j+'/isDeleted/').on('value', (data)=>{
								isDeleted = data.val()
								let myTimeout
								isDeleted == "no"
									? myTimeout = setTimeout(()=>{NoteDark(title, date, content, i)}, 500)
									: doNothing = "did nothing"
							})
						}
						if(Mode === "light") {
							db.ref('Users/'+uid+'/Notes/'+j+'/isDeleted/').on('value', (data)=>{
								isDeleted = data.val()
								let myTimeout
								isDeleted == "no"
									? myTimeout = setTimeout(()=>{NoteLight(title, date, content, i)}, 500)
									: doNothing = "did nothing"
							})
						}
					})
				}

				const d = new Date();
				let month = d.getMonth() + 1
				let day = d.getDate() + "/" + month + "/" + d.getFullYear();
				let i = noOfNotes+1
				let idOfSave = "save"+i
				let cuMo
				db.ref('Users/'+uid+'/Mode/').on('value', (data)=>{
					cuMo = data.val()
					if(cuMo === "dark"){
						$('#add1').click(()=>{
							NoteDark("New Note", day, "Type here", noOfNotes)
							db.ref('Users/'+uid).update({
								NoOfNotes: noOfNotes+1
							})
							db.ref('Users/'+uid+'/Notes/'+i).update({
								title: "New note",
								date: day,
								content: "type here",
								isDeleted: "no"
							})
							window.location.reload()
						})
					}
					if(cuMo === "light"){
						$('#add').click(()=>{
							NoteLight("New Note", day, "Type here", noOfNotes)
							db.ref('Users/'+uid).update({
								NoOfNotes: noOfNotes+1
							})
							db.ref('Users/'+uid+'/Notes/'+i).update({
								title: "New note",
								date: day,
								content: "type here",
								isDeleted: "no"
							})
							window.location.reload()
						})
					}
				})
			})
			firstTime = 1
		} if(!user) {
			location.href = '../SignInPage/signIn.html'
		}
	})

	$('#so').click(()=>{
		firebase.auth().signOut()
	})

	bro = true
	$('#bro').click(()=>{
		window.open("https://www.google.com", "Google", {left:0, width:40})
	})

	$('#bro1').click(()=>{
		window.open("https://www.google.com", "Google", {left:0, width:40})
	})

	ai = true
	$("#ai").click(()=>{
		if(ai === true){
			document.getElementById("aiInt").style.display = "block"
			ai = false
		} else {
			document.getElementById("aiInt").style.display = "none"
			ai = true
		}
	})

	$("#ai1").click(()=>{
		if(ai === true){
			document.getElementById("aiInt").style.display = "block"
			ai = false
		} else {
			document.getElementById("aiInt").style.display = "none"
			ai = true
		}
	})

	$('#dm').click(()=>{
		db.ref('Users/'+uid).update({
			Mode: "dark"
		})
		timerwhoo = setInterval(() => {
			window.location.reload()
		}, 200);
	})

	$('#so1').click(()=>{
		firebase.auth().signOut()
	})

	$('#dm1').click(()=>{
		db.ref('Users/'+uid).update({
			Mode: "light"
		})
		timerwhoo = setInterval(() => {
			window.location.reload()
		}, 200);
	})

	function NoteLight(title, date, content, i){

		let idOfDiv = "note"+i
		let div = document.createElement('div')
		div.id = idOfDiv
		document.getElementById('contentbar').appendChild(div)

		$('#'+idOfDiv).css({
			backgroundColor: "transparent",
			borderColor: "black",
			border: "groove",
			width: "100%",
			height: "16vh",
			textAlign: "center",
			cursor: "pointer"
		})

		$('#'+idOfDiv).click(()=>{
			$("#contentbar").css({
				display: "none"
			})
			let remEl = document.getElementById('editor')
			while (remEl.lastElementChild) {
				remEl.removeChild(remEl.lastElementChild);
			}

			document.getElementById('edits').style.display = "block"

			let input = document.createElement('input')
			let idOfIn = "input"+i
			input.id = idOfIn
			input.value = title
			document.getElementById('editor').appendChild(input)
			$('#'+idOfIn).css({
				width: "65vw",
				height: "7vh",
				backgroundColor: "transparent",
				marginLeft: "2.5vw",
				borderWidth: "1vw",
				borderRight: "none",
				borderTop: "none",
				borderBottom: "none",
				border: "none",
				textAlign: "center",
				borderColor: "skyblue",
				backgroundColor: "transparent",
				fontSize: "5.5vw",
				marginTop: "7vh",
				fontFamily: "Annie use your telescope",
				fontType: "bold"
			})

			let ta = document.createElement('div')
			let pSpace = document.createElement('p')
			document.getElementById('editor').appendChild(pSpace)
			document.getElementById('editor').appendChild(ta)
			let idOfTa = "ta"+i
			ta.id = idOfTa
			$('#'+idOfTa).css({
				marginTop: "2%",
				marginLeft: "2.5vw",
				backgroundColor: "white",
				width: "95vw",
				fontFamily: "arial",
				maxHeight: "80vh",
				overflow: "scroll",
				fontSize: "2vh"
			})

			let pCont = document.createElement('p')
			pCont.innerHTML = content
			pCont.contentEditable = "true"
			let idOfP = "p"+i
			pCont.id = idOfP
			document.getElementById(idOfTa).appendChild(pCont)
			$('#'+idOfP).css({
				marginTop: "5%",
				marginLeft: "4%",
				marginRight: "4%",
				marginBottom: "5%"
			})

			{
				$('#bold').click(()=>{
					document.execCommand('bold');
				})

				$('#italic').click(()=>{
					document.execCommand('italic');
				})

				$('#underline').click(()=>{
					document.execCommand('underline');
				})

				$('#left').click(()=>{
					document.execCommand('justifyLeft');
				})

				$('#right').click(()=>{
					document.execCommand('justifyRight');
				})

				$('#left').click(()=>{
					document.execCommand('justifyLeft');
				})

				$('#center').click(()=>{
					document.execCommand('justifyCenter');
				})

				$('#number').click(()=>{
					document.execCommand('insertOrderedList');
				})

				$('#bullet').click(()=>{
					document.execCommand('insertUnorderedList');
				})

				$('#font_change').click(()=>{
					let inp = document.createElement('input')
					inp.id = "inp"
					inp.value = "Enter new font here"
					document.getElementById('editor').appendChild(inp)
					$('#inp').css({
						position: "absolute",
						width: "20%",
						height: "7%",
						top: "35%",
						left: "28%"
					})
					$('#inp').keyup(e => {
						var code = (e.keyCode ? e.keyCode : e.which)
						if(code == 13){
							let newF = document.getElementById('editor').value
							document.execCommand('fontName', false, newF);
							document.getElementById('editor').removeChild(inp)
						}
					})
				})

				$('#font_size').mousedown(function(event) {
				    switch (event.which) {
				        case 1:
				            document.execCommand("fontSize", false, "2")
						    let fontElements = window.getSelection().anchorNode.parentNode
						    fontElements.id = "fe"
						    fontElements.removeAttribute("size");
						    console.log(fontElements)
						    fontSize = fontSize+1
						    final = fontSize+"px"
						    fontElements.style.fontSize = final;
						    document.getElementById("font_size").title = fontSize-13
				            break;
				        case 2:
				            break;
				        case 3:
				        	fontSize = 14
				            document.execCommand("fontSize", false, "2")
						    fontElements = window.getSelection().anchorNode.parentNode
						    fontElements.style.fontSize = 14;
						    document.getElementById("font_size").title = "click to increase; right to click to reset to smallest font size"
				            break;
				        default:
				            alert('Nothing');
				    }
				})

				$('#strike').click(()=>{
					document.execCommand('strikethrough');
				})
			}

			let save = document.createElement('button')
			let idOfSave = "save"+i
			save.id = idOfSave
			save.innerHTML = "Save"
			document.getElementById('editor').appendChild(save)
			$('#'+idOfSave).css({
				backgroundColor: "rgb(255, 240, 240)",
				color: "black",
				fontFamily: "spirax",
				width: "20vw",
				height: "5vh",
				position: "absolute",
				marginLeft: "75vw",
				top: "12.5vh",
				border: "none",
				borderRadius: 10,
				curson: "pointer",
				fontSize: "2vh",
			})
			$('#'+idOfSave).click(()=>{
				let j = i+1
				db.ref('Users/'+uid+"/Notes/"+j).update({
					title: $('#'+idOfIn).val(),
					content: $('#'+idOfP).html()
				})
				window.location.reload()
			})
		})

		//creating note
		{
			let idOfTitle = "title"+i
			let tON = document.createElement('h5')
			tON.innerHTML = title
			tON.id = idOfTitle
			tON.style.marginTop = "1vw"
			tON.style.fontSize = "3.5vh"
			document.getElementById(idOfDiv).appendChild(tON)

			let idOfDate = "date"+i
			let dON = document.createElement('h6')
			dON.innerHTML = "Created on: "+date
			dON.id = idOfDate
			dON.style.fontSize = "2vh"
			dON.style.marginTop = "-0.5vw"
			document.getElementById(idOfDiv).appendChild(dON)

			let idOfDel = "del"+i
			let deON = document.createElement('h5')
			deON.innerHTML = "Delete"
			deON.id = idOfDel
			deON.style.fontSize = "2.2vh"
			deON.style.marginTop = "0.5vw"
			deON.style.textDecorationLine = "underline"
			deON.onclick = function(){
				let noOfNotes
				db.ref('Users/'+uid+'/NoOfNotes/').on('value', (data)=>{
					noOfNotes = data.val()
				})
				timer = setTimeout(function() {
					let j = i+1
					db.ref('Users/'+uid+'/Notes/'+j).update({
						isDeleted: "yes",
						content: "",
						title: "",
						date: ""
					})
					window.location.reload()
				}, 100);
			}
			document.getElementById(idOfDiv).appendChild(deON)
		}
	}

	function NoteDark(title, date, content, i){

		let idOfDiv = "note"+i
		let div = document.createElement('div')
		div.id = idOfDiv
		document.getElementById('contentbar').appendChild(div)

		$('#'+idOfDiv).css({
			backgroundColor: "transparent",
			borderColor: "black",
			border: "groove",
			width: "100%",
			height: "16vh",
			textAlign: "center",
			cursor: "pointer"
		})

		$('#'+idOfDiv).click(()=>{
			$("#contentbar").css({
				display: "none"
			})
			let remEl = document.getElementById('editor')
			while (remEl.lastElementChild) {
				remEl.removeChild(remEl.lastElementChild);
			}

			document.getElementById('edits').style.display = "block"

			let input = document.createElement('input')
			let idOfIn = "input"+i
			input.id = idOfIn
			input.value = title
			document.getElementById('editor').appendChild(input)
			$('#'+idOfIn).css({
				width: "65vw",
				height: "7vh",
				backgroundColor: "transparent",
				marginLeft: "2.5vw",
				borderWidth: "1vw",
				borderRight: "none",
				borderTop: "none",
				borderBottom: "none",
				border: "none",
				textAlign: "center",
				borderColor: "skyblue",
				backgroundColor: "transparent",
				fontSize: "5.5vw",
				marginTop: "7vh",
				fontFamily: "Annie use your telescope",
				fontType: "bold"
			})

			let ta = document.createElement('div')
			let pSpace = document.createElement('p')
			document.getElementById('editor').appendChild(pSpace)
			document.getElementById('editor').appendChild(ta)
			let idOfTa = "ta"+i
			ta.id = idOfTa
			$('#'+idOfTa).css({
				marginTop: "2%",
				marginLeft: "2.5vw",
				backgroundColor: "white",
				width: "95vw",
				fontFamily: "arial",
				maxHeight: "80vh",
				overflow: "scroll",
				fontSize: "2vh"
			})

			let pCont = document.createElement('p')
			pCont.innerHTML = content
			pCont.contentEditable = "true"
			let idOfP = "p"+i
			pCont.id = idOfP
			document.getElementById(idOfTa).appendChild(pCont)
			$('#'+idOfP).css({
				marginTop: "5%",
				marginLeft: "4%",
				marginRight: "4%",
				marginBottom: "5%"
			})

			{
				$('#bold').click(()=>{
					document.execCommand('bold');
				})

				$('#italic').click(()=>{
					document.execCommand('italic');
				})

				$('#underline').click(()=>{
					document.execCommand('underline');
				})

				$('#left').click(()=>{
					document.execCommand('justifyLeft');
				})

				$('#right').click(()=>{
					document.execCommand('justifyRight');
				})

				$('#left').click(()=>{
					document.execCommand('justifyLeft');
				})

				$('#center').click(()=>{
					document.execCommand('justifyCenter');
				})

				$('#number').click(()=>{
					document.execCommand('insertOrderedList');
				})

				$('#bullet').click(()=>{
					document.execCommand('insertUnorderedList');
				})

				$('#font_change').click(()=>{
					let inp = document.createElement('input')
					inp.id = "inp"
					inp.value = "Enter new font here"
					document.getElementById('editor').appendChild(inp)
					$('#inp').css({
						position: "absolute",
						width: "20%",
						height: "7%",
						top: "35%",
						left: "28%"
					})
					$('#inp').keyup(e => {
						var code = (e.keyCode ? e.keyCode : e.which)
						if(code == 13){
							let newF = document.getElementById('editor').value
							document.execCommand('fontName', false, newF);
							document.getElementById('editor').removeChild(inp)
						}
					})
				})

				$('#font_size').mousedown(function(event) {
				    switch (event.which) {
				        case 1:
				            document.execCommand("fontSize", false, "2")
						    let fontElements = window.getSelection().anchorNode.parentNode
						    fontElements.id = "fe"
						    fontElements.removeAttribute("size");
						    console.log(fontElements)
						    fontSize = fontSize+1
						    final = fontSize+"px"
						    fontElements.style.fontSize = final;
						    document.getElementById("font_size").title = fontSize-13
				            break;
				        case 2:
				            break;
				        case 3:
				        	fontSize = 14
				            document.execCommand("fontSize", false, "2")
						    fontElements = window.getSelection().anchorNode.parentNode
						    fontElements.style.fontSize = 14;
						    document.getElementById("font_size").title = "click to increase; right to click to reset to smallest font size"
				            break;
				        default:
				            alert('Nothing');
				    }
				})

				$('#strike').click(()=>{
					document.execCommand('strikethrough');
				})
			}

			let save = document.createElement('button')
			let idOfSave = "save"+i
			save.id = idOfSave
			save.innerHTML = "Save"
			document.getElementById('editor').appendChild(save)
			$('#'+idOfSave).css({
				backgroundColor: "rgb(255, 240, 240)",
				color: "black",
				fontFamily: "spirax",
				width: "20vw",
				height: "5vh",
				position: "absolute",
				marginLeft: "75vw",
				top: "12.5vh",
				border: "none",
				borderRadius: 10,
				curson: "pointer",
				fontSize: "2vh",
			})
			$('#'+idOfSave).click(()=>{
				let j = i+1
				db.ref('Users/'+uid+"/Notes/"+j).update({
					title: $('#'+idOfIn).val(),
					content: $('#'+idOfP).html()
				})
				window.location.reload()
			})
		})

		//creating note
		{
			let idOfTitle = "title"+i
			let tON = document.createElement('h5')
			tON.innerHTML = title
			tON.id = idOfTitle
			tON.style.marginTop = "1vw"
			tON.style.fontSize = "3.5vh"
			document.getElementById(idOfDiv).appendChild(tON)

			let idOfDate = "date"+i
			let dON = document.createElement('h6')
			dON.innerHTML = "Created on: "+date
			dON.id = idOfDate
			dON.style.fontSize = "2vh"
			dON.style.marginTop = "-0.5vw"
			document.getElementById(idOfDiv).appendChild(dON)

			let idOfDel = "del"+i
			let deON = document.createElement('h5')
			deON.innerHTML = "Delete"
			deON.id = idOfDel
			deON.style.fontSize = "2.2vh"
			deON.style.marginTop = "0.5vw"
			deON.style.textDecorationLine = "underline"
			deON.onclick = function(){
				let noOfNotes
				db.ref('Users/'+uid+'/NoOfNotes/').on('value', (data)=>{
					noOfNotes = data.val()
				})
				timer = setTimeout(function() {
					let j = i+1
					db.ref('Users/'+uid+'/Notes/'+j).update({
						isDeleted: "yes",
						content: "",
						title: "",
						date: ""
					})
					window.location.reload()
				}, 100);
			}
			document.getElementById(idOfDiv).appendChild(deON)
		}
	}
}
//fix save bug and make the search functional

function AddNote(id, name, summary, date, text, x, content, numNotes) {
    const node = document.getElementById("blueprint")
    const clone = node.cloneNode(true);
    clone.style.display = "block"
    clone.id = id
    clone.onclick = ()=>{
        $("#editor").css({
            display: "block"
        })
        $("#content").html(content)
        $("#title").css({
            display: "block"
        })
        $("#title").val(name)
    }
    document.getElementById("notes").appendChild(clone);
    grandchildren = clone.children
    grandchildren.item(0).innerHTML = name
    grandchildren.item(1).innerHTML = summary
    grandchildren.item(2).innerHTML = date
    grandchildren.item(3).onclick = ()=>{ShowSummary(text)}
    grandchildren.item(4).onclick = ()=>{DelNote(x)}
    $("#save").click(()=>{
        db.ref('Users/'+uid+'/Notes/'+x).update({
            content: $("#content").html(),
            title: $("#title").val()
        })
        setTimeout(()=>{window.location.reload()}, 100)
    })
    $("#sbo2").click(()=>{
        const d = new Date();
        let month = d.getMonth() + 1
        let day = d.getDate() + "/" + month + "/" + d.getFullYear();
        let newer = numNotes+1
        db.ref('Users/'+uid).update({
            NoOfNotes: newer
        })
        db.ref('Users/'+uid+'/Notes/'+newer).update({
            title: "New note",
            date: day,
            content: "",
            isDeleted: "no"
        })
        window.location.reload()
    })
}

let firstTime = 0
let db = firebase.database()

GetAns = (prompt, reply)=>{
    fetch('https://api.openai.com/v1/engines/text-davinci-003/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
          'prompt': prompt,
          'temperature': 0.5,
          'max_tokens': 200,
        })
      })
      .then(response => response.json())
      .then(json => reply = json.choices[0].text)
}

firebase.auth().onAuthStateChanged(user => {  
    if(user && firstTime === 0) {
        uid = user.uid
        email = user.email
        console.log(uid)
        db.ref('Users/'+uid+'/NoOfNotes/').on('value', (data)=>{
            whoo = data.val()
            noOfNotes = data.val()
            if(noOfNotes > 0){
                $("#cover_empty").css({display: "none"})
            }
            for(let i=0; i<noOfNotes; i++){
                let title, date, content, isDeleted
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
                db.ref('Users/'+uid+'/Notes/'+j+'/isDeleted/').on('value', (data)=>{
                    isDeleted = data.val()
                })
                setTimeout(()=>{
                    if(isDeleted == "no"){
                        let prompt = "summarise: '"+ content + "'"
                        fetch('https://api.openai.com/v1/engines/text-davinci-003/completions', {
                            method: 'POST',
                            headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer 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'
                            },
                            body: JSON.stringify({
                            'prompt': prompt,
                            'temperature': 0.5,
                            'max_tokens': 2000,
                            })
                        })
                        .then(response => response.json())
                        .then(json => AddNote("n"+i, title, [json.choices[0].text.split(' ').slice(0, 10).join(' '), "..."].join(""), date, json.choices[0].text, i, content, whoo))
                        // AddNote("n"+i, title, "Generating Summary...", date, "Here is ur summary")
                    } else {
                        noOfNotes -= 1
                    }
                }, 500)
            }
            setTimeout(()=>{
                $("#numnotes").text(noOfNotes+" notes")
            }, 600)
        })
    } if(!user) {
        location.href = '../SignInPage/signIn.html'
    }
})

generatePDF = ()=>{
    let code = document.getElementById("editor") 

    html2pdf()
      .from(code)
      .save()
}

// Editor Functions
options = document.getElementById("options").children
//bold
options.item(7).onclick = ()=>{
    document.execCommand("bold")
}
//italic
options.item(8).onclick = ()=>{
    document.execCommand("italic")
}
//strikethrough
options.item(9).onclick = ()=>{
    document.execCommand("strikethrough")
}
//underline
options.item(10).onclick = ()=>{
    document.execCommand("underline")
}
//list
options.item(11).onclick = ()=>{
    document.execCommand("insertUnorderedList")
}
//num list
options.item(12).onclick = ()=>{
    document.execCommand("insertOrderedList")
}
//undo
options.item(13).onclick = ()=>{
    document.execCommand("undo")
}
//redo
options.item(14).onclick = ()=>{
    document.execCommand("redo")
}
//align left
options.item(18).onclick = ()=>{
    document.execCommand("justifyLeft")
}
//center
options.item(19).onclick = ()=>{
    document.execCommand("justifyCenter")
}
//align right
options.item(20).onclick = ()=>{
    document.execCommand("justifyRight")
}
//subscript
options.item(21).onclick = ()=>{
    document.execCommand("subscript")
}
//superscript
options.item(22).onclick = ()=>{
    document.execCommand("superscript")
}
//insert image
options.item(23).onclick = ()=>{
    let img = prompt("Enter Image URL and size")
    img = img.split(" ")
    let code = "<img src='"+img[0]+"' width="+img[1]+" height="+img[2]+" />"
    document.execCommand("insertHTML", 0, code)
}
//insert video
options.item(24).onclick = ()=>{
    let video = prompt("Enter Video URL")
    video = video.split("=")
    let embed = "https://www.youtube.com/embed/"+video[1]
    let code = "<iframe style='resize: both; padding: 0.5vh; border: none' src='"+embed+"'></iframe>"
    document.execCommand("insertHTML", 0, code)
}
//insert link
options.item(25).onclick = ()=>{
    let link = prompt("Enter Link")
    document.execCommand("createLink", 0, link)
}
//insert table
options.item(17).onclick = ()=>{
    let table = prompt("Enter number of rows and columns")
    table = table.split(" ")
    createTable(table[0], table[1])
}
createTable = (rows, columns)=>{
    see = []
    for(let i = 1; i<=rows; i++){
        putin = []
        for(let i = 1; i<=columns; i++){
            putin.push("<td></td>")
        }
        see.push("<tr>"+putin.join("")+"</tr>")
    }
    let fin = "<table>"+see.join("")+"</table>"
    console.log(fin)
    document.execCommand("insertHTML", false, fin)
}
//put in blockquote
options.item(16).onclick = ()=>{
    let txt = window.getSelection().anchorNode.data.substring( window.getSelection().anchorOffset,window.getSelection().extentOffset )
    let code = "<blockquote>"+txt+"</blockquote>"
    document.execCommand("insertHTML", 0, code)
}
$("p").mousedown(()=>{
    event.preventDefault();
})
//font types
$("#h1").click(()=>{
    document.execCommand("formatBlock", 0, "H1")
})
$("#h2").click(()=>{
    document.execCommand("formatBlock", 0, "H2")
})
$("#h3").click(()=>{
    document.execCommand("formatBlock", 0, "H3")
})
$("#h4").click(()=>{
    document.execCommand("formatBlock", 0, "H4")
})
$("#p").click(()=>{
    document.execCommand("formatBlock", 0, "P")
})

//font families
let fn1 = "Arial"
let fn2 = "Open Sans"
let fn3 = "Times New Roman"
let fn4 = "Calibri"
let fn5 = "Helvetica"
$(".fn1").click(()=>{
    document.execCommand("fontName", 0, fn1)
})
$(".fn2").click(()=>{
    document.execCommand("fontName", 0, fn2)
})
$(".fn3").click(()=>{
    document.execCommand("fontName", 0, fn3)
})
$(".fn4").click(()=>{
    document.execCommand("fontName", 0, fn4)
})
$(".fn5").click(()=>{
    document.execCommand("fontName", 0, fn5)
})

//font size
function changeSize(size){
    $("#"+size).click(()=>{
        let txt = window.getSelection().anchorNode.data.substring( window.getSelection().anchorOffset,window.getSelection().extentOffset )
        let code = "<span style='font-size: "+size.toString()+"vh'>"+txt+"</span>"
        document.execCommand("insertHTML", 0, code)  
    })
}
changeSize(1)
changeSize(2)
changeSize(3)
changeSize(4)
changeSize(5)
changeSize(6)
changeSize(7)


function ShowSummary(text){
    iziToast.show({
        titleColor: 'red',
        titleSize: '15px',
        message: text,
        position: 'center',
        maxWidth: '40vw',
        backgroundColor: 'white'
    });
}

function DelNote(x){
    db.ref('Users/'+uid+'/Notes/'+x+'/').update({
        isDeleted: "yes"
    })
    setTimeout(()=>{
        window.location.reload()
    }, 100)
}
mode = "on"
$("#sbo5").click(()=>{
    if(mode == "on"){
        mode = "of"
        $("#editor").css({
            width: "68.6vw"
        })
        $("#ai_holder").css({
            display: "none"
        })
    } else {
        mode = "on"
        $("#editor").css({
            width: "52.6vw"
        })
        $("#ai_holder").css({
            display: "block"
        })
    }
})

$("#prompt").on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        $("#response").text("Generating...")
        fetch('https://api.openai.com/v1/engines/text-davinci-003/completions', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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'
            },
            body: JSON.stringify({
            'prompt': $(this).val(),
            'temperature': 0.5,
            'max_tokens': 2000,
            })
        })
        .then(response => response.json())
        .then(json => $("#response").text(json.choices[0].text))
    }
});

$('#sbo3').click(()=>{
    window.open("https://www.google.com", "Google", {left:0, width:40})
})
$("#sbo4").click(()=>{
    $("html").css({
        filter: "invert(1)"
    })
    $("#sidebar").css({
        filter: "invert(1)",
        borderRight: "solid 2px black"
    })
})
$("#sbo6").click(()=>{
    firebase.auth().signOut()
})
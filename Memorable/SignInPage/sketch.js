let db = firebase.database()
let state = 1

firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser){
    	let uid = firebaseUser.uid
    	let email = firebaseUser.email
        let noOfNotes;
        db.ref('Users/'+uid+"/NoOfNotes").on('value', (data)=>{
            noOfNotes = data.val()
            if(noOfNotes > 0){
                db.ref('Users/'+uid).update({
                    email: email,
                    NoOfNotes: noOfNotes
                })
            } else {
                db.ref('Users/'+uid).update({
                    email: email,
                    NoOfNotes: 0,
                    Mode: "light"
                })
            }
        })
        const myTimeout = setTimeout(()=>{
        	location.href = '../MainPage/main.html'
        }, 2000);
    } else if(!firebaseUser) {
    	console.log('please sign in')
    }
})

if(window.innerHeight/window.innerWidth < 1){
    document.getElementById("styler").href="style.css"
    $('#signup').click((e) => {
        let email = $('#email').val()
        let password = $('#password').val()
        const auth = firebase.auth()
        const promise = auth.createUserWithEmailAndPassword(email, password)
        promise.catch(e => {showToast()})
    })
    $('#signin').click((e) => {
        let email = $('#email').val()
        let password = $('#password').val()
        const auth = firebase.auth()
        const promise = auth.signInWithEmailAndPassword(email, password)
        promise.catch(e => {showToast()})
    })
} else {
    document.getElementById("styler").href="phone.css"
        $('#signupP').click((e) => {
        let email = $('#emailP').val()
        let password = $('#passwordP').val()
        const auth = firebase.auth()
        const promise = auth.createUserWithEmailAndPassword(email, password)
        promise.catch(e => {showToast()})
    })
    $('#signinP').click((e) => {
        let email = $('#emailP').val()
        let password = $('#passwordP').val()
        const auth = firebase.auth()
        const promise = auth.signInWithEmailAndPassword(email, password)
        promise.catch(e => {showToast()})
    })
}

function showToast(){
    iziToast.show({
        title: 'Error',
        titleColor: 'red',
        titleSize: '15px',
        iconUrl: "warning.png",
        message: 'Please check if you have entered your details correctly',
        position: 'topRight'
    });
}

setInterval(changeSlide, 6000)

function changeSlide(){
    var x = document.getElementById("slide2");
    var y = document.getElementById("slide1");
    if (x.style.display === "none") {
        x.style.display = "grid";
        y.style.display = "none"
        $("#changeto1").css({
            backgroundColor: "grey"
        })
        $("#changeto2").css({
            backgroundColor: "black"
        })
    } else {
        x.style.display = "none";
        y.style.display = "grid"
        $("#changeto1").css({
            backgroundColor: "black"
        })
        $("#changeto2").css({
            backgroundColor: "gray"
        })
    }
}

$("#dm").click(()=>{
    console.log('bloody hell')
    location.href = "signindark.html"
})
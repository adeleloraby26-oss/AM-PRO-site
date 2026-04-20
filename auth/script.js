import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, query, where, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAuzoaWTXpF6-V2m4_-vZHF5F1Ca8EpDPA",
    authDomain: "am-portfolyo.firebaseapp.com",
    databaseURL: "https://am-portfolyo-default-rtdb.firebaseio.com",
    projectId: "am-portfolyo",
    storageBucket: "am-portfolyo.firebasestorage.app",
    messagingSenderId: "982268244536",
    appId: "1:982268244536:web:b4fbe3ef3de6d3b2846ccd",
    measurementId: "G-FKHHQPNY7R"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

function show(msg, type="success"){
    const box = document.getElementById("notif");
    const text = document.getElementById("notifText");
    const icon = box.querySelector("[data-lucide]");

    text.innerText = msg;
    if(icon){
        if(type === "error"){
            icon.setAttribute("data-lucide","x-circle");
        }else{
            icon.setAttribute("data-lucide","check-circle");
        }
    }
    lucide.createIcons();
    box.classList.add("show");
    setTimeout(()=>box.classList.remove("show"),3000);
}

// الدوال تم ربطها بـ window لضمان عمل الـ onclick في الـ HTML
window.signup = async function(){
    const nameVal = document.getElementById("name").value;
    const userVal = document.getElementById("username").value;
    const genderVal = document.getElementById("gender").value;
    const fieldVal = document.getElementById("field").value;
    const emailVal = document.getElementById("email").value;
    const passVal = document.getElementById("pass").value;
    const confirmVal = document.getElementById("confirmPass").value;

    if(passVal !== confirmVal){
        show("Passwords not match","error");
        return;
    }

    const usernameRegex = /^[a-z0-9_]+$/;
    if(!usernameRegex.test(userVal)){
        show("Username must be (a-z, 0-9, _)","error");
        return;
    }

    try{
        const q = query(collection(db,"users"), where("username","==",userVal));
        const snap = await getDocs(q);

        if(!snap.empty){
            show("This username is already in use.","error");
            return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, emailVal, passVal);  
        const uid = userCredential.user.uid;      

        await setDoc(doc(db,"users",uid),{      
            uid:uid,      
            name:nameVal,      
            username:userVal,      
            gender:genderVal,      
            field:fieldVal,      
            email:emailVal      
        });      

        show("account created","success");      
        setTimeout(()=>window.location.href="dashboard.html",1500);

    } catch(e) {
        if(e.code === "auth/email-already-in-use"){
            show("This email address is already in use.","error");
        }else if(e.code === "auth/invalid-email"){
            show("The email address is invalid.","error");
        }else if(e.code === "auth/weak-password"){
            show("Password must be at least 6 characters.","error");
        }else{
            show("Error: " + e.message, "error");
        }
    }
};

window.login = async function(){
    const loginEmail = document.getElementById("loginEmail").value;
    const loginPass = document.getElementById("loginPass").value;
    try{
        await signInWithEmailAndPassword(auth, loginEmail, loginPass);      
        show("Welcome Back 👋","success");      
        setTimeout(()=>window.location.href="dashboard.html",1500);
    }catch(e){
        show("Wrong email or password","error");
    }
};

window.switchTab = function(e,tab){
    document.getElementById("loginBox").classList.toggle("hidden",tab!=="login");
    document.getElementById("signupBox").classList.toggle("hidden",tab!=="signup");
    document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
    e.target.classList.add("active");
};

// تشغيل الأيقونات لأول مرة
lucide.createIcons();

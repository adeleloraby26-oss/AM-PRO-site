import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ✅ CONFIG */
const firebaseConfig = {
  apiKey: "AIzaSyCfq-KoLxwmg7WRdxRkqsBVJcR4CDHdAAk",
  authDomain: "am-pro-76262.firebaseapp.com",
  projectId: "am-pro-76262",
  storageBucket: "am-pro-76262.firebasestorage.app",
  messagingSenderId: "58623671123",
  appId: "1:58623671123:web:37b00c8b89b26ce8babfa6",
  measurementId: "G-QGKS12TJ0L"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* عناصر الصفحة */
const loginEmail = document.getElementById("loginEmail");
const loginPass = document.getElementById("loginPass");

const nameInput = document.getElementById("name");
const usernameInput = document.getElementById("username");
const genderInput = document.getElementById("gender");
const fieldInput = document.getElementById("field");
const emailInput = document.getElementById("email");
const passInput = document.getElementById("pass");
const confirmPassInput = document.getElementById("confirmPass");

const loginBox = document.getElementById("loginBox");
const signupBox = document.getElementById("signupBox");

/* دالة عرض التنبيهات */
function show(msg, type="success"){
  const box = document.getElementById("notif");
  const text = document.getElementById("notifText");
  const icon = box.querySelector("i");

  text.innerText = msg;

  if(type === "error"){
    icon.setAttribute("data-lucide","x-circle");
  }else{
    icon.setAttribute("data-lucide","check-circle");
  }

  lucide.createIcons();
  box.classList.add("show");

  setTimeout(()=>box.classList.remove("show"),3000);
}

/* SIGNUP - إنشاء حساب */
window.signup = async function(){
  if(passInput.value !== confirmPassInput.value){
    show("Passwords not match","error");
    return;
  }

  try{
    const user = await createUserWithEmailAndPassword(
      auth,
      emailInput.value,
      passInput.value
    );

    await setDoc(doc(db,"users",user.user.uid),{
      uid:user.user.uid,
      name:nameInput.value,
      username:usernameInput.value,
      gender:genderInput.value,
      field:fieldInput.value,
      email:emailInput.value
    });

    show("Account Created Successfully","success");
    // التحويل للداش بورد (الخروج من auth والدخول لـ dashboard)
    setTimeout(()=>window.location.href="../dashboard/index.html",1500);

  }catch(e){
    show(e.message,"error");
  }
};

/* LOGIN - تسجيل الدخول */
window.login = async function(){
  try{
    await signInWithEmailAndPassword(
      auth,
      loginEmail.value,
      loginPass.value
    );

    show("Welcome Back 👋","success");
    // التحويل للداش بورد
    setTimeout(()=>window.location.href="../dashboard/index.html",1500);

  }catch(e){
    show("Wrong email or password","error");
  }
};

/* SWITCH TABS - التبديل بين اللوجن والساين أب */
window.switchTab = function(e,tab){
  loginBox.classList.toggle("hidden",tab!=="login");
  signupBox.classList.toggle("hidden",tab!=="signup");
  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  e.target.classList.add("active");
};

// تفعيل الأيقونات عند التحميل
window.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
});

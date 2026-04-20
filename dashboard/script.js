// 1. تصحيح الـ import (حرف i صغير)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";    
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";    

// 2. الـ Config (تأكد إنه مطابق لمشروعك)
const firebaseConfig = {     
    apiKey: "AIzaSyAuzoaWTXpF6-V2m4_-vZHF5F1Ca8EpDPA",     
    authDomain: "am-portfolyo.firebaseapp.com",     
    projectId: "am-portfolyo",
    storageBucket: "am-portfolyo.appspot.com",
    messagingSenderId: "58623671123",
    appId: "1:58623671123:web:37b00c8b89b26ce8babfa6"
};    

const app = initializeApp(firebaseConfig);    
const auth = getAuth(app);
const db = getFirestore(app);    

// 3. زر تسجيل الخروج
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.onclick = () => {    
        signOut(auth).then(() => {
            window.location.href = "../auth/index.html"; // تأكد من المسار
        }).catch((error) => {
            console.error("Logout Error:", error);
        });
    };
}

// 4. التحقق من حالة المستخدم وجلب الـ UID
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Logged in UID:", user.uid); // للتأكد في الكونسول
        initDashboard(user.uid);
    } else {
        console.log("No user logged in");
        const container = document.querySelector(".container");
        if (container) {
            container.innerHTML = `    
                <div class="empty-state">    
                    <h3>جلسة منتهية أو لم تقم بتسجيل الدخول</h3>    
                    <p>برجاء تسجيل الدخول للوصول لهذه الصفحة.</p>    
                    <br>    
                    <a href="/auth/index.html" class="btn-logout" style="background:var(--apple-blue); color:white; border:none; padding:10px 20px; text-decoration:none; display:inline-block;">تسجيل الدخول</a>    
                </div>`;
        }
    }
});

// 5. دالة تشغيل الداش بورد
async function initDashboard(currentUserId) {    
    try {
        const userDocRef = doc(db, "users", currentUserId);    
        const userDoc = await getDoc(userDocRef);    

        if (userDoc.exists()) {    
            const data = userDoc.data();    
            document.getElementById("userName").innerText = data.username || data.name || "مستخدم AM PRO";    
            document.getElementById("greetingText").innerText = `مرحباً بك، ${data.name || data.username || ""}`;    
                
            const r = getRank(data.level || 1);    
            const rankEl = document.getElementById("userRank");
            if (rankEl) {
                rankEl.innerText = `${r.name} • مستوى ${r.level}`;    
                rankEl.style.background = r.color;
            }
        } else {
            console.warn("No Firestore document found for this UID");
            document.getElementById("userName").innerText = "بيانات مفقودة";
        }

        // جلب المهام بناءً على الـ UID
        const tasksQuery = query(collection(db, "tasks"), where("userId", "==", currentUserId));    
        onSnapshot(tasksQuery, (snap) => {    
            const list = document.getElementById("tasksList");    
            const countEl = document.getElementById("taskCount");    
            
            if (!list) return;

            if (snap.empty) {    
                list.innerHTML = '<div class="empty-state">لا توجد مهام حالياً. استمتع بيومك! ✨</div>';    
                if (countEl) countEl.innerText = "0 TASKS";    
                return;    
            }    

            if (countEl) countEl.innerText = `${snap.size} TASKS`;    
            list.innerHTML = "";    
            snap.forEach(t => {    
                const task = t.data();    
                list.innerHTML += `    
                    <div class="task-card">    
                        <div class="task-icon"></div>    
                        <div class="task-content">    
                            <h4>${task.text || "مهمة جديدة"}</h4>    
                            <p>مهمة رسمية من إدارة الفريق</p>    
                        </div>    
                    </div>    
                `;    
            });    
        });
    } catch (error) {
        console.error("Error in initDashboard:", error);
    }
}    

// 6. نظام الرتب
const ranks = [    
    { name: "Dust", max: 5, color: "#8e8e93" }, 
    { name: "Stone", max: 6, color: "#636366" }, 
    { name: "Iron", max: 6, color: "#aeaeb2" },    
    { name: "Bronze", max: 7, color: "#a2845e" }, 
    { name: "Silver", max: 7, color: "#cfd3d6" }, 
    { name: "Gold", max: 7, color: "#ffcc00" },    
    { name: "Platinum", max: 8, color: "#e5e5ea" }, 
    { name: "Diamond", max: 8, color: "#007aff" }, 
    { name: "Emerald", max: 9, color: "#34c759" },    
    { name: "Sapphire", max: 9, color: "#5856d6" }, 
    { name: "Obsidian", max: 10, color: "#1c1c1e" }, 
    { name: "Mythic", max: 10, color: "#ff2d55" },    
    { name: "Legend", max: 10, color: "#af52de" }, 
    { name: "Master", max: 12, color: "#5ac8fa" }, 
    { name: "Grandmaster", max: 15, color: "#ff9500" },    
    { name: "Imperial", max: 20, color: "linear-gradient(135deg, #ffd60a, #ff9500)" }, 
    { name: "Royal", max: 20, color: "linear-gradient(135deg, #bf5af2, #5e5ce6)" }, 
    { name: "Founder", max: 999999, color: "linear-gradient(135deg, #64d2ff, #0a84ff)" }    
];    

function getRank(level) {    
    let sum = 0;    
    for (let i = 0; i < ranks.length; i++) {    
        if (level <= sum + ranks[i].max) return { ...ranks[i], level: level - sum };    
        sum += ranks[i].max;    
    }    
    return { ...ranks[ranks.length-1], level: 1 };    
            }


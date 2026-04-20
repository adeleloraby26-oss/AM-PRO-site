import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAuzoaWTXpF6-V2m4_-vZHF5F1Ca8EpDPA",
    authDomain: "am-portfolyo.firebaseapp.com",
    projectId: "am-portfolyo"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// جلب ID
const params = new URLSearchParams(window.location.search);
let currentUserId = params.get('id') || localStorage.getItem("loggedUserId");

// تسجيل الخروج
document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("loggedUserId");
    window.location.href = "home.html";
};

if (!currentUserId) {
    document.querySelector(".container").innerHTML = `
        <div class="empty-state">
            <h3>جلسة منتهية</h3>
            <p>برجاء تسجيل الدخول</p>
        </div>`;
} else {
    initDashboard();
}

async function initDashboard() {
    const userDocRef = doc(db, "users", currentUserId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
        const data = userDoc.data();
        document.getElementById("userName").innerText = data.username;
        document.getElementById("greetingText").innerText = `مرحباً بك، ${data.username}`;

        const r = getRank(data.level || 1);
        const rankEl = document.getElementById("userRank");

        rankEl.innerText = `${r.name} • مستوى ${r.level}`;
        rankEl.style.background = r.color;
    }

    const tasksQuery = query(collection(db, "tasks"), where("userId", "==", currentUserId));

    onSnapshot(tasksQuery, (snap) => {
        const list = document.getElementById("tasksList");
        const countEl = document.getElementById("taskCount");

        if (snap.empty) {
            list.innerHTML = '<div class="empty-state">لا توجد مهام</div>';
            countEl.innerText = "0 TASKS";
            return;
        }

        countEl.innerText = `${snap.size} TASKS`;
        list.innerHTML = "";

        snap.forEach(t => {
            const task = t.data();

            list.innerHTML += `
                <div class="task-card">
                    <div class="task-icon"></div>
                    <div>
                        <h4>${task.text}</h4>
                        <p>مهمة من الإدارة</p>
                    </div>
                </div>
            `;
        });
    });
}

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
        if (level <= sum + ranks[i].max)
            return { ...ranks[i], level: level - sum };
        sum += ranks[i].max;
    }
    return { ...ranks[ranks.length - 1], level: 1 };
}
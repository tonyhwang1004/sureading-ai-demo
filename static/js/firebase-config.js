// Firebase 설정 (어학원용)
const firebaseConfig = {
    // 실제 Firebase 프로젝트 설정으로 교체 필요
    apiKey: "YOUR_API_KEY",
    authDomain: "sue-reading-academy.firebaseapp.com",
    projectId: "sue-reading-academy",
    storageBucket: "sue-reading-academy.appspot.com",
    messagingSenderId: "123456789",
    appId: "YOUR_APP_ID"
};

// Firebase 초기화
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.firebase = { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, doc, setDoc, getDoc, updateDoc };

console.log('🔥 Firebase 초기화 완료 - 어학원 시스템 준비됨!');

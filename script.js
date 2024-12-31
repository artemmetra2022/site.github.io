// Импорт Firebase модулей
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Конфигурация Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBnxbzgVDndgv5tb9hTf9-_s6Upr1wngU0",
    authDomain: "meineproject-5d634.firebaseapp.com",
    projectId: "meineproject-5d634",
    storageBucket: "meineproject-5d634.firebasestorage.app",
    messagingSenderId: "1064508732292",
    appId: "1:1064508732292:web:edb07e5a1a8c829c21e3d1",
    measurementId: "G-7J8FW0DN4S"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Инициализация Firestore
const auth = getAuth(app); // Инициализация Authentication

// Регистрация
document.getElementById('registerForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Создание пользователя через Firebase Authentication
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showSuccess('Регистрация успешна');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        })
        .catch((error) => {
            showError(error.message); // Показ ошибки, если регистрация не удалась
        });
});

// Вход
document.getElementById('loginForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Авторизация пользователя через Firebase Authentication
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            localStorage.setItem('currentUser', userCredential.user.email); // Сохранение email пользователя в localStorage
            window.location.href = 'messages.html'; // Перенаправление на страницу сообщений
        })
        .catch((error) => {
            showError(error.message); // Показ ошибки, если вход не удался
        });
});

// Отправка сообщения
document.getElementById('messageForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const message = document.getElementById('message').value;
    const user = localStorage.getItem('currentUser'); // Получение текущего пользователя из localStorage
    const time = new Date().toLocaleTimeString(); // Время отправки сообщения

    // Сохранение сообщения в Firestore
    addDoc(collection(db, 'messages'), { user, message, time })
        .then(() => {
            document.getElementById('message').value = ''; // Очистка поля ввода
        })
        .catch((error) => {
            console.error('Ошибка отправки сообщения: ', error);
        });
});

// Отображение сообщений
function displayMessages() {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = '';

    // Получение сообщений из Firestore в реальном времени
    onSnapshot(collection(db, 'messages'), (snapshot) => {
        snapshot.forEach((doc) => {
            const msg = doc.data();
            const messageElement = document.createElement('div');
            messageElement.innerHTML = `
                <strong>${msg.user}</strong> 
                <span class="time">${msg.time}</span>: 
                ${msg.message}
            `;
            messagesDiv.appendChild(messageElement);
        });
    });
}

// Показ ошибки
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block'; // Показ блока ошибки
    setTimeout(() => {
        errorDiv.style.display = 'none'; // Скрытие через 3 секунды
    }, 3000);
}

// Показ успешного сообщения
function showSuccess(message) {
    const successDiv = document.getElementById('success-message');
    successDiv.textContent = message;
    successDiv.style.display = 'block'; // Показ блока успеха
    setTimeout(() => {
        successDiv.style.display = 'none'; // Скрытие через 3 секунды
    }, 3000);
}

// Отображение сообщений при загрузке страницы
if (window.location.pathname.endsWith('messages.html')) {
    displayMessages();
}
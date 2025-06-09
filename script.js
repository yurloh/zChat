// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBKBkBSJorA0TxDnduzdBTORq2MeUs6d7A",
  authDomain: "zchat-5da74.firebaseapp.com",
  databaseURL: "https://zchat-5da74-default-rtdb.firebaseio.com",
  projectId: "zchat-5da74",
  storageBucket: "zchat-5da74.appspot.com",
  messagingSenderId: "822225046146",
  appId: "1:822225046146:web:aa7941c72ae4af1a5ec29b",
  measurementId: "G-4P1BM0EK0K"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const usernameInput = document.getElementById("username-input");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const clearButton = document.getElementById("clear-button");
const messagesContainer = document.getElementById("messages-container");
const emojiButton = document.getElementById("emoji-button");

// Load saved username from localStorage
usernameInput.value = localStorage.getItem('username') || '';

sendButton.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
clearButton.addEventListener("click", clearChat);

// Emoji Picker setup
const picker = new EmojiButton({
  position: 'top-end',
  theme: 'dark'
});

emojiButton.addEventListener('click', () => {
  picker.togglePicker(emojiButton);
});

picker.on('emoji', emoji => {
  messageInput.value += emoji;
  messageInput.focus();
});

function sendMessage() {
  const username = usernameInput.value.trim();
  const message = messageInput.value.trim();

  if (username !== "" && message !== "") {
    const timestamp = Date.now();
    database.ref("messages").push({
      username,
      message,
      timestamp
    }).then(() => {
      console.log("Message sent successfully");
      messageInput.value = "";
      localStorage.setItem('username', username);
    }).catch((error) => {
      console.error("Error sending message: ", error);
    });
  }
}

database.ref("messages").on("child_added", (snapshot) => {
  const message = snapshot.val();
  displayMessage(message);
});

function displayMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");

  const usernameElement = document.createElement("span");
  usernameElement.classList.add("username");
  usernameElement.textContent = message.username;

  const timestampElement = document.createElement("span");
  timestampElement.classList.add("timestamp");
  timestampElement.textContent = new Date(message.timestamp).toLocaleString();

  const textElement = document.createElement("div");
  textElement.textContent = message.message;

  messageElement.appendChild(usernameElement);
  messageElement.appendChild(timestampElement);
  messageElement.appendChild(textElement);

  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function clearChat() {
  const code = prompt("Enter the clear code:");
  if (code === "000000") {
    database.ref("messages").remove()
      .then(() => {
        console.log("Chat cleared successfully");
        messagesContainer.innerHTML = "";
      })
      .catch((error) => {
        console.error("Error clearing chat: ", error);
      });
  } else {
    alert("Incorrect code. Chat not cleared.");
  }
}

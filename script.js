const tg = window.Telegram.WebApp;

tg.ready();

const user = tg.initDataUnsafe.user;
const usernameEl = document.getElementById("username");

if (user) {
  usernameEl.innerText = `Привет, ${user.first_name} (ID: ${user.id})`;
} else {
  usernameEl.innerText = `Открой через Telegram для продолжения`;
}

document.getElementById("continueBtn").onclick = () => {
  tg.close(); // закрыть Mini App (пока просто это)
};

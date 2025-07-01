window.addEventListener('DOMContentLoaded', () => {
  const tg = window.Telegram.WebApp;

  // Проверка, что открыто через Telegram
  if (!tg.initDataUnsafe || !tg.initDataUnsafe.user) {
    document.body.innerHTML = `
      <div style="text-align:center;margin-top:100px;">
        <h2>❌ Пожалуйста, откройте приложение внутри Telegram</h2>
        <a href="https://t.me/your_bot_username" target="_blank">Запустить бота</a>
      </div>
    `;
    return;
  }

  const user = tg.initDataUnsafe.user;
  const welcome = document.getElementById('welcome');
  const mainBalance = document.getElementById('main-balance');
  const bonusBalance = document.getElementById('bonus-balance');

  welcome.textContent = `Привет, ${user.first_name || 'Пользователь'}!`;

  // Отправка initData на сервер для валидации и получения баланса
  fetch('http://0.0.0.0:8000/api/init', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ initData: Telegram.WebApp.initData })
  })
  .then(res => res.json())
  .then(data => {
    // Отобразить баланс и др.
  })
  .catch(console.error);

});

function buyPackage() {
  alert("Здесь будет покупка пакетов");
}

function playGames() {
  alert("Игры в разработке");
}

function withdraw() {
  alert("Создание заявки на вывод");
}

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
  fetch('https://your-backend.com/api/init', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'initData=' + tg.initData
    },
    body: JSON.stringify({ initData: tg.initData })
  })
  .then(res => res.json())
  .then(data => {
    mainBalance.textContent = data.main_balance ?? '0';
    bonusBalance.textContent = data.bonus_balance ?? '0';
  })
  .catch(err => {
    console.error('Ошибка загрузки данных:', err);
    mainBalance.textContent = 'Ошибка';
    bonusBalance.textContent = 'Ошибка';
  });
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

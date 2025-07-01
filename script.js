window.addEventListener('DOMContentLoaded', () => {
  const tg = window.Telegram.WebApp;
  const welcome = document.getElementById('welcome');
  const mainBalance = document.getElementById('main-balance');
  const bonusBalance = document.getElementById('bonus-balance');
  const mainSection = document.getElementById('main');

  if (!tg.initDataUnsafe || !tg.initDataUnsafe.user) {
    document.body.innerHTML = `
      <div style="text-align:center;margin-top:100px;">
        <h2>❌ Пожалуйста, откройте приложение внутри Telegram</h2>
        <a href="https://t.me/lucrora_bot" target="_blank">Запустить бота</a>
      </div>
    `;
    return;
  }

  const user = tg.initDataUnsafe.user;
  welcome.textContent = `👋 Привет, ${user.first_name || 'Пользователь'}!`;

  console.log("🟡 initData:", tg.initData);

  fetch('https://lucrora.osc-fr1.scalingo.io/api/init', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ initData: tg.initData })
  })
  .then(res => res.json())
  .then(data => {
    console.log("🟢 Ответ от сервера:", data);
    if (data.ok) {
      mainBalance.textContent = `Основной баланс: ${data.main_balance}₽`;
      bonusBalance.textContent = `Бонусный баланс: ${data.bonus_balance}₽`;
      mainSection.style.display = 'block';
    } else {
      welcome.textContent = `❌ Не удалось получить данные ${data}`;
    }
  })
  .catch(error => {
    console.error("🔴 Ошибка при запросе:", error);
    welcome.textContent = '❌ Ошибка соединения с сервером';
  });
});

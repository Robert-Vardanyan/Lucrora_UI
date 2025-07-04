// Функция инициализации для экрана профиля
function initProfileScreen() {
  // Вспомогательная функция для получения элемента и логирования ошибки, если не найден
  const getElement = (id) => {
    const element = document.getElementById(id);
    if (!element) {
      console.error(`Ошибка: Элемент с ID '${id}' не найден в DOM.`);
    }
    return element;
  };

  const profileUserId = getElement('profile-user-id');
  const profileUsername = getElement('profile-username');
  const profileRegistrationDate = getElement('profile-registration-date');
  const totalInvested = getElement('total-invested');
  const totalWithdrawn = getElement('total-withdrawn');
  const logoutBtn = getElement('logout-btn'); // Получаем кнопку выхода

  // Обновляем данные профиля
  if (window.appData) {
    if (profileUserId) profileUserId.textContent = window.appData.user.id || 'N/A';
    // Используем username из appData, который может быть обновлен после регистрации/входа
    if (profileUsername) profileUsername.textContent = window.appData.user.first_name || 'N/A';
    // В реальном приложении, registration_date должна приходить с бэкенда из БД
    if (profileRegistrationDate) profileRegistrationDate.textContent = '01.01.2025'; // Заглушка
    if (totalInvested) totalInvested.textContent = `₤ ${window.appData.totalInvested.toFixed(2)}`;
    if (totalWithdrawn) totalWithdrawn.textContent = `₤ ${window.appData.totalWithdrawn.toFixed(2)}`;
  }

  // --- Логика кнопки "Выход из аккаунта" ---
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => { // Добавляем async
      // Подтверждение выхода (можно использовать кастомный модальный диалог вместо alert)
      const confirmLogout = confirm('Вы уверены, что хотите выйти из аккаунта?');
      if (confirmLogout) {
        console.log('Пользователь запросил выход из аккаунта.');

        try {
          // Отправляем запрос на бэкенд для "выхода"
          const response = await fetch('https://lucrora-bot.onrender.com/api/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ telegramInitData: window.Telegram.WebApp.initData }) // Отправляем initData для валидации
          });

          const data = await response.json();

          if (response.ok && data.ok) {
            console.log('Logout successful (backend confirmed):', data.message);
            // 1. Сброс состояния авторизации на фронтенде
            if (window.appData) {
              window.appData.isRegistered = false;
              // Очищаем или сбрасываем балансы и другие данные пользователя
              window.appData.balances = { main: 0, bonus: 0, lucrum: 0 };
              window.appData.totalInvested = 0;
              window.appData.totalWithdrawn = 0;
            }
            // 2. Перезагрузка страницы для перенаправления на экран регистрации
            window.location.reload();
          } else {
            console.error('Logout failed (backend response):', data.message || 'Unknown error');
            // Если бэкенд вернул ошибку, но мы все равно хотим "выйти" на фронтенде
            alert(`Ошибка выхода: ${data.message || 'Пожалуйста, попробуйте еще раз.'}`);
            // Все равно сбросим состояние фронтенда и перезагрузим, чтобы избежать несоответствий
            if (window.appData) {
              window.appData.isRegistered = false;
              window.appData.balances = { main: 0, bonus: 0, lucrum: 0 };
            }
            window.location.reload();
          }
        } catch (error) {
          console.error('Network or API error during logout:', error);
          alert('Ошибка соединения при выходе. Пожалуйста, проверьте ваше подключение.');
          // В случае сетевой ошибки, также сбросим состояние фронтенда и перезагрузим
          if (window.appData) {
            window.appData.isRegistered = false;
            window.appData.balances = { main: 0, bonus: 0, lucrum: 0 };
          }
          window.location.reload();
        }
      }
    });
  }
}

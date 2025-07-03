// Функция инициализации для экрана регистрации
function initRegistrationScreen() {
  // Вспомогательная функция для получения элемента и логирования ошибки, если не найден
  const getElement = (id) => {
    const element = document.getElementById(id);
    if (!element) {
      console.error(`Ошибка: Элемент с ID '${id}' не найден в DOM.`);
    }
    return element;
  };

  const regUsernameInput = getElement('reg-username');
  const regPasswordInput = getElement('reg-password');
  const regReferralCodeInput = getElement('reg-referral-code');
  const registerBtn = getElement('register-btn');
  const registrationMessage = getElement('registration-message');
  const backToLoginBtn = getElement('back-to-login-btn'); // Кнопка "Уже есть аккаунт? Войти"

  if (registerBtn) {
    registerBtn.addEventListener('click', async () => {
      const username = regUsernameInput ? regUsernameInput.value.trim() : '';
      const password = regPasswordInput ? regPasswordInput.value.trim() : '';
      const referralCode = regReferralCodeInput ? regReferralCodeInput.value.trim() : '';

      // Простая валидация на стороне клиента
      if (!username || !password) {
        if (registrationMessage) {
          registrationMessage.textContent = 'Пожалуйста, заполните все обязательные поля (имя пользователя и пароль).';
          registrationMessage.classList.remove('hidden', 'text-green-600');
          registrationMessage.classList.add('text-red-600');
        }
        return;
      }

      if (registrationMessage) {
        registrationMessage.textContent = 'Регистрация...';
        registrationMessage.classList.remove('hidden', 'text-red-600');
        registrationMessage.classList.add('text-gray-600');
      }

      // Имитация API-запроса на регистрацию
      try {
        // В реальном приложении здесь будет fetch-запрос к вашему бэкенду
        // Пример:
        /*
        const response = await fetch('https://your-api.com/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, referralCode, telegramInitData: window.Telegram.WebApp.initData })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          if (registrationMessage) {
            registrationMessage.textContent = 'Регистрация прошла успешно! Вы будете перенаправлены на главный экран.';
            registrationMessage.classList.remove('text-red-600', 'text-gray-600');
            registrationMessage.classList.add('text-green-600');
          }
          // Здесь можно обновить window.appData с данными нового пользователя
          // и затем перенаправить на главный экран
          setTimeout(() => {
            window.loadScreen('home');
          }, 2000);
        } else {
          throw new Error(data.message || 'Ошибка регистрации.');
        }
        */

        // Заглушка для демонстрации:
        await new Promise(resolve => setTimeout(resolve, 1500)); // Имитация задержки сети
        if (username === 'test' && password === 'test') {
          throw new Error('Пользователь с таким именем уже существует.');
        }

        if (registrationMessage) {
          registrationMessage.textContent = 'Регистрация прошла успешно! Вы будете перенаправлены на главный экран.';
          registrationMessage.classList.remove('text-red-600', 'text-gray-600');
          registrationMessage.classList.add('text-green-600');
        }

        // В реальном приложении: обновить appData и перейти на home
        // window.appData.user = { id: 'new_user_id', first_name: username };
        // window.appData.balances = { main: 0, bonus: 0, lucrum: 0 };
        setTimeout(() => {
          window.loadScreen('home'); // Предполагаем, что после регистрации пользователь переходит на главную
        }, 2000);

      } catch (error) {
        console.error('Ошибка регистрации:', error);
        if (registrationMessage) {
          registrationMessage.textContent = `Ошибка: ${error.message}`;
          registrationMessage.classList.remove('text-green-600', 'text-gray-600');
          registrationMessage.classList.add('text-red-600');
        }
      }
    });
  }

  // Если есть кнопка "Уже есть аккаунт?", можно ее использовать для навигации
  if (backToLoginBtn) {
    backToLoginBtn.addEventListener('click', () => {
      // Здесь можно реализовать переход на экран входа, если он есть
      // Или просто вернуться на экран Telegram Prompt, если это начальная точка
      alert('Функция "Войти" пока не реализована. Возврат на экран Telegram Prompt.');
      // window.loadScreen('telegram-prompt'); // Если у вас есть такой экран
      // Или просто перезагрузить страницу для демонстрации
      window.location.reload();
    });
  }
}

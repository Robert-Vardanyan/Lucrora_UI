document.addEventListener('DOMContentLoaded', () => {
  // Вспомогательная функция для получения элемента и логирования ошибки, если не найден
  const getElement = (id) => {
    const element = document.getElementById(id);
    if (!element) {
      console.error(`Ошибка: Элемент с ID '${id}' не найден в DOM.`);
    }
    return element;
  };

  // Получаем основные разделы UI
  const loadingMessage = getElement('loading-message');
  const telegramPrompt = getElement('telegram-prompt');
  const registrationScreen = getElement('registration-screen'); // НОВЫЙ: Получаем контейнер для экрана регистрации
  const mainContentWrapper = getElement('main-content-wrapper');
  const screenContainer = getElement('screen-container');

  // Получаем элементы оверлея ошибок
  const customErrorOverlay = getElement('custom-error-overlay');
  const errorTitle = getElement('error-title');
  const errorMessage = getElement('error-message');
  const errorCloseBtn = getElement('error-close-btn');

  // Получаем элементы навигации
  const navHome = getElement('nav-home');
  const navInvest = getElement('nav-invest');
  const navGames = getElement('nav-games');
  const navReferrals = getElement('nav-referrals');
  const navHistory = getElement('nav-history');
  const userProfileIcon = getElement('user-profile-icon');

  // Элементы баланса в заголовке (делаем их глобально доступными для обновления из других скриптов)
  window.currentMainBalance = getElement('current-main-balance');
  window.currentBonusBalance = getElement('current-bonus-balance');

  // Текущий активный скрипт экрана
  let currentScreenScript = null;

  // Изначально скрываем все и показываем загрузочное сообщение
  if (loadingMessage) loadingMessage.classList.remove('hidden');
  if (telegramPrompt) telegramPrompt.classList.add('hidden');
  if (registrationScreen) registrationScreen.classList.add('hidden'); // НОВЫЙ: Скрываем экран регистрации по умолчанию
  if (mainContentWrapper) mainContentWrapper.classList.add('hidden');
  if (customErrorOverlay) customErrorOverlay.classList.add('hidden');

  /**
   * Загружает и отображает содержимое определенного экрана.
   * Также загружает соответствующий JavaScript-файл.
   * @param {string} screenName Имя экрана (например, 'home', 'invest', 'registration').
   */
  async function loadScreen(screenName) {
    // Определяем, куда загружать HTML: в registrationScreen или в screenContainer
    const targetContainer = (screenName === 'registration') ? registrationScreen : screenContainer;

    if (!targetContainer) {
      console.error(`Ошибка: Целевой контейнер для экрана '${screenName}' не найден.`);
      return;
    }

    // Удаляем предыдущий скрипт, если он был
    if (currentScreenScript) {
      document.head.removeChild(currentScreenScript);
      currentScreenScript = null;
    }

    try {
      // Загружаем HTML-содержимое экрана из соответствующей папки
      const htmlResponse = await fetch(`${screenName}/${screenName}-screen.html`);
      if (!htmlResponse.ok) {
        throw new Error(`Не удалось загрузить ${screenName}/${screenName}-screen.html: ${htmlResponse.statusText}`);
      }
      const htmlContent = await htmlResponse.text();
      targetContainer.innerHTML = htmlContent;

      // Загружаем соответствующий JavaScript-файл из соответствующей папки
      const script = document.createElement('script');
      script.src = `${screenName}/${screenName}-script.js`;
      script.onload = () => {
        console.log(`Скрипт ${screenName}/${screenName}-script.js загружен.`);
        // Если у скрипта есть функция инициализации, вызываем ее
        if (window[`init${capitalizeFirstLetter(screenName)}Screen`]) {
          window[`init${capitalizeFirstLetter(screenName)}Screen`]();
        }
      };
      script.onerror = () => {
        console.error(`Ошибка загрузки скрипта для ${screenName}/${screenName}-script.js`);
      };
      document.head.appendChild(script);
      currentScreenScript = script;

      // Обновляем активный класс для элементов навигации, только если это не экран регистрации/входа
      if (screenName !== 'registration' && screenName !== 'login' && screenName !== 'resend-email') { // Добавлено 'login', 'resend-email'
        document.querySelectorAll('.nav-item').forEach(item => {
          item.classList.remove('active', 'text-green-600');
          item.classList.add('text-gray-500'); // Сброс цвета
        });

        let activeNavItem;
        if (screenName === 'home') activeNavItem = navHome;
        else if (screenName === 'invest') activeNavItem = navInvest;
        else if (screenName === 'games') activeNavItem = navGames;
        else if (screenName === 'referrals') activeNavItem = navReferrals;
        else if (screenName === 'history') activeNavItem = navHistory;
        else if (screenName === 'profile') activeNavItem = userProfileIcon;

        if (activeNavItem) {
          activeNavItem.classList.add('active', 'text-green-600');
          activeNavItem.classList.remove('text-gray-500');
        }
      } else {
        // Если это экран регистрации/входа, сбрасываем активные классы навигации
        document.querySelectorAll('.nav-item').forEach(item => {
          item.classList.remove('active', 'text-green-600');
          item.classList.add('text-gray-500');
        });
      }


    } catch (error) {
      console.error(`Ошибка при загрузке экрана ${screenName}:`, error);
      showError('Ошибка загрузки экрана', `Не удалось загрузить содержимое экрана "${screenName}". ${error.message}`);
    }
  }

  // Вспомогательная функция для преобразования первой буквы в заглавную
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  /**
   * Показывает оверлей с сообщением об ошибке.
   * @param {string} title Заголовок ошибки.
   * @param {string} message Подробное сообщение об ошибке.
   */
  window.showError = function(title, message) { // Делаем глобальной для доступа из других скриптов
    if (loadingMessage) loadingMessage.classList.add('hidden');
    if (telegramPrompt) telegramPrompt.classList.add('hidden');
    if (mainContentWrapper) mainContentWrapper.classList.add('hidden');
    if (registrationScreen) registrationScreen.classList.add('hidden'); // НОВЫЙ: Скрываем экран регистрации при ошибке
    if (customErrorOverlay) customErrorOverlay.classList.remove('hidden');

    // Безопасная установка текстового содержимого
    if (errorTitle) errorTitle.textContent = title;
    if (errorMessage) errorMessage.textContent = message;
  };

  /**
   * Скрывает оверлей с сообщением об ошибке.
   */
  function hideError() {
    if (customErrorOverlay) customErrorOverlay.classList.add('hidden');

    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
      // После ошибки возвращаемся на экран, который должен быть по умолчанию
      if (window.appData && window.appData.isRegistered) {
        if (mainContentWrapper) mainContentWrapper.classList.remove('hidden');
        if (registrationScreen) registrationScreen.classList.add('hidden'); // Убедиться, что экран регистрации скрыт
        loadScreen('home');
      } else {
        if (registrationScreen) registrationScreen.classList.remove('hidden'); // НОВЫЙ: Показываем экран регистрации, если не зарегистрирован
        if (mainContentWrapper) mainContentWrapper.classList.add('hidden'); // Убедиться, что основной контент скрыт
        loadScreen('registration');
      }
    } else {
      if (telegramPrompt) telegramPrompt.classList.remove('hidden');
    }
  }

  // Прикрепляем слушатель событий к кнопке закрытия ошибки
  if (errorCloseBtn) {
    errorCloseBtn.addEventListener('click', hideError);
  }

  // Проверяем доступность Telegram WebApp
  if (!window.Telegram || !window.Telegram.WebApp) {
    if (loadingMessage) loadingMessage.classList.add('hidden');
    if (telegramPrompt) telegramPrompt.classList.remove('hidden');
    return;
  }

  const tg = window.Telegram.WebApp;

  if (!tg.initDataUnsafe || !tg.initDataUnsafe.user) {
    if (loadingMessage) loadingMessage.classList.add('hidden');
    if (telegramPrompt) telegramPrompt.classList.remove('hidden');
    return;
  }

  const user = tg.initDataUnsafe.user;
  console.log("🟡 initData:", tg.initData);

  // Загружаем данные пользователя с вашего API
  fetch('https://lucrora-bot.onrender.com/api/init', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ initData: tg.initData })
  })
    .then(res => {
      if (!res.ok) {
        return res.json().then(err => {
          console.error("🔴 Сервер ответил с JSON-ошибкой:", err);
          throw new Error(err.message || `Сервер вернул ошибку: ${res.status}`);
        }).catch(() => {
          console.error("🔴 Сервер ответил с не-JSON-ошибкой:", res.status, res.statusText);
          throw new Error(`Сервер вернул ошибку: ${res.status} ${res.statusText}`);
        });
      }
      return res.json();
    })
    .then(data => {
      console.log("🟢 Ответ от сервера:", data);
      if (data.ok) {
        // Безопасное обновление балансов в заголовке
        if (window.currentMainBalance) window.currentMainBalance.textContent = `₤ ${(data.main_balance || 0).toFixed(2)} LCR`;
        if (window.currentBonusBalance) window.currentBonusBalance.textContent = `(Bonus: ${(data.bonus_balance || 0).toFixed(2)} ₤s)`;

        if (loadingMessage) loadingMessage.classList.add('hidden');
        window.loadScreen = loadScreen; // Делаем loadScreen доступной глобально
        window.appData = { // Делаем appData доступной глобально
            user: user,
            balances: {
                main: data.main_balance || 0,
                bonus: data.bonus_balance || 0,
                lucrum: data.lucrum_balance || 0,
            },
            totalInvested: data.total_invested || 0,
            totalWithdrawn: data.total_withdrawn || 0,
            isRegistered: data.isRegistered || false // <--- ВАЖНОЕ ИЗМЕНЕНИЕ: Добавляем флаг регистрации
        };

        // <--- ВАЖНОЕ ИЗМЕНЕНИЕ: Проверяем, зарегистрирован ли пользователь
        if (window.appData.isRegistered) {
          if (mainContentWrapper) mainContentWrapper.classList.remove('hidden'); // Показываем основной контент
          if (registrationScreen) registrationScreen.classList.add('hidden'); // Скрываем экран регистрации
          loadScreen('home'); // Если зарегистрирован, переходим на домашний экран
        } else {
          if (registrationScreen) registrationScreen.classList.remove('hidden'); // Показываем экран регистрации
          if (mainContentWrapper) mainContentWrapper.classList.add('hidden'); // Скрываем основной контент
          loadScreen('registration'); // Если не зарегистрирован, переходим на экран регистрации
        }

      } else {
        window.showError('Ошибка данных от сервера', data.message || 'Сервер вернул ошибку. Пожалуйста, попробуйте еще раз.');
      }
    })
    .catch(error => {
      console.error("🔴 Ошибка при запросе:", error);
      window.showError('Ошибка соединения с сервером', `Не удалось подключиться к серверу. ${error.message || 'Пожалуйста, проверьте ваше интернет-соединение или попробуйте позже.'}`);
    });

  // --- Слушатели событий навигации ---
  // Эти слушатели будут работать только когда mainContentWrapper видим
  if (navHome) navHome.addEventListener('click', () => loadScreen('home'));
  if (navInvest) navInvest.addEventListener('click', () => loadScreen('invest'));
  if (navGames) navGames.addEventListener('click', () => loadScreen('games'));
  if (navReferrals) navReferrals.addEventListener('click', () => loadScreen('referrals'));
  if (navHistory) navHistory.addEventListener('click', () => loadScreen('history'));
  if (userProfileIcon) userProfileIcon.addEventListener('click', () => loadScreen('profile'));

  // НОВЫЙ: Функция для обработки успешной регистрации/входа (вызывать из registration-script.js)
  window.onAuthSuccess = () => {
    console.log('Аутентификация успешна, переходим в основное приложение.');
    if (registrationScreen) registrationScreen.classList.add('hidden'); // Скрываем экран регистрации
    if (mainContentWrapper) mainContentWrapper.classList.remove('hidden'); // Показываем основной контент
    // Важно: Здесь нужно обновить балансы в шапке, либо перевызвать API init, либо передать данные из скрипта регистрации
    // В примере registration-script.js я добавил обновление window.currentMainBalance и window.currentBonusBalance
    loadScreen('home'); // Загружаем домашний экран
  };
});
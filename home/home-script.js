// Функция инициализации для домашнего экрана
function initHomeScreen() {
  // Вспомогательная функция для получения элемента и логирования ошибки, если не найден
  const getElement = (id) => {
    const element = document.getElementById(id);
    if (!element) {
      console.error(`Ошибка: Элемент с ID '${id}' не найден в DOM.`);
    }
    return element;
  };

  // Получаем элементы домашнего экрана
  const welcome = getElement('welcome');
  const mainBalance = getElement('main-balance');
  const bonusBalance = getElement('bonus-balance');
  const lucrumBalance = getElement('lucrum-balance');
  const activePackagesCount = getElement('active-packages-count');
  const dailyIncome = getElement('daily-income');
  const totalInvestments = getElement('total-investments');
  const totalEarnings = getElement('total-earnings');

  const buyPackageBtn = getElement('buy-package-btn');
  const depositBtn = getElement('deposit-btn');
  const withdrawBtn = getElement('withdraw-btn');

  // Элементы конвертера
  const amountInput = getElement('amount-input');
  const convertButton = getElement('convert-button');
  const convertedAmountSpan = getElement('converted-amount');
  const convertedCurrencySpan = getElement('converted-currency');

  // Обновляем данные на домашнем экране
  if (window.appData) {
    if (welcome) welcome.textContent = `👋 Привет, ${window.appData.user.first_name || 'Пользователь'}!`;
    if (mainBalance) mainBalance.textContent = `Основной баланс: ${window.appData.balances.main.toFixed(2)}₤`;
    if (bonusBalance) bonusBalance.textContent = `Бонусный баланс: ${window.appData.balances.bonus.toFixed(2)}₤`;
    if (lucrumBalance) lucrumBalance.textContent = `${window.appData.balances.lucrum.toFixed(2)} ₤`;
    // Эти данные должны приходить с сервера, пока используем заглушки
    if (activePackagesCount) activePackagesCount.textContent = '0';
    if (dailyIncome) dailyIncome.textContent = '+ ₤0.00';
    if (totalInvestments) totalInvestments.textContent = '₤12,345'; // Заглушка
    if (totalEarnings) totalEarnings.textContent = '₤2,100'; // Заглушка
  }

  // --- Слушатели событий кнопок домашнего экрана ---
  if (buyPackageBtn) buyPackageBtn.addEventListener('click', () => window.loadScreen('invest'));
  if (depositBtn) depositBtn.addEventListener('click', () => window.loadScreen('deposit'));
  if (withdrawBtn) withdrawBtn.addEventListener('click', () => window.loadScreen('withdrawal'));

  // --- Логика конвертера ---
  if (convertButton) {
    convertButton.addEventListener('click', () => {
      const amount = amountInput ? parseFloat(amountInput.value) : 0;
      if (isNaN(amount) || amount <= 0) {
        if (convertedAmountSpan) convertedAmountSpan.textContent = '0.00';
        if (convertedCurrencySpan) convertedCurrencySpan.textContent = '0.00';
        return;
      }
      const lucrumValue = amount;
      const usdValue = amount * 0.5; // Примерный курс конвертации
      if (convertedAmountSpan) convertedAmountSpan.textContent = lucrumValue.toFixed(2);
      if (convertedCurrencySpan) convertedCurrencySpan.textContent = usdValue.toFixed(2);
    });
  }
}

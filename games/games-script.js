// Функция инициализации для экрана игр
function initGamesScreen() {
  // Вспомогательная функция для получения элемента и логирования ошибки, если не найден
  const getElement = (id) => {
    const element = document.getElementById(id);
    if (!element) {
      console.error(`Ошибка: Элемент с ID '${id}' не найден в DOM.`);
    }
    return element;
  };

  const gamesBonusBalance = getElement('games-bonus-balance');
  const playButtons = document.querySelectorAll('.play-game-button');

  // Обновляем бонусный баланс
  if (gamesBonusBalance && window.appData && window.appData.balances) {
    gamesBonusBalance.textContent = `${window.appData.balances.bonus.toFixed(2)} ₤s`;
  }

  // Добавляем слушатели событий для кнопок "Играть"
  playButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const gameName = event.target.closest('.game-card').querySelector('h3').textContent;
      const costText = event.target.closest('.game-card').querySelector('.font-semibold').textContent;
      const gameCost = parseFloat(costText.replace('₤', ''));

      if (window.appData && window.appData.balances.bonus >= gameCost) {
        console.log(`Запуск игры "${gameName}" стоимостью ₤${gameCost}`);
        // В реальном приложении здесь будет логика запуска игры
        alert(`Вы запустили игру "${gameName}". Эта функция пока не реализована.`);
      } else {
        alert('Недостаточно средств на бонусном балансе для игры!');
      }
    });
  });
}

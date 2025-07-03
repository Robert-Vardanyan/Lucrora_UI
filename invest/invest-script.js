// Функция инициализации для экрана инвестиций
function initInvestScreen() {
  // Вспомогательная функция для получения элемента и логирования ошибки, если не найден
  const getElement = (id) => {
    const element = document.getElementById(id);
    if (!element) {
      console.error(`Ошибка: Элемент с ID '${id}' не найден в DOM.`);
    }
    return element;
  };

  // Получаем все кнопки "Купить Пакет"
  const buyPackageButtons = document.querySelectorAll('.buy-package-button');

  buyPackageButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const packageCostText = event.target.textContent.match(/₤(\d+)/);
      if (packageCostText && packageCostText[1]) {
        const packageCost = parseFloat(packageCostText[1]);
        // Здесь можно добавить логику покупки пакета
        console.log(`Покупка пакета за ₤${packageCost} LCR`);
        // В реальном приложении здесь будет вызов API для совершения покупки
        alert(`Вы попытались купить пакет за ₤${packageCost}. Эта функция пока не реализована.`);
      }
    });
  });
}

// Функция инициализации для экрана истории
function initHistoryScreen() {
  // Вспомогательная функция для получения элемента и логирования ошибки, если не найден
  const getElement = (id) => {
    const element = document.getElementById(id);
    if (!element) {
      console.error(`Ошибка: Элемент с ID '${id}' не найден в DOM.`);
    }
    return element;
  };

  const transactionFilter = getElement('transaction-filter');
  const transactionsList = getElement('transactions-list');

  // Здесь можно добавить логику фильтрации транзакций
  if (transactionFilter) {
    transactionFilter.addEventListener('change', (event) => {
      const filterValue = event.target.value;
      console.log(`Фильтр транзакций изменен на: ${filterValue}`);
      // В реальном приложении здесь будет логика загрузки и отображения отфильтрованных транзакций
      // Например, вызов API с параметром фильтра
      if (transactionsList) {
        // Пример: очистка списка и добавление новых элементов на основе фильтра
        transactionsList.innerHTML = `
          <div class="transaction-item bg-white rounded-xl shadow-md p-4">
            <p class="text-sm text-gray-500">02.07.2025, 10:00</p>
            <p class="text-lg font-semibold text-gray-800">Фильтрованная транзакция (${filterValue})</p>
            <p class="text-gray-600">Описание: Пример фильтрации</p>
            <p class="text-green-600 font-bold">+ ₤10.00</p>
          </div>
        `;
      }
    });
  }
}

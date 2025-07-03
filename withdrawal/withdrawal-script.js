// Функция инициализации для экрана вывода средств
function initWithdrawalScreen() {
  // Вспомогательная функция для получения элемента и логирования ошибки, если не найден
  const getElement = (id) => {
    const element = document.getElementById(id);
    if (!element) {
      console.error(`Ошибка: Элемент с ID '${id}' не найден в DOM.`);
    }
    return element;
  };

  const currentWithdrawalBalance = getElement('current-withdrawal-balance');
  const withdrawalAmountInput = getElement('withdrawal-amount-input');
  const withdrawalAddressInput = getElement('withdrawal-address-input');
  const withdrawalFee = getElement('withdrawal-fee');
  const totalReceived = getElement('total-received');
  const submitWithdrawalBtn = getElement('submit-withdrawal-btn');

  // Обновляем текущий баланс для вывода
  if (currentWithdrawalBalance && window.appData && window.appData.balances) {
    currentWithdrawalBalance.textContent = `₤ ${window.appData.balances.main.toFixed(2)} LCR`;
  }

  if (withdrawalAmountInput) {
    withdrawalAmountInput.addEventListener('input', () => {
      const amount = parseFloat(withdrawalAmountInput.value);
      const currentBalance = window.appData ? window.appData.balances.main : 0;
      const minWithdrawal = 10;

      if (isNaN(amount) || amount <= 0) {
        if (withdrawalFee) withdrawalFee.textContent = '0%';
        if (totalReceived) totalReceived.textContent = '₤0.00';
        withdrawalAmountInput.classList.remove('border-red-500');
        withdrawalAmountInput.classList.add('border-gray-300');
        return;
      }

      let feePercentage = 0;
      if (amount < 100 && amount >= minWithdrawal) {
        feePercentage = 3;
      } else if (amount < minWithdrawal) {
        if (withdrawalFee) withdrawalFee.textContent = 'Недостаточно';
        if (totalReceived) totalReceived.textContent = '₤0.00';
        withdrawalAmountInput.classList.add('border-red-500');
        withdrawalAmountInput.classList.remove('border-gray-300');
        return;
      }

      const feeAmount = (amount * feePercentage) / 100;
      const netAmount = amount - feeAmount;

      if (withdrawalFee) withdrawalFee.textContent = `${feePercentage}%`;
      if (totalReceived) totalReceived.textContent = `₤${netAmount.toFixed(2)}`;

      if (amount > currentBalance) {
        withdrawalAmountInput.classList.add('border-red-500');
        withdrawalAmountInput.classList.remove('border-gray-300');
      } else {
        withdrawalAmountInput.classList.remove('border-red-500');
        withdrawalAmountInput.classList.add('border-gray-300');
      }
    });
  }

  if (submitWithdrawalBtn) {
    submitWithdrawalBtn.addEventListener('click', () => {
      const amount = parseFloat(withdrawalAmountInput.value);
      const address = withdrawalAddressInput.value.trim();
      const currentBalance = window.appData ? window.appData.balances.main : 0;
      const minWithdrawal = 10;

      if (isNaN(amount) || amount <= 0 || amount < minWithdrawal) {
        alert('Пожалуйста, введите корректную сумму для вывода (минимум ₤10).');
        return;
      }
      if (amount > currentBalance) {
        alert('Недостаточно средств на балансе для вывода.');
        return;
      }
      if (!address) {
        alert('Пожалуйста, введите адрес вашего LCR (TRC20) кошелька.');
        return;
      }

      console.log(`Заявка на вывод: Сумма ₤${amount}, Адрес: ${address}`);
      // В реальном приложении здесь будет вызов API для создания заявки на вывод
      alert(`Ваша заявка на вывод ₤${amount} на адрес ${address} отправлена. Обработка займет до 24 часов.`);
      // Очищаем поля после отправки
      if (withdrawalAmountInput) withdrawalAmountInput.value = '';
      if (withdrawalFee) withdrawalFee.textContent = '0%';
      if (totalReceived) totalReceived.textContent = '₤0.00';
    });
  }
}

// Функция инициализации для экрана пополнения
function initDepositScreen() {
  // Вспомогательная функция для получения элемента и логирования ошибки, если не найден
  const getElement = (id) => {
    const element = document.getElementById(id);
    if (!element) {
      console.error(`Ошибка: Элемент с ID '${id}' не найден в DOM.`);
    }
    return element;
  };

  const LCRAddressInput = getElement('LCR-address-input');
  const copyLCRAddressBtn = getElement('copy-LCR-address-btn');
  const txidInput = getElement('txid-input');
  const paidButton = document.querySelector('#deposit-screen .action-button.bg-green-500'); // Кнопка "Я оплатил"

  if (copyLCRAddressBtn) {
    copyLCRAddressBtn.addEventListener('click', () => {
      if (LCRAddressInput) {
        LCRAddressInput.select();
        document.execCommand('copy');
        const originalText = copyLCRAddressBtn.textContent;
        copyLCRAddressBtn.textContent = 'Скопировано!';
        setTimeout(() => {
          copyLCRAddressBtn.textContent = originalText;
        }, 2000);
      }
    });
  }

  if (paidButton) {
    paidButton.addEventListener('click', () => {
      const txid = txidInput ? txidInput.value.trim() : '';
      if (txid) {
        console.log(`Отправлен TXID для пополнения: ${txid}`);
        // В реальном приложении здесь будет вызов API для обработки пополнения
        alert(`Ваш TXID (${txid}) отправлен на проверку. Средства будут зачислены после подтверждения.`);
        if (txidInput) txidInput.value = ''; // Очищаем поле
      } else {
        alert('Пожалуйста, введите TXID транзакции.');
      }
    });
  }
}

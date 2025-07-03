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

  // Обновляем данные профиля
  if (window.appData) {
    if (profileUserId) profileUserId.textContent = window.appData.user.id || 'N/A';
    if (profileUsername) profileUsername.textContent = window.appData.user.first_name || 'N/A';
    if (profileRegistrationDate) profileRegistrationDate.textContent = '01.01.2025'; // Заглушка
    if (totalInvested) totalInvested.textContent = `₤ ${window.appData.totalInvested.toFixed(2)}`;
    if (totalWithdrawn) totalWithdrawn.textContent = `₤ ${window.appData.totalWithdrawn.toFixed(2)}`;
  }
}

// Функция инициализации для экрана рефералов
function initReferralsScreen() {
  // Вспомогательная функция для получения элемента и логирования ошибки, если не найден
  const getElement = (id) => {
    const element = document.getElementById(id);
    if (!element) {
      console.error(`Ошибка: Элемент с ID '${id}' не найден в DOM.`);
    }
    return element;
  };

  const referralLinkInput = getElement('referral-link-input');
  const copyReferralLinkBtn = getElement('copy-referral-link-btn');
  const shareReferralLinkBtn = getElement('share-referral-link-btn');
  const referralEarnings = getElement('referral-earnings');
  const activeReferralsCount = getElement('active-referrals-count');

  // Обновляем данные рефералов (заглушки)
  if (referralEarnings) referralEarnings.textContent = '₤15.75';
  if (activeReferralsCount) activeReferralsCount.textContent = '12';
  if (referralLinkInput && window.appData && window.appData.user) {
    referralLinkInput.value = `https://t.me/YourBot?start=ref_${window.appData.user.id}`;
  }


  if (copyReferralLinkBtn) {
    copyReferralLinkBtn.addEventListener('click', () => {
      if (referralLinkInput) {
        referralLinkInput.select();
        document.execCommand('copy');
        const originalText = copyReferralLinkBtn.textContent;
        copyReferralLinkBtn.textContent = 'Скопировано!';
        setTimeout(() => {
          copyReferralLinkBtn.textContent = originalText;
        }, 2000);
      }
    });
  }

  if (shareReferralLinkBtn) {
    shareReferralLinkBtn.addEventListener('click', () => {
      if (referralLinkInput && window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        if (tg.shareText) {
          tg.shareText(referralLinkInput.value, 'Поделитесь моей реферальной ссылкой!');
        } else {
          console.log("Прямой обмен не поддерживается. Вместо этого скопировано в буфер обмена.");
          referralLinkInput.select();
          document.execCommand('copy');
          const originalText = shareReferralLinkBtn.textContent;
          shareReferralLinkBtn.textContent = 'Скопировано!';
          setTimeout(() => {
            shareReferralLinkBtn.textContent = originalText;
          }, 2000);
        }
      }
    });
  }
}

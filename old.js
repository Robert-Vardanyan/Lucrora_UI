document.addEventListener('DOMContentLoaded', () => {
  // Helper function to get element and log error if not found
  const getElement = (id) => {
    const element = document.getElementById(id);
    if (!element) {
      console.error(`Error: Element with ID '${id}' not found in the DOM.`);
    }
    return element;
  };

  // Get main UI sections
  const loadingMessage = getElement('loading-message');
  const telegramPrompt = getElement('telegram-prompt');
  const mainContentWrapper = getElement('main-content-wrapper');

  // Get error overlay elements
  const customErrorOverlay = getElement('custom-error-overlay');
  const errorTitle = getElement('error-title');
  const errorMessage = getElement('error-message');
  const errorCloseBtn = getElement('error-close-btn');

  // Get navigation items
  const navHome = getElement('nav-home');
  const navInvest = getElement('nav-invest');
  const navGames = getElement('nav-games');
  const navReferrals = getElement('nav-referrals');
  const navHistory = getElement('nav-history');
  const userProfileIcon = getElement('user-profile-icon');

  // Get all screen elements
  const screens = {
    'home-screen': getElement('home-screen'),
    'invest-screen': getElement('invest-screen'),
    'games-screen': getElement('games-screen'),
    'referrals-screen': getElement('referrals-screen'),
    'history-screen': getElement('history-screen'),
    'profile-screen': getElement('profile-screen'),
    'deposit-screen': getElement('deposit-screen'),
    'withdrawal-screen': getElement('withdrawal-screen')
  };

  // Initially hide all screens and show loading message
  if (loadingMessage) loadingMessage.classList.remove('hidden');
  if (telegramPrompt) telegramPrompt.classList.add('hidden');
  if (mainContentWrapper) mainContentWrapper.classList.add('hidden');
  if (customErrorOverlay) customErrorOverlay.classList.add('hidden');
  Object.values(screens).forEach(screen => {
    if (screen) screen.classList.add('hidden');
  });

  /**
   * Shows a specific screen and hides all others.
   * Also updates the active state of navigation items.
   * @param {string} screenId The ID of the screen to show.
   */
  function showScreen(screenId) {
    Object.keys(screens).forEach(id => {
      const screen = screens[id];
      if (screen) {
        if (id === screenId) {
          screen.classList.remove('hidden');
        } else {
          screen.classList.add('hidden');
        }
      }
    });

    // Update active class for nav items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active', 'text-green-600');
      item.classList.add('text-gray-500'); // Reset color
    });

    // Add active class to the corresponding nav item
    let activeNavItem;
    if (screenId === 'home-screen') activeNavItem = navHome;
    else if (screenId === 'invest-screen') activeNavItem = navInvest;
    else if (screenId === 'games-screen') activeNavItem = navGames;
    else if (screenId === 'referrals-screen') activeNavItem = navReferrals;
    else if (screenId === 'history-screen') activeNavItem = navHistory;

    if (activeNavItem) {
      activeNavItem.classList.add('active', 'text-green-600');
      activeNavItem.classList.remove('text-gray-500');
    }
  }

  /**
   * Shows a custom error message overlay.
   * @param {string} title The title of the error.
   * @param {string} message The detailed error message.
   */
  function showError(title, message) {
    if (loadingMessage) loadingMessage.classList.add('hidden');
    if (telegramPrompt) telegramPrompt.classList.add('hidden');
    if (mainContentWrapper) mainContentWrapper.classList.add('hidden');
    if (customErrorOverlay) customErrorOverlay.classList.remove('hidden');
    
    // Safely set text content
    if (errorTitle) errorTitle.textContent = title;
    if (errorMessage) errorMessage.textContent = message;
  }

  /**
   * Hides the custom error message overlay.
   */
  function hideError() {
    if (customErrorOverlay) customErrorOverlay.classList.add('hidden');
    
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
      if (mainContentWrapper) mainContentWrapper.classList.remove('hidden');
      showScreen('home-screen');
    } else {
      if (telegramPrompt) telegramPrompt.classList.remove('hidden');
    }
  }

  // Attach event listener to the error close button
  if (errorCloseBtn) {
    errorCloseBtn.addEventListener('click', hideError);
  }

  // Check if Telegram WebApp is available
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

  // Get UI elements for the main app
  const welcome = getElement('welcome');
  const currentMainBalance = getElement('current-main-balance');
  const currentBonusBalance = getElement('current-bonus-balance');
  const lucrumBalance = getElement('lucrum-balance');
  const mainBalance = getElement('main-balance');
  const bonusBalance = getElement('bonus-balance');

  // Home screen elements
  const buyPackageBtn = getElement('buy-package-btn');
  const depositBtn = getElement('deposit-btn');
  const withdrawBtn = getElement('withdraw-btn');

  // Conversion elements
  const amountInput = getElement('amount-input');
  const convertButton = getElement('convert-button');
  const convertedAmountSpan = getElement('converted-amount');
  const convertedCurrencySpan = getElement('converted-currency');

  // Profile screen elements
  const profileUserId = getElement('profile-user-id');
  const profileUsername = getElement('profile-username');
  const profileRegistrationDate = getElement('profile-registration-date');
  const totalInvested = getElement('total-invested');
  const totalWithdrawn = getElement('total-withdrawn');

  // Deposit screen elements
  const LCRAddressInput = getElement('LCR-address-input');
  const copyLCRAddressBtn = getElement('copy-LCR-address-btn');

  // Withdrawal screen elements
  const currentWithdrawalBalance = getElement('current-withdrawal-balance');
  const withdrawalAmountInput = getElement('withdrawal-amount-input');
  const withdrawalFee = getElement('withdrawal-fee');
  const totalReceived = getElement('total-received');

  const user = tg.initDataUnsafe.user;
  if (welcome) welcome.textContent = `👋 Привет, ${user.first_name || 'Пользователь'}!`;
  if (profileUserId) profileUserId.textContent = user.id || 'N/A';
  if (profileUsername) profileUsername.textContent = user.first_name || 'N/A';
  if (profileRegistrationDate) profileRegistrationDate.textContent = '01.01.2025'; // Dummy date

  console.log("🟡 initData:", tg.initData);

  // Fetch user data from your API
  fetch('https://lucrora-bot.onrender.com/api/init', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ initData: tg.initData })
  })
    .then(res => {
      if (!res.ok) {
        return res.json().then(err => {
          console.error("🔴 Server responded with error JSON:", err);
          throw new Error(err.message || `Сервер вернул ошибку: ${res.status}`);
        }).catch(() => {
          console.error("🔴 Server responded with non-JSON error:", res.status, res.statusText);
          throw new Error(`Сервер вернул ошибку: ${res.status} ${res.statusText}`);
        });
      }
      return res.json();
    })
    .then(data => {
      console.log("🟢 Ответ от сервера:", data);
      if (data.ok) {
        // Safely update balances and other data
        if (currentMainBalance) currentMainBalance.textContent = `₤ ${(data.main_balance || 0).toFixed(2)} LCR`;
        if (currentBonusBalance) currentBonusBalance.textContent = `(Bonus: ${(data.bonus_balance || 0).toFixed(2)} ₤s)`;
        if (lucrumBalance) lucrumBalance.textContent = `${(data.lucrum_balance || 0).toFixed(2)} ₤`;
        if (mainBalance) mainBalance.textContent = `Основной баланс: ${data.main_balance}₽`;
        if (bonusBalance) bonusBalance.textContent = `Бонусный баланс: ${data.bonus_balance}₽`;
        if (totalInvested) totalInvested.textContent = `₤ ${(data.total_invested || 0).toFixed(2)}`;
        if (totalWithdrawn) totalWithdrawn.textContent = `₤ ${(data.total_withdrawn || 0).toFixed(2)}`;
        if (currentWithdrawalBalance) currentWithdrawalBalance.textContent = `₤ ${(data.main_balance || 0).toFixed(2)} LCR`;

        if (loadingMessage) loadingMessage.classList.add('hidden');
        if (mainContentWrapper) mainContentWrapper.classList.remove('hidden');
        showScreen('home-screen');

        if (convertButton) {
          convertButton.addEventListener('click', () => {
            const amount = amountInput ? parseFloat(amountInput.value) : 0;
            if (isNaN(amount) || amount <= 0) {
              if (convertedAmountSpan) convertedAmountSpan.textContent = '0.00';
              if (convertedCurrencySpan) convertedCurrencySpan.textContent = '0.00';
              return;
            }
            const lucrumValue = amount;
            const usdValue = amount * 0.5;
            if (convertedAmountSpan) convertedAmountSpan.textContent = lucrumValue.toFixed(2);
            if (convertedCurrencySpan) convertedCurrencySpan.textContent = usdValue.toFixed(2);
          });
        }
      } else {
        showError('Ошибка данных от сервера', data.message || 'Сервер вернул ошибку. Пожалуйста, попробуйте еще раз.');
      }
    })
    .catch(error => {
      console.error("🔴 Ошибка при запросе:", error);
      showError('Ошибка соединения с сервером', `Не удалось подключиться к серверу. ${error.message || 'Пожалуйста, проверьте ваше интернет-соединение или попробуйте позже.'}`);
    });

  // --- Navigation Event Listeners (with checks) ---
  if (navHome) navHome.addEventListener('click', () => showScreen('home-screen'));
  if (navInvest) navInvest.addEventListener('click', () => showScreen('invest-screen'));
  if (navGames) navGames.addEventListener('click', () => {
    const gamesBonusBalance = getElement('games-bonus-balance');
    if (gamesBonusBalance && currentBonusBalance) {
      gamesBonusBalance.textContent = currentBonusBalance.textContent.replace('(Bonus: ', '').replace(')', '');
    }
    showScreen('games-screen');
  });
  if (navReferrals) navReferrals.addEventListener('click', () => {
    const referralEarnings = getElement('referral-earnings');
    const activeReferralsCount = getElement('active-referrals-count');
    if (referralEarnings) referralEarnings.textContent = '₤15.75';
    if (activeReferralsCount) activeReferralsCount.textContent = '12';
    showScreen('referrals-screen');
  });
  if (navHistory) navHistory.addEventListener('click', () => showScreen('history-screen'));
  if (userProfileIcon) userProfileIcon.addEventListener('click', () => showScreen('profile-screen'));

  // --- Home Screen Action Buttons ---
  if (buyPackageBtn) buyPackageBtn.addEventListener('click', () => showScreen('invest-screen'));
  if (depositBtn) depositBtn.addEventListener('click', () => showScreen('deposit-screen'));
  if (withdrawBtn) withdrawBtn.addEventListener('click', () => showScreen('withdrawal-screen'));

  // --- Deposit & Referral Screen Actions ---
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

  const referralLinkInput = getElement('referral-link-input');
  const copyReferralLinkBtn = getElement('copy-referral-link-btn');
  const shareReferralLinkBtn = getElement('share-referral-link-btn');

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
      if (referralLinkInput) {
        if (tg && tg.shareText) {
          tg.shareText(referralLinkInput.value, 'Поделитесь моей реферальной ссылкой!');
        } else {
          console.log("Sharing not supported directly. Copied to clipboard instead.");
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

  // --- Withdrawal Screen Logic ---
  if (withdrawalAmountInput) {
    withdrawalAmountInput.addEventListener('input', () => {
      const amount = parseFloat(withdrawalAmountInput.value);
      const currentBalanceText = currentWithdrawalBalance ? currentWithdrawalBalance.textContent.replace('₤', '').replace(' LCR', '') : '0';
      const currentBalance = parseFloat(currentBalanceText);
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
});

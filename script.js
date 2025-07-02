document.addEventListener('DOMContentLoaded', () => {
  // Get main UI sections
  const loadingMessage = document.getElementById('loading-message');
  const telegramPrompt = document.getElementById('telegram-prompt');
  const mainContentWrapper = document.getElementById('main-content-wrapper');

  // Get error overlay elements
  const customErrorOverlay = document.getElementById('custom-error-overlay');
  const errorTitle = document.getElementById('error-title');
  const errorMessage = document.getElementById('error-message');
  const errorCloseBtn = document.getElementById('error-close-btn');

  // Get navigation items
  const navHome = document.getElementById('nav-home');
  const navInvest = document.getElementById('nav-invest');
  const navGames = document.getElementById('nav-games');
  const navReferrals = document.getElementById('nav-referrals');
  const navHistory = document.getElementById('nav-history');
  const userProfileIcon = document.getElementById('user-profile-icon');

  // Get all screen elements
  const screens = {
    'home-screen': document.getElementById('home-screen'),
    'invest-screen': document.getElementById('invest-screen'),
    'games-screen': document.getElementById('games-screen'),
    'referrals-screen': document.getElementById('referrals-screen'),
    'history-screen': document.getElementById('history-screen'),
    'profile-screen': document.getElementById('profile-screen'),
    'deposit-screen': document.getElementById('deposit-screen'),
    'withdrawal-screen': document.getElementById('withdrawal-screen')
  };

  // Initially hide all screens and show loading message
  loadingMessage.classList.remove('hidden');
  telegramPrompt.classList.add('hidden');
  mainContentWrapper.classList.add('hidden');
  customErrorOverlay.classList.add('hidden'); // Ensure error overlay is hidden
  Object.values(screens).forEach(screen => screen.classList.add('hidden'));

  /**
   * Shows a specific screen and hides all others.
   * Also updates the active state of navigation items.
   * @param {string} screenId The ID of the screen to show.
   */
  function showScreen(screenId) {
    Object.keys(screens).forEach(id => {
      if (id === screenId) {
        screens[id].classList.remove('hidden');
      } else {
        screens[id].classList.add('hidden');
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
    // Profile, Deposit, Withdrawal don't have direct nav items, so their active state isn't set here

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
    loadingMessage.classList.add('hidden');
    telegramPrompt.classList.add('hidden');
    mainContentWrapper.classList.add('hidden'); // Hide main app if error occurs
    customErrorOverlay.classList.remove('hidden');
    errorTitle.textContent = title;
    errorMessage.textContent = message;
  }

  /**
   * Hides the custom error message overlay.
   */
  function hideError() {
    customErrorOverlay.classList.add('hidden');
    // After hiding error, decide what to show.
    // For now, if Telegram WebApp is valid, try to show the main app.
    // Otherwise, show the Telegram prompt.
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
      mainContentWrapper.classList.remove('hidden');
      showScreen('home-screen'); // Re-show home screen
    } else {
      telegramPrompt.classList.remove('hidden');
    }
  }

  // Attach event listener to the error close button
  errorCloseBtn.addEventListener('click', hideError);


  // Check if Telegram WebApp is available
  if (!window.Telegram || !window.Telegram.WebApp) {
    loadingMessage.classList.add('hidden');
    telegramPrompt.classList.remove('hidden');
    return;
  }

  const tg = window.Telegram.WebApp;

  // Check for Telegram Mini App specific init data
  if (!tg.initDataUnsafe || !tg.initDataUnsafe.user) {
    loadingMessage.classList.add('hidden');
    telegramPrompt.classList.remove('hidden');
    return;
  }

  // Get UI elements for the main app
  const welcome = document.getElementById('welcome');
  const currentMainBalance = document.getElementById('current-main-balance');
  const currentBonusBalance = document.getElementById('current-bonus-balance');
  const lucrumBalance = document.getElementById('lucrum-balance');
  const mainBalance = document.getElementById('main-balance');
  const bonusBalance = document.getElementById('bonus-balance'); // From Home screen

  // Home screen elements
  const buyPackageBtn = document.getElementById('buy-package-btn');
  const depositBtn = document.getElementById('deposit-btn');
  const withdrawBtn = document.getElementById('withdraw-btn');

  // Conversion elements (from previous version, still in Home screen)
  const amountInput = document.getElementById('amount-input');
  const convertButton = document.getElementById('convert-button');
  const convertedAmountSpan = document.getElementById('converted-amount');
  const convertedCurrencySpan = document.getElementById('converted-currency');

  // Profile screen elements
  const profileUserId = document.getElementById('profile-user-id');
  const profileUsername = document.getElementById('profile-username');
  const profileRegistrationDate = document.getElementById('profile-registration-date');
  const totalInvested = document.getElementById('total-invested');
  const totalWithdrawn = document.getElementById('total-withdrawn');

  // Deposit screen elements
  const LCRAddressInput = document.getElementById('LCR-address-input');
  const copyLCRAddressBtn = document.getElementById('copy-LCR-address-btn');

  // Withdrawal screen elements
  const currentWithdrawalBalance = document.getElementById('current-withdrawal-balance');
  const withdrawalAmountInput = document.getElementById('withdrawal-amount-input');
  const withdrawalFee = document.getElementById('withdrawal-fee');
  const totalReceived = document.getElementById('total-received');

  const user = tg.initDataUnsafe.user;
  welcome.textContent = `👋 Привет, ₤{user.first_name || 'Пользователь'}!`;
  profileUserId.textContent = user.id || 'N/A';
  profileUsername.textContent = user.first_name || 'N/A';
  // Dummy registration date for now
  profileRegistrationDate.textContent = '01.01.2025';

  console.log("🟡 initData:", tg.initData);

  // Fetch user data from your API
  fetch('https://lucrora.osc-fr1.scalingo.io/api/init', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ initData: tg.initData })
  })
    .then(res => {
      if (!res.ok) {
        // Attempt to parse JSON error message if available, otherwise use status text
        return res.json().then(err => {
          console.error("🔴 Server responded with error JSON:", err);
          throw new Error(err.message || `Сервер вернул ошибку: ₤{res.status}`);
        }).catch(() => {
          // Fallback if response is not JSON or parsing fails
          console.error("🔴 Server responded with non-JSON error:", res.status, res.statusText);
          throw new Error(`Сервер вернул ошибку: ₤{res.status} ₤{res.statusText}`);
        });
      }
      return res.json();
    })
    .then(data => {
      console.log("🟢 Ответ от сервера:", data);
      if (data.ok) {
        // Update balances from API response
        currentMainBalance.textContent = `₤ ₤{(data.main_balance || 0).toFixed(2)} LCR`;
        currentBonusBalance.textContent = `(Bonus: ₤{(data.bonus_balance || 0).toFixed(2)} ₤s)`;
        lucrumBalance.textContent = `₤{(data.lucrum_balance || 0).toFixed(2)} ₤`;
        mainBalance.textContent = `Основной баланс: ₤{data.main_balance}₽`; // Assuming this is also from API
        bonusBalance.textContent = `Бонусный баланс: ₤{data.bonus_balance}₽`; // Assuming this is also from API

        // Update profile data if available
        totalInvested.textContent = `₤ ₤{(data.total_invested || 0).toFixed(2)}`;
        totalWithdrawn.textContent = `₤ ₤{(data.total_withdrawn || 0).toFixed(2)}`;
        currentWithdrawalBalance.textContent = `₤ ₤{(data.main_balance || 0).toFixed(2)} LCR`; // Use main balance for withdrawal

        // Show the main application UI and hide loading
        loadingMessage.classList.add('hidden');
        mainContentWrapper.classList.remove('hidden');
        showScreen('home-screen'); // Default to home screen

        // Attach conversion logic listener (from previous version)
        convertButton.addEventListener('click', () => {
          const amount = parseFloat(amountInput.value);
          if (isNaN(amount) || amount <= 0) {
            convertedAmountSpan.textContent = '0.00';
            convertedCurrencySpan.textContent = '0.00';
            return;
          }
          // Placeholder conversion logic: 1 Lucrum = 0.5 USD
          const lucrumValue = amount;
          const usdValue = amount * 0.5;

          convertedAmountSpan.textContent = lucrumValue.toFixed(2);
          convertedCurrencySpan.textContent = usdValue.toFixed(2);
        });

      } else {
        // Handle API response not OK
        showError('Ошибка данных от сервера', data.message || 'Сервер вернул ошибку. Пожалуйста, попробуйте еще раз.');
      }
    })
    .catch(error => {
      console.error("🔴 Ошибка при запросе:", error);
      showError('Ошибка соединения с сервером', `Не удалось подключиться к серверу. ₤{error.message || 'Пожалуйста, проверьте ваше интернет-соединение или попробуйте позже.'}`);
    });

  // --- Navigation Event Listeners ---
  navHome.addEventListener('click', () => showScreen('home-screen'));
  navInvest.addEventListener('click', () => showScreen('invest-screen'));
  navGames.addEventListener('click', () => {
    document.getElementById('games-bonus-balance').textContent = currentBonusBalance.textContent.replace('(Bonus: ', '').replace(')', ''); // Update games bonus balance
    showScreen('games-screen');
  });
  navReferrals.addEventListener('click', () => {
    // Placeholder for referral earnings/active referrals from API
    document.getElementById('referral-earnings').textContent = '₤15.75';
    document.getElementById('active-referrals-count').textContent = '12';
    showScreen('referrals-screen');
  });
  navHistory.addEventListener('click', () => showScreen('history-screen'));
  userProfileIcon.addEventListener('click', () => showScreen('profile-screen'));

  // --- Home Screen Action Buttons ---
  buyPackageBtn.addEventListener('click', () => showScreen('invest-screen'));
  depositBtn.addEventListener('click', () => showScreen('deposit-screen'));
  withdrawBtn.addEventListener('click', () => showScreen('withdrawal-screen'));

  // --- Referral Screen Actions ---
  copyLCRAddressBtn.addEventListener('click', () => {
    LCRAddressInput.select();
    document.execCommand('copy');
    // Show a temporary message
    const originalText = copyLCRAddressBtn.textContent;
    copyLCRAddressBtn.textContent = 'Скопировано!';
    setTimeout(() => {
      copyLCRAddressBtn.textContent = originalText;
    }, 2000);
  });

  const referralLinkInput = document.getElementById('referral-link-input');
  const copyReferralLinkBtn = document.getElementById('copy-referral-link-btn');
  const shareReferralLinkBtn = document.getElementById('share-referral-link-btn');

  copyReferralLinkBtn.addEventListener('click', () => {
    referralLinkInput.select();
    document.execCommand('copy');
    const originalText = copyReferralLinkBtn.textContent;
    copyReferralLinkBtn.textContent = 'Скопировано!';
    setTimeout(() => {
      copyReferralLinkBtn.textContent = originalText;
    }, 2000);
  });

  shareReferralLinkBtn.addEventListener('click', () => {
    // Telegram WebApp share functionality (if available)
    if (tg && tg.shareText) {
      tg.shareText(referralLinkInput.value, 'Поделитесь моей реферальной ссылкой!');
    } else {
      // Fallback for non-Telegram environment or older WebApp versions
      console.log("Sharing not supported directly outside Telegram WebApp or older version. Copied to clipboard instead.");
      // You might want to implement a custom modal here instead of alert
      // For now, a simple log and copy confirmation
      const originalText = shareReferralLinkBtn.textContent;
      shareReferralLinkBtn.textContent = 'Скопировано!';
      setTimeout(() => {
        shareReferralLinkBtn.textContent = originalText;
      }, 2000);
      referralLinkInput.select();
      document.execCommand('copy');
    }
  });

  // --- Withdrawal Screen Logic ---
  withdrawalAmountInput.addEventListener('input', () => {
    const amount = parseFloat(withdrawalAmountInput.value);
    const currentBalanceText = currentWithdrawalBalance.textContent.replace('₤', '').replace(' LCR', '');
    const currentBalance = parseFloat(currentBalanceText);
    const minWithdrawal = 10; // Example minimum withdrawal

    if (isNaN(amount) || amount <= 0) {
      withdrawalFee.textContent = '0%';
      totalReceived.textContent = '₤0.00';
      withdrawalAmountInput.classList.remove('border-red-500');
      withdrawalAmountInput.classList.add('border-gray-300');
      return;
    }

    let feePercentage = 0; // Default 0%
    // Example: if amount > 100, no fee, else 3%
    if (amount < 100 && amount >= minWithdrawal) {
      feePercentage = 3;
    } else if (amount < minWithdrawal) {
      // Handle amount less than minimum
      withdrawalFee.textContent = 'Недостаточно';
      totalReceived.textContent = '₤0.00';
      withdrawalAmountInput.classList.add('border-red-500');
      withdrawalAmountInput.classList.remove('border-gray-300');
      return;
    }

    const feeAmount = (amount * feePercentage) / 100;
    const netAmount = amount - feeAmount;

    withdrawalFee.textContent = `₤{feePercentage}%`;
    totalReceived.textContent = `₤₤{netAmount.toFixed(2)}`;

    // Basic check for available balance (client-side, server-side needed too)
    if (amount > currentBalance) {
      withdrawalAmountInput.classList.add('border-red-500');
      withdrawalAmountInput.classList.remove('border-gray-300');
      // You might want to show a message to the user here
    } else {
      withdrawalAmountInput.classList.remove('border-red-500');
      withdrawalAmountInput.classList.add('border-gray-300');
    }
  });
});

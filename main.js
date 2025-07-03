document.addEventListener('DOMContentLoaded', () => {
  // Helper function to get an element and log an error if not found
  const getElement = (id) => {
    const element = document.getElementById(id);
    if (!element) {
      console.error(`Error: Element with ID '${id}' not found in DOM.`);
    }
    return element;
  };

  // Get main UI sections
  const loadingMessage = getElement('loading-message');
  const telegramPrompt = getElement('telegram-prompt');
  const registrationScreen = getElement('registration-screen'); // NEW: Get registration screen
  const mainContentWrapper = getElement('main-content-wrapper');
  const screenContainer = getElement('screen-container');

  // Get error overlay elements
  const customErrorOverlay = getElement('custom-error-overlay');
  const errorTitle = getElement('error-title');
  const errorMessage = getElement('error-message');
  const errorCloseBtn = getElement('error-close-btn');

  // Get navigation elements
  const navHome = getElement('nav-home');
  const navInvest = getElement('nav-invest');
  const navGames = getElement('nav-games');
  const navReferrals = getElement('nav-referrals');
  const navHistory = getElement('nav-history');
  const userProfileIcon = getElement('user-profile-icon');

  // Balance elements in the header
  const currentMainBalance = getElement('current-main-balance');
  const currentBonusBalance = getElement('current-bonus-balance');

  // Current active screen script
  let currentScreenScript = null;

  // Initially hide all and show loading message
  if (loadingMessage) loadingMessage.classList.remove('hidden');
  if (telegramPrompt) telegramPrompt.classList.add('hidden');
  if (registrationScreen) registrationScreen.classList.add('hidden'); // NEW: Hide registration initially
  if (mainContentWrapper) mainContentWrapper.classList.add('hidden');
  if (customErrorOverlay) customErrorOverlay.classList.add('hidden');

  /**
   * Loads and displays the content of a specific screen.
   * Also loads the corresponding JavaScript file.
   * @param {string} screenName The name of the screen (e.g., 'home', 'invest').
   */
  async function loadScreen(screenName) {
    if (!screenContainer) {
      console.error('Error: screen-container element not found.');
      return;
    }

    // Remove previous script if it exists
    if (currentScreenScript) {
      document.head.removeChild(currentScreenScript);
      currentScreenScript = null;
    }

    try {
      // Load HTML content of the screen from the corresponding folder
      const htmlResponse = await fetch(`${screenName}/${screenName}-screen.html`);
      if (!htmlResponse.ok) {
        throw new Error(`Failed to load ${screenName}/${screenName}-screen.html: ${htmlResponse.statusText}`);
      }
      const htmlContent = await htmlResponse.text();

      // NEW: Determine where to load the HTML content
      const targetContainer = (screenName === 'registration') ? registrationScreen : screenContainer;
      if (targetContainer) {
        targetContainer.innerHTML = htmlContent;
      } else {
        console.error(`Error: Target container for ${screenName} not found.`);
        return;
      }


      // Load corresponding JavaScript file from the corresponding folder
      const script = document.createElement('script');
      script.src = `${screenName}/${screenName}-script.js`;
      script.onload = () => {
        console.log(`Script ${screenName}/${screenName}-script.js loaded.`);
        // If the script has an initialization function, call it
        if (window[`init${capitalizeFirstLetter(screenName)}Screen`]) {
          window[`init${capitalizeFirstLetter(screenName)}Screen`]();
        }
      };
      script.onerror = () => {
        console.error(`Error loading script for ${screenName}/${screenName}-script.js`);
      };
      document.head.appendChild(script);
      currentScreenScript = script;

      // Update active class for navigation items, if it's not the registration screen
      if (screenName !== 'registration') {
        document.querySelectorAll('.nav-item').forEach(item => {
          item.classList.remove('active', 'text-green-600');
          item.classList.add('text-gray-500'); // Reset color
        });

        let activeNavItem;
        if (screenName === 'home') activeNavItem = navHome;
        else if (screenName === 'invest') activeNavItem = navInvest;
        else if (screenName === 'games') activeNavItem = navGames;
        else if (screenName === 'referrals') activeNavItem = navReferrals;
        else if (screenName === 'history') activeNavItem = navHistory;
        else if (screenName === 'profile') activeNavItem = userProfileIcon; // Profile is not in the bottom navigation but also activates

        if (activeNavItem) {
          activeNavItem.classList.add('active', 'text-green-600');
          activeNavItem.classList.remove('text-gray-500');
        }
      } else {
        // If it's the registration screen, reset active navigation classes
        document.querySelectorAll('.nav-item').forEach(item => {
          item.classList.remove('active', 'text-green-600');
          item.classList.add('text-gray-500');
        });
      }

    } catch (error) {
      console.error(`Error loading screen ${screenName}:`, error);
      showError('Screen Loading Error', `Failed to load screen content "${screenName}". ${error.message}`);
    }
  }

  // Helper function to capitalize the first letter
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  /**
   * Shows the error overlay.
   * @param {string} title Error title.
   * @param {string} message Detailed error message.
   */
  function showError(title, message) {
    if (loadingMessage) loadingMessage.classList.add('hidden');
    if (telegramPrompt) telegramPrompt.classList.add('hidden');
    if (mainContentWrapper) mainContentWrapper.classList.add('hidden');
    if (registrationScreen) registrationScreen.classList.add('hidden'); // NEW: Hide registration screen on error
    if (customErrorOverlay) customErrorOverlay.classList.remove('hidden');

    // Safely set text content
    if (errorTitle) errorTitle.textContent = title;
    if (errorMessage) errorMessage.textContent = message;
  }

  /**
   * Hides the error overlay.
   */
  function hideError() {
    if (customErrorOverlay) customErrorOverlay.classList.add('hidden');

    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
      // After an error, return to the default screen
      if (window.appData && window.appData.isRegistered) {
        if (mainContentWrapper) mainContentWrapper.classList.remove('hidden');
        loadScreen('home');
      } else {
        if (registrationScreen) registrationScreen.classList.remove('hidden'); // NEW: Show registration if not registered
        loadScreen('registration');
      }
    } else {
      if (telegramPrompt) telegramPrompt.classList.remove('hidden');
    }
  }

  // Attach event listener to the error close button
  if (errorCloseBtn) {
    errorCloseBtn.addEventListener('click', hideError);
  }

  // Check Telegram WebApp availability
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

  const user = tg.initDataUnsafe.user;
  console.log("🟡 initData:", tg.initData);

  // Load user data from your API
  fetch('https://lucrora-bot.onrender.com/api/init', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ initData: tg.initData })
  })
    .then(res => {
      if (!res.ok) {
        return res.json().then(err => {
          console.error("🔴 Server responded with JSON error:", err);
          throw new Error(err.message || `Server returned error: ${res.status}`);
        }).catch(() => {
          console.error("🔴 Server responded with non-JSON error:", res.status, res.statusText);
          throw new Error(`Server returned error: ${res.status} ${res.statusText}`);
        });
      }
      return res.json();
    })
    .then(data => {
      console.log("🟢 Response from server:", data);
      if (data.ok) {
        // Safely update balances in the header
        if (currentMainBalance) currentMainBalance.textContent = `₤ ${(data.main_balance || 0).toFixed(2)} LCR`;
        if (currentBonusBalance) currentBonusBalance.textContent = `(Bonus: ${(data.bonus_balance || 0).toFixed(2)} ₤s)`;

        if (loadingMessage) loadingMessage.classList.add('hidden');
        window.loadScreen = loadScreen; // Make loadScreen globally available
        window.appData = { // Make appData globally available
          user: user,
          balances: {
            main: data.main_balance || 0,
            bonus: data.bonus_balance || 0,
            lucrum: data.lucrum_balance || 0,
          },
          totalInvested: data.total_invested || 0,
          totalWithdrawn: data.total_withdrawn || 0,
          isRegistered: data.isRegistered || false // IMPORTANT CHANGE: Add registration flag
        };

        // IMPORTANT CHANGE: Check if the user is registered
        if (window.appData.isRegistered) {
          if (mainContentWrapper) mainContentWrapper.classList.remove('hidden'); // Show main content
          if (registrationScreen) registrationScreen.classList.add('hidden'); // Hide registration screen
          loadScreen('home'); // If registered, go to home screen
        } else {
          if (registrationScreen) registrationScreen.classList.remove('hidden'); // Show registration screen
          if (mainContentWrapper) mainContentWrapper.classList.add('hidden'); // Hide main content
          loadScreen('registration'); // If not registered, go to registration screen
        }

      } else {
        showError('Server Data Error', data.message || 'Server returned an error. Please try again.');
      }
    })
    .catch(error => {
      console.error("🔴 Request Error:", error);
      showError('Server Connection Error', `Failed to connect to the server. ${error.message || 'Please check your internet connection or try again later.'}`);
    });

  // --- Navigation event listeners ---
  if (navHome) navHome.addEventListener('click', () => loadScreen('home'));
  if (navInvest) navInvest.addEventListener('click', () => loadScreen('invest'));
  if (navGames) navGames.addEventListener('click', () => loadScreen('games'));
  if (navReferrals) navReferrals.addEventListener('click', () => loadScreen('referrals'));
  if (navHistory) navHistory.addEventListener('click', () => loadScreen('history'));
  if (userProfileIcon) userProfileIcon.addEventListener('click', () => loadScreen('profile'));

  // NEW: Function to handle successful registration/login (call this from your registration-script.js)
  window.onAuthSuccess = () => {
    if (registrationScreen) registrationScreen.classList.add('hidden'); // Hide registration screen
    if (mainContentWrapper) mainContentWrapper.classList.remove('hidden'); // Show main content
    loadScreen('home'); // Load the home screen
    // You might also want to re-fetch user data here to update balances etc.
    // Or, pass the updated data from the registration process.
  };
});
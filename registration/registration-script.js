// Global function called by main.js after the HTML is loaded
function initRegistrationScreen() {
  console.log('Registration screen initialized.');

  // Utility function to get element and log error if not found
  const getElement = (id) => {
    const element = document.getElementById(id);
    if (!element) {
      console.error(`Error: Element with ID '${id}' not found after registration screen load.`);
    }
    return element;
  };

  // Sections
  const initialAuthChoice = getElement('initial-auth-choice');
  const registrationFormSection = getElement('registration-form-section');
  const loginFormSection = getElement('login-form-section');
  const resendEmailSection = getElement('resend-email-section');

  // Buttons for initial choice
  const btnRegisterNew = getElement('btn-register-new');
  const btnAlreadyHaveAccount = getElement('btn-already-have-account');

  // Registration Form elements
  const btnBackFromRegistration = getElement('btn-back-from-registration');
  const regEmail = getElement('reg-email');
  const regPassword = getElement('reg-password');
  const regReferral = getElement('reg-referral'); // Optional
  const agreeTerms = getElement('agree-terms');
  const emailPromo = getElement('email-promo'); // Optional
  const btnRegisterSubmit = getElement('btn-register-submit');
  const linkResendEmail = getElement('link-resend-email');
  const linkGotoLogin = getElement('link-goto-login');

  // Login Form elements
  const btnBackFromLogin = getElement('btn-back-from-login');
  const loginEmail = getElement('login-email');
  const loginPassword = getElement('login-password');
  const btnLoginSubmit = getElement('btn-login-submit');
  const linkForgotPassword = getElement('link-forgot-password');
  const linkGotoRegister = getElement('link-goto-register');

  // Resend Email elements
  const btnBackFromResend = getElement('btn-back-from-resend');
  const resendEmailInput = getElement('resend-email-input');
  const btnResendSubmit = getElement('btn-resend-submit');

  // Language buttons
  const langButtons = document.querySelectorAll('.language-selector .lang-btn');

  // Function to show a specific section and hide others
  const showSection = (sectionToShow) => {
    // Hide all sections first
    [initialAuthChoice, registrationFormSection, loginFormSection, resendEmailSection].forEach(section => {
      if (section) section.classList.add('hidden');
    });
    // Show the desired section
    if (sectionToShow) sectionToShow.classList.remove('hidden');
  };

  // --- Initial setup (called on screen init) ---
  showSection(initialAuthChoice); // Show the initial choice screen by default

  // --- Event Listeners for Navigation ---

  // Initial choice buttons
  if (btnRegisterNew) {
    btnRegisterNew.addEventListener('click', () => {
      showSection(registrationFormSection);
      // Reset form fields
      if (regEmail) regEmail.value = '';
      if (regPassword) regPassword.value = '';
      if (regReferral) regReferral.value = '';
      if (agreeTerms) agreeTerms.checked = false;
      if (emailPromo) emailPromo.checked = false;
      updateRegisterButtonState();
    });
  }

  if (btnAlreadyHaveAccount) {
    btnAlreadyHaveAccount.addEventListener('click', () => {
      showSection(loginFormSection);
      // Reset form fields
      if (loginEmail) loginEmail.value = '';
      if (loginPassword) loginPassword.value = '';
      updateLoginButtonState();
    });
  }

  // Back buttons
  if (btnBackFromRegistration) {
    btnBackFromRegistration.addEventListener('click', () => showSection(initialAuthChoice));
  }
  if (btnBackFromLogin) {
    btnBackFromLogin.addEventListener('click', () => showSection(initialAuthChoice));
  }
  if (btnBackFromResend) {
    btnBackFromResend.addEventListener('click', () => {
      // Go back to the registration form from resend email screen
      showSection(registrationFormSection);
    });
  }

  // Links within forms
  if (linkResendEmail) {
    linkResendEmail.addEventListener('click', (e) => {
      e.preventDefault();
      showSection(resendEmailSection);
      if (resendEmailInput) resendEmailInput.value = ''; // Clear input
      updateResendButtonState();
    });
  }

  if (linkGotoLogin) {
    linkGotoLogin.addEventListener('click', (e) => {
      e.preventDefault();
      showSection(loginFormSection);
      if (loginEmail) loginEmail.value = '';
      if (loginPassword) loginPassword.value = '';
      updateLoginButtonState();
    });
  }

  if (linkGotoRegister) {
    linkGotoRegister.addEventListener('click', (e) => {
      e.preventDefault();
      showSection(registrationFormSection);
      if (regEmail) regEmail.value = '';
      if (regPassword) regPassword.value = '';
      if (agreeTerms) agreeTerms.checked = false;
      updateRegisterButtonState();
    });
  }

  // --- Form Validation and Button Activation ---

  const validateEmail = (email) => {
    // Simple email validation regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const updateRegisterButtonState = () => {
    if (!btnRegisterSubmit || !regEmail || !regPassword || !agreeTerms) return;
    const isEmailValid = validateEmail(regEmail.value);
    const isPasswordFilled = regPassword.value.length >= 6; // Example: password min length
    const isTermsAgreed = agreeTerms.checked;
    btnRegisterSubmit.disabled = !(isEmailValid && isPasswordFilled && isTermsAgreed);
  };

  const updateLoginButtonState = () => {
    if (!btnLoginSubmit || !loginEmail || !loginPassword) return;
    const isEmailValid = validateEmail(loginEmail.value);
    const isPasswordFilled = loginPassword.value.length >= 6; // Example: password min length
    btnLoginSubmit.disabled = !(isEmailValid && isPasswordFilled);
  };

  const updateResendButtonState = () => {
    if (!btnResendSubmit || !resendEmailInput) return;
    btnResendSubmit.disabled = !validateEmail(resendEmailInput.value);
  };

  // Add input event listeners to fields to update button states
  if (regEmail) regEmail.addEventListener('input', updateRegisterButtonState);
  if (regPassword) regPassword.addEventListener('input', updateRegisterButtonState);
  if (agreeTerms) agreeTerms.addEventListener('change', updateRegisterButtonState);
  if (regReferral) regReferral.addEventListener('input', updateRegisterButtonState); // Add listener for optional field too

  if (loginEmail) loginEmail.addEventListener('input', updateLoginButtonState);
  if (loginPassword) loginPassword.addEventListener('input', updateLoginButtonState);

  if (resendEmailInput) resendEmailInput.addEventListener('input', updateResendButtonState);

  // --- Submission Handlers (Simulated) ---

  if (btnRegisterSubmit) {
    btnRegisterSubmit.addEventListener('click', async () => {
      console.log('Attempting to register user:', regEmail.value);
      try {
        const response = await fetch('https://lucrora-bot.onrender.com/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Telegram-Init-Data': window.Telegram.WebApp.initData // Send initData
          },
          body: JSON.stringify({
            email: regEmail.value,
            password: regPassword.value,
            referral_code: regReferral ? regReferral.value : '', // Get referral code
            telegram_user_id: window.Telegram.WebApp.initDataUnsafe?.user?.id
          })
        });

        const data = await response.json();

        if (response.ok && data.ok) {
          console.log('Registration successful:', data);
          if (window.appData) {
            window.appData.isRegistered = true;
            window.appData.balances.main = data.main_balance || 0;
            window.appData.balances.bonus = data.bonus_balance || 0;
            // Update header balances directly
            if (window.currentMainBalance) window.currentMainBalance.textContent = `₤ ${(window.appData.balances.main).toFixed(2)} LCR`;
            if (window.currentBonusBalance) window.currentBonusBalance.textContent = `(Bonus: ${(window.appData.balances.bonus).toFixed(2)} ₤s)`;
          }
          if (window.onAuthSuccess) {
            window.onAuthSuccess(); // Call global handler from main.js to switch to main app
          }
        } else {
          console.error('Registration failed:', data.message || 'Unknown error');
          if (window.showError) {
            window.showError('Ошибка регистрации', data.message || 'Произошла ошибка при регистрации. Пожалуйста, попробуйте еще раз.');
          }
        }
      } catch (error) {
        console.error('Network or API error during registration:', error);
        if (window.showError) {
          window.showError('Ошибка соединения', 'Не удалось подключиться к серверу для регистрации. Проверьте ваше подключение.');
        }
      }
    });
  }

  if (btnLoginSubmit) {
    btnLoginSubmit.addEventListener('click', async () => {
      console.log('Attempting to log in user:', loginEmail.value);
      try {
        const response = await fetch('https://lucrora-bot.onrender.com/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Telegram-Init-Data': window.Telegram.WebApp.initData
          },
          body: JSON.stringify({
            email: loginEmail.value,
            password: loginPassword.value,
            telegram_user_id: window.Telegram.WebApp.initDataUnsafe?.user?.id
          })
        });

        const data = await response.json();

        if (response.ok && data.ok) {
          console.log('Login successful:', data);
          if (window.appData) {
            window.appData.isRegistered = true;
            window.appData.balances.main = data.main_balance || 0;
            window.appData.balances.bonus = data.bonus_balance || 0;
            // Update header balances directly
            if (window.currentMainBalance) window.currentMainBalance.textContent = `₤ ${(window.appData.balances.main).toFixed(2)} LCR`;
            if (window.currentBonusBalance) window.currentBonusBalance.textContent = `(Bonus: ${(window.appData.balances.bonus).toFixed(2)} ₤s)`;
          }
          if (window.onAuthSuccess) {
            window.onAuthSuccess();
          }
        } else {
          console.error('Login failed:', data.message || 'Unknown error');
          if (window.showError) {
            window.showError('Ошибка входа', data.message || 'Неправильный email или пароль.');
          }
        }
      } catch (error) {
        console.error('Network or API error during login:', error);
        if (window.showError) {
          window.showError('Ошибка соединения', 'Не удалось подключиться к серверу для входа. Проверьте ваше подключение.');
        }
      }
    });
  }

  if (btnResendSubmit) {
    btnResendSubmit.addEventListener('click', async () => {
      console.log('Resending email to:', resendEmailInput.value);
      try {
        const response = await fetch('https://lucrora-bot.onrender.com/api/resend_email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Telegram-Init-Data': window.Telegram.WebApp.initData
          },
          body: JSON.stringify({ email: resendEmailInput.value })
        });
        const data = await response.json();
        if (response.ok && data.ok) {
          alert('Письмо подтверждения отправлено на ваш email!');
          showSection(registrationFormSection); // Go back to registration form
        } else {
          console.error('Resend email failed:', data.message || 'Unknown error');
          if (window.showError) {
            window.showError('Ошибка отправки', data.message || 'Не удалось отправить письмо. Проверьте email или попробуйте позже.');
          }
        }
      } catch (error) {
        console.error('Network or API error during resend email:', error);
        if (window.showError) {
          window.showError('Ошибка соединения', 'Не удалось подключиться к серверу для повторной отправки письма.');
        }
      }
    });
  }

  // --- Language Switcher ---
  if (langButtons.length > 0) { // Check if any language buttons exist
    langButtons.forEach(button => {
      button.addEventListener('click', () => {
        const selectedLang = button.dataset.lang;
        langButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        console.log(`Language set to: ${selectedLang}`);
        // Implement language change logic here
        // For a simple example, you could store it in localStorage:
        // localStorage.setItem('appLang', selectedLang);
        // For a full app, you'd use an i18n library to update texts.
      });
    });
  }

  // Initial state check for buttons
  updateRegisterButtonState();
  updateLoginButtonState();
  updateResendButtonState();
}
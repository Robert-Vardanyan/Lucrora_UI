document.addEventListener('DOMContentLoaded', () => {
  // Utility function to get element and log error if not found
  const getElement = (id) => {
    const element = document.getElementById(id);
    if (!element) {
      console.error(`Error: Element with ID '${id}' not found in DOM for registration script.`);
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
  const agreeTerms = getElement('agree-terms');
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
    [initialAuthChoice, registrationFormSection, loginFormSection, resendEmailSection].forEach(section => {
      if (section) section.classList.add('hidden');
    });
    if (sectionToShow) sectionToShow.classList.remove('hidden');
  };

  // --- Initial setup ---
  showSection(initialAuthChoice); // Show the initial choice screen by default

  // --- Event Listeners for Navigation ---

  // Initial choice buttons
  if (btnRegisterNew) {
    btnRegisterNew.addEventListener('click', () => {
      showSection(registrationFormSection);
      // Reset form fields
      if (regEmail) regEmail.value = '';
      if (regPassword) regPassword.value = '';
      if (agreeTerms) agreeTerms.checked = false;
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
      // Determine which form to go back to (registration or login)
      // For simplicity, let's go back to registration by default or based on context
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

  if (loginEmail) loginEmail.addEventListener('input', updateLoginButtonState);
  if (loginPassword) loginPassword.addEventListener('input', updateLoginButtonState);

  if (resendEmailInput) resendEmailInput.addEventListener('input', updateResendButtonState);

  // --- Submission Handlers (Simulated) ---

  if (btnRegisterSubmit) {
    btnRegisterSubmit.addEventListener('click', async () => {
      // Simulate API call for registration
      console.log('Registering user:', regEmail.value, regPassword.value);
      // In a real app, you'd send data to your backend here
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
            referral_code: getElement('reg-referral').value,
            // You might need to send Telegram user data here as well
            telegram_user_id: window.Telegram.WebApp.initDataUnsafe?.user?.id
          })
        });

        const data = await response.json();

        if (response.ok && data.ok) {
          console.log('Registration successful:', data);
          // Update appData and transition to main app
          if (window.appData) {
            window.appData.isRegistered = true;
            window.appData.balances.main = data.main_balance || 0; // Update balances from response
            window.appData.balances.bonus = data.bonus_balance || 0;
            // Potentially update header elements directly if they are globally accessible or reload them
            if (window.currentMainBalance) window.currentMainBalance.textContent = `₤ ${(window.appData.balances.main).toFixed(2)} LCR`;
            if (window.currentBonusBalance) window.currentBonusBalance.textContent = `(Bonus: ${(window.appData.balances.bonus).toFixed(2)} ₤s)`;
          }
          if (window.onAuthSuccess) {
            window.onAuthSuccess(); // Call global handler from main.js
          }
        } else {
          console.error('Registration failed:', data.message || 'Unknown error');
          // Show custom error overlay
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
      // Simulate API call for login
      console.log('Logging in user:', loginEmail.value, loginPassword.value);
      try {
        const response = await fetch('https://lucrora-bot.onrender.com/api/login', { // Adjust API endpoint
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Telegram-Init-Data': window.Telegram.WebApp.initData // Send initData
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
          // Update appData and transition to main app
          if (window.appData) {
            window.appData.isRegistered = true;
            window.appData.balances.main = data.main_balance || 0; // Update balances from response
            window.appData.balances.bonus = data.bonus_balance || 0;
            if (window.currentMainBalance) window.currentMainBalance.textContent = `₤ ${(window.appData.balances.main).toFixed(2)} LCR`;
            if (window.currentBonusBalance) window.currentBonusBalance.textContent = `(Bonus: ${(window.appData.balances.bonus).toFixed(2)} ₤s)`;
          }
          if (window.onAuthSuccess) {
            window.onAuthSuccess(); // Call global handler from main.js
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
      // Simulate API call for resending email
      try {
        const response = await fetch('https://lucrora-bot.onrender.com/api/resend_email', { // Adjust API endpoint
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
  if (langButtons) {
    langButtons.forEach(button => {
      button.addEventListener('click', () => {
        const selectedLang = button.dataset.lang;
        langButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        console.log(`Language set to: ${selectedLang}`);
        // Here you would implement logic to change the app's language
        // This might involve:
        // 1. Storing the preference (e.g., in localStorage or on your backend)
        // 2. Reloading text content on the page (if not dynamically loaded via i18n library)
        // 3. Potentially reloading the screen with new language content
        // For a full app, consider an i18n library (e.g., i18next)
      });
    });
  }

  // Initial state check for buttons
  updateRegisterButtonState();
  updateLoginButtonState();
  updateResendButtonState();
});

// This function will be called by main.js after this script is loaded
// You can use it to perform any screen-specific initializations
function initRegistrationScreen() {
  console.log('Registration screen initialized.');
  // Any setup specific to when the registration screen is loaded
  // (e.g., showing the initial choice, resetting form states)
  const initialAuthChoice = document.getElementById('initial-auth-choice');
  if (initialAuthChoice) initialAuthChoice.classList.remove('hidden');
  document.getElementById('registration-form-section')?.classList.add('hidden');
  document.getElementById('login-form-section')?.classList.add('hidden');
  document.getElementById('resend-email-section')?.classList.add('hidden');
}
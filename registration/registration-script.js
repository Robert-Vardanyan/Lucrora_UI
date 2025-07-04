// Global function called by main.js after the HTML is loaded
function initRegistrationScreen() {
    console.log('Registration screen initialized.');

    const getElement = (id) => {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`Error: Element with ID '${id}' not found after registration screen load.`);
        }
        return element;
    };

    // НОВЫЕ: Получаем ссылки на каждый "полноэкранный" контейнер
    const initialAuthChoiceScreen = getElement('initial-auth-choice-screen');
    const registrationFormScreen = getElement('registration-form-screen');
    const loginFormScreen = getElement('login-form-screen');
    const resendEmailScreen = getElement('resend-email-screen');

    // Кнопки и поля внутри форм остаются прежними, так как их ID не менялись
    const btnRegisterNew = getElement('btn-register-new');
    const btnAlreadyHaveAccount = getElement('btn-already-have-account');

    // Registration Form elements
    const btnBackFromRegistration = getElement('btn-back-from-registration');
    const regEmail = getElement('reg-email'); // Это поле будет использоваться как "username" на бэкенде
    const regPassword = getElement('reg-password');
    const regReferral = getElement('reg-referral');
    const agreeTerms = getElement('agree-terms');
    const emailPromo = getElement('email-promo');
    const btnRegisterSubmit = getElement('btn-register-submit');
    const linkResendEmail = getElement('link-resend-email');
    const linkGotoLogin = getElement('link-goto-login');
    const registrationMessage = getElement('registration-message'); // Make sure you have this element in your HTML for messages

    // Login Form elements
    const btnBackFromLogin = getElement('btn-back-from-login');
    const loginEmail = getElement('login-email'); // Это поле будет использоваться как "username" на бэкенде
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

    // Функция для показа конкретного "экрана" и скрытия остальных
    const showScreen = (screenToShow) => {
        // Скрываем ВСЕ полноэкранные контейнеры
        [initialAuthChoiceScreen, registrationFormScreen, loginFormScreen, resendEmailScreen].forEach(screen => {
            if (screen) screen.classList.add('hidden');
        });
        // Показываем нужный
        if (screenToShow) screenToShow.classList.remove('hidden');
    };

    // --- Initial setup (called on screen init) ---
    showScreen(initialAuthChoiceScreen); // Показываем экран начального выбора по умолчанию

    // --- Event Listeners for Navigation ---

    // Initial choice buttons
    if (btnRegisterNew) {
        btnRegisterNew.addEventListener('click', () => {
            showScreen(registrationFormScreen);
            // Reset form fields
            if (regEmail) regEmail.value = '';
            if (regPassword) regPassword.value = '';
            if (regReferral) regReferral.value = '';
            if (agreeTerms) agreeTerms.checked = false;
            if (emailPromo) emailPromo.checked = false;
            updateRegisterButtonState();
            if (registrationMessage) registrationMessage.classList.add('hidden'); // Clear messages on screen switch
        });
    }

    if (btnAlreadyHaveAccount) {
        btnAlreadyHaveAccount.addEventListener('click', () => {
            showScreen(loginFormScreen);
            // Reset form fields
            if (loginEmail) loginEmail.value = '';
            if (loginPassword) loginPassword.value = '';
            updateLoginButtonState();
            if (registrationMessage) registrationMessage.classList.add('hidden'); // Clear messages on screen switch
        });
    }

    // Back buttons
    if (btnBackFromRegistration) {
        btnBackFromRegistration.addEventListener('click', () => showScreen(initialAuthChoiceScreen));
    }
    if (btnBackFromLogin) {
        btnBackFromLogin.addEventListener('click', () => showScreen(initialAuthChoiceScreen));
    }
    if (btnBackFromResend) {
        btnBackFromResend.addEventListener('click', () => {
            showScreen(registrationFormScreen); // Вернуться на экран регистрации
        });
    }

    // Links within forms
    if (linkResendEmail) {
        linkResendEmail.addEventListener('click', (e) => {
            e.preventDefault();
            showScreen(resendEmailScreen);
            if (resendEmailInput) resendEmailInput.value = '';
            updateResendButtonState();
        });
    }

    if (linkGotoLogin) {
        linkGotoLogin.addEventListener('click', (e) => {
            e.preventDefault();
            showScreen(loginFormScreen);
            if (loginEmail) loginEmail.value = '';
            if (loginPassword) loginPassword.value = '';
            updateLoginButtonState();
        });
    }

    if (linkGotoRegister) {
        linkGotoRegister.addEventListener('click', (e) => {
            e.preventDefault();
            showScreen(registrationFormScreen);
            if (regEmail) regEmail.value = '';
            if (regPassword) regPassword.value = '';
            if (agreeTerms) agreeTerms.checked = false;
            updateRegisterButtonState();
        });
    }

    // --- Form Validation and Button Activation ---
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const updateRegisterButtonState = () => {
        if (!btnRegisterSubmit || !regEmail || !regPassword || !agreeTerms) return;
        const isEmailValid = validateEmail(regEmail.value);
        const isPasswordFilled = regPassword.value.length >= 6; // Пример: минимум 6 символов
        const isTermsAgreed = agreeTerms.checked;
        btnRegisterSubmit.disabled = !(isEmailValid && isPasswordFilled && isTermsAgreed);
    };

    const updateLoginButtonState = () => {
        if (!btnLoginSubmit || !loginEmail || !loginPassword) return;
        const isEmailValid = validateEmail(loginEmail.value);
        const isPasswordFilled = loginPassword.value.length >= 6; // Пример: минимум 6 символов
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
    if (regReferral) regReferral.addEventListener('input', updateRegisterButtonState); // Добавил для полноты, хотя не влияет на disabled

    if (loginEmail) loginEmail.addEventListener('input', updateLoginButtonState);
    if (loginPassword) loginPassword.addEventListener('input', updateLoginButtonState);

    if (resendEmailInput) resendEmailInput.addEventListener('input', updateResendButtonState);

    // --- Submission Handlers ---

    // Handler for Registration
    if (btnRegisterSubmit) {
        btnRegisterSubmit.addEventListener('click', async () => {
            console.log('Attempting to register user:', regEmail.value);
            try {
                const telegramInitData = window.Telegram.WebApp.initData; // Получаем initData

                const response = await fetch('https://lucrora-bot.onrender.com/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: regEmail.value, // ИЗМЕНЕНО: с 'email' на 'username'
                        password: regPassword.value,
                        referralCode: regReferral ? regReferral.value : '', // ИЗМЕНЕНО: с 'referral_code' на 'referralCode'
                        telegramInitData: telegramInitData // ДОБАВЛЕНО: initData в тело запроса
                    })
                });
                const data = await response.json();
                if (response.ok && data.ok) {
                    console.log('Registration successful:', data);
                    if (window.appData) {
                        window.appData.isRegistered = true;
                        // Обновляем балансы из ответа, если они есть, иначе 0
                        window.appData.balances.main = data.main_balance || 0;
                        window.appData.balances.bonus = data.bonus_balance || 0;
                        window.appData.balances.lucrum = data.lucrum_balance || 0;
                        window.appData.totalInvested = data.total_invested || 0;
                        window.appData.totalWithdrawn = data.total_withdrawn || 0;
                        // Обновляем имя пользователя в appData, если бэкенд его вернул
                        if (data.username) {
                            window.appData.user.first_name = data.username;
                        }
                    }

                    // Обновляем балансы в заголовке, если элементы доступны (они должны быть глобально доступны в main.js)
                    const currentMainBalance = document.getElementById('current-main-balance');
                    const currentBonusBalance = document.getElementById('current-bonus-balance');
                    if (currentMainBalance && window.appData) currentMainBalance.textContent = `₤ ${(window.appData.balances.main).toFixed(2)} LCR`;
                    if (currentBonusBalance && window.appData) currentBonusBalance.textContent = `(Bonus: ${(window.appData.balances.bonus).toFixed(2)} ₤s)`;

                    // Показываем сообщение об успехе
                    if (registrationMessage) {
                        registrationMessage.textContent = 'Регистрация прошла успешно! Вы будете перенаправлены на главный экран.';
                        registrationMessage.classList.remove('hidden', 'text-red-600', 'text-gray-600');
                        registrationMessage.classList.add('text-green-600');
                    }

                    // *** MODIFICATION START ***
                    // Call the global onAuthSuccess function defined in main.js
                    if (window.onAuthSuccess) {
                        setTimeout(() => {
                            window.onAuthSuccess();
                        }, 2000); // Give 2 seconds for message to show
                    } else {
                        console.error("window.onAuthSuccess is not defined. Cannot redirect.");
                        // Fallback if onAuthSuccess isn't there
                        setTimeout(() => {
                            if (window.loadScreen) {
                                window.loadScreen('home');
                            } else {
                                console.error("window.loadScreen не определен. Невозможно перенаправить.");
                            }
                        }, 2000);
                    }
                    // *** MODIFICATION END ***

                } else {
                    // Обработка ошибок регистрации
                    console.error('Registration failed:', data.message || 'Unknown error');
                    if (registrationMessage) {
                        registrationMessage.textContent = `Ошибка: ${data.message || 'Произошла ошибка при регистрации. Пожалуйста, попробуйте еще раз.'}`;
                        registrationMessage.classList.remove('hidden', 'text-green-600', 'text-gray-600');
                        registrationMessage.classList.add('text-red-600');
                    }
                }
            } catch (error) {
                console.error('Network or API error during registration:', error);
                if (registrationMessage) {
                    registrationMessage.textContent = `Ошибка соединения: ${error.message || 'Не удалось подключиться к серверу для регистрации. Проверьте ваше подключение.'}`;
                    registrationMessage.classList.remove('hidden', 'text-green-600', 'text-gray-600');
                    registrationMessage.classList.add('text-red-600');
                }
            }
        });
    }

    // Handler for Login
    if (btnLoginSubmit) {
        btnLoginSubmit.addEventListener('click', async () => {
            console.log('Attempting to log in user:', loginEmail.value);
            try {
                const telegramInitData = window.Telegram.WebApp.initData; // Получаем initData

                const response = await fetch('https://lucrora-bot.onrender.com/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: loginEmail.value, // ИЗМЕНЕНО: с 'email' на 'username'
                        password: loginPassword.value,
                        telegramInitData: telegramInitData // ДОБАВЛЕНО: initData в тело запроса
                    })
                });
                const data = await response.json();
                if (response.ok && data.ok) {
                    console.log('Login successful:', data);
                    if (window.appData) {
                        window.appData.isRegistered = true;
                        window.appData.balances.main = data.main_balance || 0;
                        window.appData.balances.bonus = data.bonus_balance || 0;
                        window.appData.balances.lucrum = data.lucrum_balance || 0;
                        window.appData.totalInvested = data.total_invested || 0;
                        window.appData.totalWithdrawn = data.total_withdrawn || 0;
                        if (data.username) {
                            window.appData.user.first_name = data.username;
                        }
                    }

                    const currentMainBalance = document.getElementById('current-main-balance');
                    const currentBonusBalance = document.getElementById('current-bonus-balance');
                    if (currentMainBalance && window.appData) currentMainBalance.textContent = `₤ ${(window.appData.balances.main).toFixed(2)} LCR`;
                    if (currentBonusBalance && window.appData) currentBonusBalance.textContent = `(Bonus: ${(window.appData.balances.bonus).toFixed(2)} ₤s)`;

                    // *** MODIFICATION START ***
                    // Call the global onAuthSuccess function defined in main.js
                    if (window.onAuthSuccess) {
                        setTimeout(() => {
                            window.onAuthSuccess();
                        }, 2000); // Give 2 seconds for message to show
                    } else {
                        console.error("window.onAuthSuccess is not defined. Cannot redirect.");
                        // Fallback if onAuthSuccess isn't there
                        setTimeout(() => {
                            if (window.loadScreen) {
                                window.loadScreen('home');
                            } else {
                                console.error("window.loadScreen не определен. Невозможно перенаправить.");
                            }
                        }, 2000);
                    }
                    // *** MODIFICATION END ***

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

    // Handler for Resend Email
    if (btnResendSubmit) {
        btnResendSubmit.addEventListener('click', async () => {
            console.log('Resending email to:', resendEmailInput.value);
            try {
                const telegramInitData = window.Telegram.WebApp.initData; // Получаем initData

                const response = await fetch('https://lucrora-bot.onrender.com/api/resend_email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: resendEmailInput.value,
                        telegramInitData: telegramInitData // ДОБАВЛЕНО: initData в тело запроса
                    })
                });
                const data = await response.json();
                if (response.ok && data.ok) {
                    alert('Письмо подтверждения отправлено на ваш email!');
                    showScreen(registrationFormScreen); // Вернуться на экран регистрации
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
    if (langButtons.length > 0) {
        langButtons.forEach(button => {
            button.addEventListener('click', () => {
                const selectedLang = button.dataset.lang;
                langButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                console.log(`Language set to: ${selectedLang}`);
            });
        });
    }

    // Initial state check for buttons
    updateRegisterButtonState();
    updateLoginButtonState();
    updateResendButtonState();
}
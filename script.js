document.addEventListener('DOMContentLoaded', function() {
    // Управление боковой панелью
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
    
    // Закрытие сайдбара при клике вне его
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });

    // Управление языком
    let currentLang = localStorage.getItem('language') || 'ru';
    const languageSelect = document.getElementById('languageSelect');
    languageSelect.value = currentLang;

    // Символы валют
    const currencySymbols = {
        'RUB': '₽',
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'CNY': '¥',
        'JPY': '¥'
    };

    // Контейнер для уведомлений
    const notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    document.body.appendChild(notificationContainer);

    // Управление темой
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle;
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }

    // Переключение языка
    languageSelect.addEventListener('change', function() {
        currentLang = this.value;
        localStorage.setItem('language', currentLang);
        updateLanguage();
    });

    function updateLanguage() {
        const langData = window[currentLang];
        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.dataset.lang.split('.');
            let value = langData;
            for (const k of key) {
                value = value[k];
            }
            if (value) element.textContent = value;
        });
    }

    // Переключение темы
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        if (document.body.classList.contains('dark-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });

    // Обработка курсов валют
    let exchangeRates = {};

    async function fetchExchangeRates() {
        try {
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
            const data = await response.json();
            exchangeRates = data.rates;
        } catch (error) {
            showNotification('Ошибка при получении курсов валют');
        }
    }

    fetchExchangeRates();

    // Выбор валюты
    const currencySelect = document.getElementById('currency');
    currencySelect.addEventListener('change', function() {
        const selectedCurrency = this.value;
        document.querySelectorAll('.currency-symbol').forEach(el => {
            el.textContent = currencySymbols[selectedCurrency];
        });
    });

    // Функционал калькулятора
    const calculateBtn = document.getElementById('calculateBtn');
    calculateBtn.addEventListener('click', async function() {
        const investment = parseFloat(document.getElementById('investment').value);
        const buyPrice = parseFloat(document.getElementById('buyPrice').value);
        const sellPrice = parseFloat(document.getElementById('sellPrice').value);
        const selectedCurrency = document.getElementById('currency').value;

        if (isNaN(investment) || isNaN(buyPrice) || isNaN(sellPrice)) {
            showNotification('Пожалуйста, введите корректные числовые значения');
            return;
        }

        if (investment <= 0 || buyPrice <= 0 || sellPrice <= 0) {
            showNotification('Значения должны быть больше нуля');
            return;
        }

        const units = investment / buyPrice;
        const revenue = units * sellPrice;
        const profit = revenue - investment;
        const roi = (profit / investment) * 100;

        animateResults(profit, roi, units, selectedCurrency);
    });

    function animateResults(profit, roi, units, currency) {
        const results = document.querySelectorAll('.result-item');
        results.forEach(result => {
            result.style.transform = 'scale(1.05)';
            setTimeout(() => result.style.transform = 'scale(1)', 200);
        });

        animateValue('profitResult', `${profit.toFixed(2)} ${currencySymbols[currency]}`);
        animateValue('roiResult', `${roi.toFixed(2)}%`);
        animateValue('unitsResult', units.toFixed(2));
    }

    function animateValue(elementId, newValue) {
        const element = document.getElementById(elementId);
        element.style.opacity = '0';
        setTimeout(() => {
            element.textContent = newValue;
            element.style.opacity = '1';
        }, 150);
    }

    function showNotification(message, type = 'error') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
            <span>${message}</span>
        `;
        notificationContainer.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Обработка числовых полей ввода
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.setAttribute('type', 'text');
        
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^\d.]/g, '');
        });

        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.value = '0';
            }
        });
    });

    // Начальное обновление языка
    updateLanguage();
});

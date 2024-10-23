let isPageRefresh = window.performance.getEntriesByType('navigation')[0].type === 'reload';

document.onreadystatechange = function() {
    const preloader = document.querySelector('.preloader');
    const loginPage = document.querySelector('.login-page');
    
    if (isPageRefresh) {
        preloader.style.display = 'none';
        if (!checkAuth()) {
            loginPage.style.display = 'flex';
        }
        return;
    }

    if (document.readyState !== 'complete') {
        preloader.style.display = 'flex';
        loginPage.style.display = 'none';
    } else {
        setTimeout(() => {
            preloader.classList.add('hidden');
            if (!checkAuth()) {
                loginPage.style.display = 'flex';
            }
        }, 2000);
    }
};


// Rest of your existing code remains the same
const TEST_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

function checkAuth() {
    return localStorage.getItem('isAuthenticated') === 'true';
}

function showLoginPage() {
    const preloader = document.querySelector('.preloader');
    if (!isPageRefresh) {
        preloader.style.display = 'flex';
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.querySelector('.login-page').style.display = 'flex';
        }, 2000);
    } else {
        document.querySelector('.login-page').style.display = 'flex';
    }
}

function hideLoginPage() {
    document.querySelector('.login-page').style.display = 'none';
}

function login(username, password) {
    if (username === TEST_CREDENTIALS.username && password === TEST_CREDENTIALS.password) {
        localStorage.setItem('isAuthenticated', 'true');
        hideLoginPage();
        
        const preloader = document.querySelector('.preloader');
        if (!isPageRefresh) {
            preloader.style.display = 'flex';
            setTimeout(() => {
                preloader.classList.add('hidden');
                document.querySelector('.dashboard').style.display = 'grid';
            }, 2000);
        } else {
            document.querySelector('.dashboard').style.display = 'grid';
        }
        
        const navLinks = document.querySelectorAll('.nav-links li');
        navLinks.forEach(link => link.classList.remove('active'));
        const calculatorLink = document.querySelector('.nav-links li:first-child');
        calculatorLink.classList.add('active');
        
        return true;
    }
    return false;
}

function logout() {
    localStorage.removeItem('isAuthenticated');
    sessionStorage.clear();
    showLoginPage();
    showNotification('loggedOut', 'success');
}

document.addEventListener('DOMContentLoaded', function() {
    if (!checkAuth()) {
        showLoginPage();
    } else {
        hideLoginPage();
    }

    document.getElementById('loginBtn').addEventListener('click', function() {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        if (!username || !password) {
            showNotification('enterCredentials', 'error');
            return;
        }

        if (login(username, password)) {
            showNotification('success', 'success');
        } else {
            showNotification('error', 'error');
        }
    });

    const sidebarNav = document.querySelector('.nav-links');
    const sidebarElement = document.querySelector('.sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const dashboard = document.querySelector('.dashboard');
    const analyticsDashboard = document.querySelector('.analytics-dashboard');
    const educationDashboard = document.querySelector('.education-dashboard');
    const navLinks = document.querySelectorAll('.nav-links li');
    const logoutButton = document.querySelector('.nav-logout');

    logoutButton.addEventListener('click', logout);
    
    sidebarToggle.addEventListener('click', () => {
        sidebarElement.classList.toggle('active');
    });
    
    document.addEventListener('click', (e) => {
        if (!sidebarElement.contains(e.target) && !sidebarToggle.contains(e.target)) {
            sidebarElement.classList.remove('active');
        }
    });

    // Updated language handling
    const languageSelects = document.querySelectorAll('.language-select');
    let currentLang = localStorage.getItem('language') || 'ru';
    
    languageSelects.forEach(select => {
        select.value = currentLang;
        select.addEventListener('change', function() {
            currentLang = this.value;
            localStorage.setItem('language', currentLang);
            languageSelects.forEach(otherSelect => {
                otherSelect.value = currentLang;
            });
            updateLanguage();
        });
    });

    const currencySymbols = {
        'RUB': '₽',
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'CNY': '¥',
        'JPY': '¥'
    };

    const notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    document.body.appendChild(notificationContainer);

    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle;
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            dashboard.style.display = 'none';
            analyticsDashboard.style.display = 'none';
            educationDashboard.style.display = 'none';

            const section = this.querySelector('i').className;
            
            if (section.includes('fa-calculator')) {
                dashboard.style.display = 'grid';
            } else if (section.includes('fa-chart-line')) {
                analyticsDashboard.style.display = 'block';
            } else if (section.includes('fa-book')) {
                educationDashboard.style.display = 'block';
            }

            if (window.innerWidth <= 1024) {
                sidebarElement.classList.remove('active');
            }
        });
    });

    const educationButtons = document.querySelectorAll('.education-btn');
    educationButtons.forEach(button => {
        button.addEventListener('click', function() {
            const courseName = this.closest('.education-item').querySelector('h3').textContent;
            const message = window[currentLang].notifications.courseUnavailable.replace('{courseName}', courseName);
            showNotification(message, 'info');
        });
    });
    

    function updateLanguage() {
        const langData = window[currentLang];
        if (!langData) return;
        
        document.querySelectorAll('[data-lang]').forEach(element => {
            const keys = element.dataset.lang.split('.');
            let value = langData;
            for (const key of keys) {
                if (value) value = value[key];
            }
            if (value) element.textContent = value;
        });

        document.querySelectorAll('[data-lang-placeholder]').forEach(element => {
            const keys = element.dataset.langPlaceholder.split('.');
            let value = langData;
            for (const key of keys) {
                if (value) value = value[key];
            }
            if (value) element.placeholder = value;
        });
    }

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

    let exchangeRates = {};

    async function fetchExchangeRates() {
        try {
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
            const data = await response.json();
            exchangeRates = data.rates;
        } catch (error) {
            showNotification('error', 'error');
        }
    }

    fetchExchangeRates();

    const currencySelect = document.getElementById('currency');
    currencySelect.addEventListener('change', function() {
        const selectedCurrency = this.value;
        document.querySelectorAll('.currency-symbol').forEach(el => {
            el.textContent = currencySymbols[selectedCurrency];
        });
    });

    const calculateBtn = document.getElementById('calculateBtn');
    calculateBtn.addEventListener('click', async function() {
        const investment = parseFloat(document.getElementById('investment').value);
        const buyPrice = parseFloat(document.getElementById('buyPrice').value);
        const sellPrice = parseFloat(document.getElementById('sellPrice').value);
        const selectedCurrency = document.getElementById('currency').value;

        if (isNaN(investment) || isNaN(buyPrice) || isNaN(sellPrice)) {
            showNotification('error', 'error');
            return;
        }

        if (investment <= 0 || buyPrice <= 0 || sellPrice <= 0) {
            showNotification('error', 'error');
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

    function showNotification(messageKey, type = 'error') {
        const langData = window[currentLang];
        const message = langData.login.notifications[messageKey] || messageKey;
        
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

    document.getElementById('loginPassword').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('loginBtn').click();
        }
    });

    updateLanguage();
});

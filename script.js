let isPageRefresh = window.performance.getEntriesByType('navigation')[0].type === 'reload';
let currentLang = localStorage.getItem('language') || 'ru';

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
        }, 5000);
    }
};

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

function showAdminControls() {
    const adminControls = document.querySelector('.admin-controls');
    const username = localStorage.getItem('username');
    if (username === TEST_CREDENTIALS.username) {
        adminControls.style.display = 'block';
        loadAdminPanel();
    } else {
        adminControls.style.display = 'none';
    }
}

function generateCredentials() {
    const randomString = Math.random().toString(36).substring(2, 10);
    return {
        username: `user_${randomString}`,
        password: `pass_${randomString}`
    };
}

function login(username, password) {
    if (username === TEST_CREDENTIALS.username && password === TEST_CREDENTIALS.password) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('username', username);
        hideLoginPage();
        showAdminControls();
        document.querySelector('.dashboard').style.display = 'grid';
        return true;
    }
    
    const users = userManager.getAllUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        if (user.status === 'banned') {
            showNotification('Аккаунт заблокирован', 'error');
            return false;
        }
        
        if (new Date() > new Date(user.expiresAt)) {
            showNotification('Срок действия аккаунта истек', 'error');
            return false;
        }
        
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('username', username);
        hideLoginPage();
        document.querySelector('.dashboard').style.display = 'grid';
        return true;
    }
    
    return false;
}

function logout() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    sessionStorage.clear();
    showLoginPage();
    showNotification('loggedOut', 'success');
}

function showCreateUserModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-container';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="create-user-modal">
            <h3>Создание нового пользователя</h3>
            <div class="input-group">
                <label>Длительность доступа</label>
                <div class="duration-options">
                    <label>
                        <input type="radio" name="duration" value="1hour"> 1 час
                    </label>
                    <label>
                        <input type="radio" name="duration" value="24hours"> 24 часа
                    </label>
                    <label>
                        <input type="radio" name="duration" value="custom"> Своё время
                    </label>
                </div>
                <div class="custom-duration" style="display: none;">
                    <input type="number" placeholder="Годы" min="0" id="years">
                    <input type="number" placeholder="Часы" min="0" max="23" id="hours">
                    <input type="number" placeholder="Минуты" min="0" max="59" id="minutes">
                    <input type="number" placeholder="Секунды" min="0" max="59" id="seconds">
                </div>
            </div>
            <div class="modal-actions">
                <button class="modal-btn cancel">Отмена</button>
                <button class="modal-btn create">Создать</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);

    modal.querySelector('.modal-overlay').addEventListener('click', () => {
        modal.remove();
    });

    const customDuration = modal.querySelector('.custom-duration');
    const durationRadios = modal.querySelectorAll('input[name="duration"]');
    
    durationRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            customDuration.style.display = radio.value === 'custom' ? 'grid' : 'none';
        });
    });

    modal.querySelector('.modal-btn.cancel').addEventListener('click', () => {
        modal.remove();
    });

    modal.querySelector('.modal-btn.create').addEventListener('click', () => {
        const selectedDuration = modal.querySelector('input[name="duration"]:checked');
        
        if (!selectedDuration) {
            showNotification('Выберите длительность доступа', 'error');
            return;
        }
    
        let duration = {
            type: selectedDuration.value
        };
    
        if (duration.type === 'custom') {
            duration.years = parseInt(modal.querySelector('#years').value) || 0;
            duration.hours = parseInt(modal.querySelector('#hours').value) || 0;
            duration.minutes = parseInt(modal.querySelector('#minutes').value) || 0;
            duration.seconds = parseInt(modal.querySelector('#seconds').value) || 0;
    
            if (duration.years + duration.hours + duration.minutes + duration.seconds === 0) {
                showNotification('Укажите время доступа', 'error');
                return;
            }
        }
    
        const credentials = generateCredentials();
        const user = userManager.createUser(credentials.username, credentials.password, duration);
        
        modal.remove();
        
        const message = window[currentLang].admin.notifications.userCreatedDetails
            .replace('{username}', credentials.username)
            .replace('{password}', credentials.password)
            .replace('{expires}', new Date(user.expiresAt).toLocaleString());
        
        showNotification(message, 'success', 10000);
        loadAdminPanel();
        
    });

    function showNotification(messageKey, type = 'error', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Получаем текст уведомления из языкового файла
        let message = messageKey;
        if (window[currentLang]?.admin?.notifications?.[messageKey]) {
            message = window[currentLang].admin.notifications[messageKey];
        } else if (window[currentLang]?.login?.notifications?.[messageKey]) {
            message = window[currentLang].login.notifications[messageKey];
        }
        
        notification.innerHTML = `
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
            <span>${message}</span>
        `;
        
        const container = document.querySelector('.notification-container');
        container.appendChild(notification);
    
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
    
    
}

function showUserInfo(user) {
    const modal = document.createElement('div');
    modal.className = 'modal-container';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="user-info-modal">
            <h3>Информация о пользователе</h3>
            <div class="user-info-content">
                <p><strong>Логин:</strong> ${user.username}</p>
                <p><strong>Статус:</strong> ${user.status}</p>
                <p><strong>Создан:</strong> ${new Date(user.createdAt).toLocaleString()}</p>
                <p><strong>Доступ до:</strong> ${new Date(user.expiresAt).toLocaleString()}</p>
                ${user.banInfo ? `
                    <div class="ban-info">
                        <p><strong>Причина бана:</strong> ${user.banInfo.reason}</p>
                        <p><strong>Забанен:</strong> ${new Date(user.banInfo.bannedAt).toLocaleString()}</p>
                        <p><strong>Бан до:</strong> ${new Date(user.banInfo.expiresAt).toLocaleString()}</p>
                    </div>
                ` : ''}
            </div>
            <div class="modal-actions">
                <button class="modal-btn close">Закрыть</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);

    modal.querySelector('.modal-overlay').addEventListener('click', () => {
        modal.remove();
    });

    modal.querySelector('.modal-btn.close').addEventListener('click', () => {
        modal.remove();
    });
}

function showBanModal(user) {
    const modal = document.createElement('div');
    modal.className = 'modal-container';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="ban-modal">
            <h3>Бан пользователя</h3>
            <div class="input-group">
                <label>Причина бана</label>
                <textarea id="banReason" rows="3"></textarea>
            </div>
            <div class="input-group">
                <label>Длительность бана</label>
                <div class="duration-options">
                    <label>
                        <input type="radio" name="banDuration" value="1hour"> 1 час
                    </label>
                    <label>
                        <input type="radio" name="banDuration" value="24hours"> 24 часа
                    </label>
                    <label>
                        <input type="radio" name="banDuration" value="custom"> Своё время
                    </label>
                </div>
                <div class="custom-duration" style="display: none;">
                    <input type="number" placeholder="Годы" min="0" id="banYears">
                    <input type="number" placeholder="Часы" min="0" max="23" id="banHours">
                    <input type="number" placeholder="Минуты" min="0" max="59" id="banMinutes">
                    <input type="number" placeholder="Секунды" min="0" max="59" id="banSeconds">
                </div>
            </div>
            <div class="modal-actions">
                <button class="modal-btn cancel">Отмена</button>
                <button class="modal-btn ban">Забанить</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);

    modal.querySelector('.modal-overlay').addEventListener('click', () => {
        modal.remove();
    });

    const customDuration = modal.querySelector('.custom-duration');
    const durationRadios = modal.querySelectorAll('input[name="banDuration"]');
    
    durationRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            customDuration.style.display = radio.value === 'custom' ? 'grid' : 'none';
        });
    });

    modal.querySelector('.modal-btn.cancel').addEventListener('click', () => {
        modal.remove();
    });

    modal.querySelector('.modal-btn.ban').addEventListener('click', () => {
        const reason = modal.querySelector('#banReason').value.trim();
        if (!reason) {
            showNotification('Укажите причину бана', 'error');
            return;
        }

        const selectedDuration = modal.querySelector('input[name="banDuration"]:checked');
        if (!selectedDuration) {
            showNotification('Выберите длительность бана', 'error');
            return;
        }

        let duration = {
            type: selectedDuration.value
        };

        if (duration.type === 'custom') {
            duration.years = parseInt(modal.querySelector('#banYears').value) || 0;
            duration.hours = parseInt(modal.querySelector('#banHours').value) || 0;
            duration.minutes = parseInt(modal.querySelector('#banMinutes').value) || 0;
            duration.seconds = parseInt(modal.querySelector('#banSeconds').value) || 0;

            if (duration.years + duration.hours + duration.minutes + duration.seconds === 0) {
                showNotification('Укажите время бана', 'error');
                return;
            }
        }

        userManager.banUser(user.id, reason, duration);
        showNotification('Пользователь забанен', 'success');
        modal.remove();
        loadAdminPanel();
    });
}

function loadAdminPanel() {
    const adminPanel = document.querySelector('.admin-panel');
    if (!adminPanel) return;

    const usersList = adminPanel.querySelector('.users-list');
    usersList.innerHTML = '';

    const users = userManager.getAllUsers();
    users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.innerHTML = `
            <div class="user-info">
                <div class="user-name">${user.username}</div>
                <div class="user-status ${user.status}">${user.status}</div>
                <div class="user-expiry">До: ${new Date(user.expiresAt).toLocaleDateString()}</div>
            </div>
            <div class="user-actions">
                <button class="user-action-btn info" title="Информация">
                    <i class="fas fa-info-circle"></i>
                </button>
                <button class="user-action-btn ban" title="Заблокировать">
                    <i class="fas fa-ban"></i>
                </button>
                <button class="user-action-btn delete" title="Удалить">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        userCard.querySelector('.user-action-btn.info').addEventListener('click', () => showUserInfo(user));
        userCard.querySelector('.user-action-btn.ban').addEventListener('click', () => showBanModal(user));
        userCard.querySelector('.user-action-btn.delete').addEventListener('click', () => {
            if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
                userManager.deleteUser(user.id);
                loadAdminPanel();
                showNotification('Пользователь удален', 'success');
            }
        });

        usersList.appendChild(userCard);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    if (!checkAuth()) {
        showLoginPage();
    } else {
        hideLoginPage();
        showAdminControls();
    }

    const addUserBtn = document.querySelector('.add-user-btn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', showCreateUserModal);
    }

    const viewUsersBtn = document.querySelector('.view-users-btn');
    if (viewUsersBtn) {
        viewUsersBtn.addEventListener('click', () => {
            document.querySelector('.dashboard').style.display = 'none';
            document.querySelector('.analytics-dashboard').style.display = 'none';
            document.querySelector('.education-dashboard').style.display = 'none';
            document.querySelector('.admin-dashboard').style.display = 'block';
            loadAdminPanel();
        });
    }

    const sidebarNav = document.querySelector('.nav-links');
    const sidebarElement = document.querySelector('.sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const dashboard = document.querySelector('.dashboard');
    const analyticsDashboard = document.querySelector('.analytics-dashboard');
    const educationDashboard = document.querySelector('.education-dashboard');
    const adminDashboard = document.querySelector('.admin-dashboard');
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

    const languageSelects = document.querySelectorAll('.language-select');
    
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

    function showNotification(message, type = 'error', duration = 3000) {
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
        }, duration);
    }

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
            if (this.classList.contains('nav-logout')) return;
            
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            dashboard.style.display = 'none';
            analyticsDashboard.style.display = 'none';
            educationDashboard.style.display = 'none';
            adminDashboard.style.display = 'none';

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

    document.getElementById('loginPassword').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('loginBtn').click();
        }
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

    updateLanguage();
});




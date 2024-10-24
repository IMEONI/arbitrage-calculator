class UserManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
    }

    createUser(username, password, duration) {
        const user = {
            id: Date.now(),
            username,
            password,
            createdAt: new Date(),
            expiresAt: this.calculateExpiration(duration),
            status: 'active',
            banInfo: null
        };
        
        this.users.push(user);
        this.saveUsers();
        return user;
    }

    calculateExpiration(duration) {
        const now = new Date();
        switch(duration.type) {
            case '1hour':
                return new Date(now.getTime() + 60 * 60 * 1000);
            case '24hours':
                return new Date(now.getTime() + 24 * 60 * 60 * 1000);
            case 'custom':
                const {years = 0, hours = 0, minutes = 0, seconds = 0} = duration;
                return new Date(now.getTime() + 
                    (years * 365 * 24 * 60 * 60 * 1000) +
                    (hours * 60 * 60 * 1000) +
                    (minutes * 60 * 1000) +
                    (seconds * 1000));
        }
    }

    banUser(userId, reason, duration) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            user.status = 'banned';
            user.banInfo = {
                reason,
                bannedAt: new Date(),
                expiresAt: this.calculateExpiration(duration)
            };
            this.saveUsers();
        }
    }

    deleteUser(userId) {
        this.users = this.users.filter(u => u.id !== userId);
        this.saveUsers();
    }

    getUserInfo(userId) {
        return this.users.find(u => u.id === userId);
    }

    getAllUsers() {
        return this.users;
    }

    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }
}

const userManager = new UserManager();

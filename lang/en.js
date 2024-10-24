const en = {
    appName: "ArbiCalc Pro",
    nav: {
        calculator: "Calculator",
        analytics: "Analytics", 
        education: "Education",
        logout: "Logout",
        addUser: "+ Add User",
        viewUsers: "Users List"
    },
    
    calculator: {
        title: "Arbitrage Calculator",
        currency: "Currency",
        investment: "Investment Amount",
        buyPrice: "Buy Price",
        sellPrice: "Sell Price",
        calculate: "Calculate"
    },
    currency: {
        RUB: "RUB - Russian Ruble",
        USD: "USD - US Dollar",
        EUR: "EUR - Euro",
        GBP: "GBP - British Pound",
        CNY: "CNY - Chinese Yuan",
        JPY: "JPY - Japanese Yen"
    },
    results: {
        title: "Results",
        profit: "Profit",
        profitTooltip: "Your net profit from the trade",
        roiTooltip: "Return on Investment percentage",
        units: "Units",
        unitsTooltip: "Number of units"
    },
    tips: {
        title: "Arbitrage Tips",
        marketAnalysis: "Market Analysis",
        marketAnalysisDesc: "Study trends and follow market news",
        riskManagement: "Risk Management",
        riskManagementDesc: "Use stop-losses to protect capital",
        timing: "Timing",
        timingDesc: "Choose optimal time for trades"
    },
    analytics: {
        title: "Analytics",
        comingSoon: "Analytics coming soon"
    },
    education: {
        title: "Education",
        basics: {
            title: "Arbitrage Basics",
            description: "Learn basic principles and strategies of arbitrage trading"
        },
        market: {
            title: "Market Analysis",
            description: "Study methods of market analysis and opportunity finding"
        },
        advanced: {
            title: "Advanced Strategies",
            description: "Master complex strategies and trading automation"
        },
        startLearning: "Start Learning"
    },
    login: {
        title: "Login",
        username: "Username",
        password: "Password",
        loginBtn: "Login",
        notifications: {
            enterCredentials: "Please enter username and password",
            success: "Successfully logged in",
            error: "Invalid username or password",
            loggedOut: "Successfully logged out"
        }
    },
    admin: {
        userManagement: "User Management",
        createUser: {
            title: "Create New User",
            duration: "Access Duration",
            oneHour: "1 hour",
            twentyFourHours: "24 hours",
            custom: "Custom time",
            years: "Years",
            hours: "Hours",
            minutes: "Minutes",
            seconds: "Seconds",
            create: "Create",
            cancel: "Cancel"
        },
        userInfo: {
            title: "User Information",
            username: "Username",
            status: "Status",
            created: "Created",
            expires: "Expires",
            close: "Close"
        },
        ban: {
            title: "Ban User",
            reason: "Ban Reason",
            duration: "Ban Duration",
            banBtn: "Ban",
            cancel: "Cancel"
        },
        notifications: {
            userCreated: "New user created successfully!",
            userCreatedDetails: `New user created!
Login: {username}
Password: {password}
Access until: {expires}`,
            userBanned: "User banned",
            userDeleted: "User deleted",
            selectDuration: "Select access duration",
            enterTime: "Enter access time",
            enterBanReason: "Enter ban reason",
            selectBanDuration: "Select ban duration",
            enterBanTime: "Enter ban time"
        }
    },
    notifications: {
        courseUnavailable: "Course \"{courseName}\" will be available soon"
    }
};

window.en = en;

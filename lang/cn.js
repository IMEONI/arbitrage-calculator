const cn = {
    appName: "套利计算器专业版",
    nav: {
        calculator: "计算器",
        analytics: "分析",
        education: "教育",
        logout: "退出",
        addUser: "+ 添加用户",
        viewUsers: "用户列表"
    },
    calculator: {
        title: "套利计算器",
        currency: "货币",
        investment: "投资金额",
        buyPrice: "买入价",
        sellPrice: "卖出价",
        calculate: "计算"
    },
    currency: {
        RUB: "RUB - 俄罗斯卢布",
        USD: "USD - 美元",
        EUR: "EUR - 欧元",
        GBP: "GBP - 英镑",
        CNY: "CNY - 人民币",
        JPY: "JPY - 日元"
    },
    results: {
        title: "结果",
        profit: "利润",
        profitTooltip: "交易净利润",
        roiTooltip: "投资回报率百分比",
        units: "数量",
        unitsTooltip: "单位数量"
    },
    tips: {
        title: "套利技巧",
        marketAnalysis: "市场分析",
        marketAnalysisDesc: "研究趋势并关注市场新闻",
        riskManagement: "风险管理",
        riskManagementDesc: "使用止损来保护资金",
        timing: "时机",
        timingDesc: "选择最佳交易时机"
    },
    analytics: {
        title: "分析",
        comingSoon: "分析功能即将推出"
    },
    education: {
        title: "教育",
        basics: {
            title: "套利基础",
            description: "学习套利交易的基本原理和策略"
        },
        market: {
            title: "市场分析",
            description: "学习市场分析方法和机会发现"
        },
        advanced: {
            title: "高级策略",
            description: "掌握复杂策略和交易自动化"
        },
        startLearning: "开始学习"
    },
    login: {
        title: "登录",
        username: "用户名",
        password: "密码",
        loginBtn: "登录",
        notifications: {
            enterCredentials: "请输入用户名和密码",
            success: "登录成功",
            error: "用户名或密码错误",
            loggedOut: "已成功退出"
        }
    },
    admin: {
        userManagement: "用户管理",
        createUser: {
            title: "创建新用户",
            duration: "访问时长",
            oneHour: "1小时",
            twentyFourHours: "24小时",
            custom: "自定义时间",
            years: "年",
            hours: "小时",
            minutes: "分钟",
            seconds: "秒",
            create: "创建",
            cancel: "取消"
        },
        userInfo: {
            title: "用户信息",
            username: "用户名",
            status: "状态",
            created: "创建时间",
            expires: "到期时间",
            close: "关闭"
        },
        ban: {
            title: "封禁用户",
            reason: "封禁原因",
            duration: "封禁时长",
            banBtn: "封禁",
            cancel: "取消"
        },
        notifications: {
            userCreated: "新用户创建成功！",
            userCreatedDetails: `新用户已创建！
登录名: {username}
密码: {password}
访问期限: {expires}`,
            userBanned: "用户已被封禁",
            userDeleted: "用户已删除",
            selectDuration: "请选择访问时长",
            enterTime: "请输入访问时间",
            enterBanReason: "请输入封禁原因",
            selectBanDuration: "请选择封禁时长",
            enterBanTime: "请输入封禁时间"
        }
    },
    notifications: {
        courseUnavailable: "课程 \"{courseName}\" 即将推出"
    }
    
    };

window.cn = cn;

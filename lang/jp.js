const jp = {
    appName: "アービトレージ計算機プロ",
    nav: {
        calculator: "計算機",
        analytics: "分析",
        education: "教育",
        logout: "ログアウト",
        addUser: "+ ユーザーを追加",
        viewUsers: "ユーザー一覧"
    },
    calculator: {
        title: "アービトレージ計算機",
        currency: "通貨",
        investment: "投資額",
        buyPrice: "購入価格",
        sellPrice: "販売価格",
        calculate: "計算"
    },
    currency: {
        RUB: "RUB - ロシアルーブル",
        USD: "USD - 米ドル",
        EUR: "EUR - ユーロ",
        GBP: "GBP - 英ポンド",
        CNY: "CNY - 中国元",
        JPY: "JPY - 日本円"
    },
    results: {
        title: "結果",
        profit: "利益",
        profitTooltip: "取引の純利益",
        roiTooltip: "投資収益率のパーセンテージ",
        units: "数量",
        unitsTooltip: "ユニット数"
    },
    tips: {
        title: "アービトレージのヒント",
        marketAnalysis: "市場分析",
        marketAnalysisDesc: "トレンドを研究し市場ニュースをフォロー",
        riskManagement: "リスク管理",
        riskManagementDesc: "ストップロスで資本を保護",
        timing: "タイミング",
        timingDesc: "最適な取引タイミングを選択"
    },
    analytics: {
        title: "分析",
        comingSoon: "分析機能は近日公開予定"
    },
    education: {
        title: "教育",
        basics: {
            title: "アービトレージの基礎",
            description: "アービトレージ取引の基本原理と戦略を学ぶ"
        },
        market: {
            title: "市場分析",
            description: "市場分析手法と機会発見を学ぶ"
        },
        advanced: {
            title: "高度な戦略",
            description: "複雑な戦略と取引の自動化をマスター"
        },
        startLearning: "学習を開始"
    },
    login: {
        title: "ログイン",
        username: "ユーザー名",
        password: "パスワード",
        loginBtn: "ログイン",
        notifications: {
            enterCredentials: "ユーザー名とパスワードを入力してください",
            success: "ログインに成功しました",
            error: "ユーザー名またはパスワードが無効です",
            loggedOut: "ログアウトしました"
        }
    },
    admin: {
        userManagement: "ユーザー管理",
        createUser: {
            title: "新規ユーザー作成",
            duration: "アクセス期間",
            oneHour: "1時間",
            twentyFourHours: "24時間",
            custom: "カスタム時間",
            years: "年",
            hours: "時間",
            minutes: "分",
            seconds: "秒",
            create: "作成",
            cancel: "キャンセル"
        },
        userInfo: {
            title: "ユーザー情報",
            username: "ユーザー名",
            status: "状態",
            created: "作成日時",
            expires: "有効期限",
            close: "閉じる"
        },
        ban: {
            title: "ユーザーをバン",
            reason: "バンの理由",
            duration: "バン期間",
            banBtn: "バン",
            cancel: "キャンセル"
        },
        notifications: {
            userCreated: "新しいユーザーが作成されました！",
            userCreatedDetails: `新しいユーザーが作成されました！
ログイン: {username}
パスワード: {password}
アクセス期限: {expires}`,
            userBanned: "ユーザーがバンされました",
            userDeleted: "ユーザーが削除されました",
            selectDuration: "アクセス期間を選択してください",
            enterTime: "アクセス時間を入力してください",
            enterBanReason: "バンの理由を入力してください",
            selectBanDuration: "バン期間を選択してください",
            enterBanTime: "バン時間を入力してください"
        }
    },
    notifications: {
        courseUnavailable: "コース「{courseName}」は近日公開予定です"
    }
};

window.jp = jp;

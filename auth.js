// 認證邏輯
const AUTH_CONFIG = {
    password: '5678',
    sessionKey: 'ziwei_auth_session',
    sessionDuration: 24 * 60 * 60 * 1000 // 24小時
};

// 頁面載入時檢查登入狀態
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    
    // 密碼輸入框按Enter鍵登入
    document.getElementById('passwordInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });
});

// 檢查認證狀態
function checkAuthStatus() {
    const session = localStorage.getItem(AUTH_CONFIG.sessionKey);
    
    if (session) {
        try {
            const sessionData = JSON.parse(session);
            const now = new Date().getTime();
            
            // 檢查session是否過期
            if (now - sessionData.timestamp < AUTH_CONFIG.sessionDuration) {
                showMainApp();
                return;
            } else {
                // session過期，清除
                localStorage.removeItem(AUTH_CONFIG.sessionKey);
            }
        } catch (e) {
            localStorage.removeItem(AUTH_CONFIG.sessionKey);
        }
    }
    
    showLogin();
}

// 檢查密碼
function checkPassword() {
    const inputPassword = document.getElementById('passwordInput').value;
    const errorElement = document.getElementById('errorMessage');
    
    if (inputPassword === AUTH_CONFIG.password) {
        // 密碼正確，創建session
        const sessionData = {
            timestamp: new Date().getTime(),
            authenticated: true
        };
        
        localStorage.setItem(AUTH_CONFIG.sessionKey, JSON.stringify(sessionData));
        showMainApp();
        
        // 清空密碼輸入框
        document.getElementById('passwordInput').value = '';
        errorElement.textContent = '';
        
    } else {
        // 密碼錯誤
        errorElement.textContent = '密碼錯誤，請重試';
        document.getElementById('passwordInput').value = '';
        document.getElementById('passwordInput').focus();
        
        // 3秒後清除錯誤訊息
        setTimeout(() => {
            errorElement.textContent = '';
        }, 3000);
    }
}

// 顯示登入頁面
function showLogin() {
    document.getElementById('loginContainer').style.display = 'flex';
    document.getElementById('mainContainer').style.display = 'none';
    document.getElementById('passwordInput').focus();
}

// 顯示主應用
function showMainApp() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('mainContainer').style.display = 'block';
}

// 登出功能
function logout() {
    localStorage.removeItem(AUTH_CONFIG.sessionKey);
    showLogin();
    
    // 清空應用數據
    document.getElementById('inputText').value = '';
    document.getElementById('outputSection').style.display = 'none';
}

// 防止直接訪問主應用
function requireAuth() {
    const session = localStorage.getItem(AUTH_CONFIG.sessionKey);
    
    if (!session) {
        showLogin();
        return false;
    }
    
    try {
        const sessionData = JSON.parse(session);
        const now = new Date().getTime();
        
        if (now - sessionData.timestamp >= AUTH_CONFIG.sessionDuration) {
            logout();
            return false;
        }
        
        return true;
    } catch (e) {
        logout();
        return false;
    }
}

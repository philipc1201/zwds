// auth.js - 認證邏輯
const AUTH_CONFIG = {
    password: '5678',
    sessionKey: 'ziwei_auth_session',
    sessionDuration: 24 * 60 * 60 * 1000 // 24小時
};

// 頁面載入時檢查登入狀態
document.addEventListener('DOMContentLoaded', function() {
    console.log('Auth模組已載入');
    checkAuthStatus();
    
    // 密碼輸入框按Enter鍵登入
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkPassword();
            }
        });
    }
});

// 檢查認證狀態
function checkAuthStatus() {
    console.log('檢查認證狀態...');
    
    const session = localStorage.getItem(AUTH_CONFIG.sessionKey);
    
    if (session) {
        try {
            const sessionData = JSON.parse(session);
            const now = new Date().getTime();
            
            // 檢查session是否過期
            if (now - sessionData.timestamp < AUTH_CONFIG.sessionDuration) {
                console.log('用戶已登入，顯示主應用');
                showMainApp();
                return;
            } else {
                // session過期，清除
                console.log('Session過期，清除認證');
                localStorage.removeItem(AUTH_CONFIG.sessionKey);
            }
        } catch (e) {
            console.log('Session數據錯誤，清除認證');
            localStorage.removeItem(AUTH_CONFIG.sessionKey);
        }
    }
    
    console.log('用戶未登入，顯示登入頁面');
    showLogin();
}

// 檢查密碼
function checkPassword() {
    const passwordInput = document.getElementById('passwordInput');
    const errorElement = document.getElementById('errorMessage');
    
    if (!passwordInput || !errorElement) {
        console.error('找不到密碼輸入框或錯誤信息元素');
        return;
    }
    
    const inputPassword = passwordInput.value;
    
    if (inputPassword === AUTH_CONFIG.password) {
        console.log('密碼正確，創建session');
        
        // 密碼正確，創建session
        const sessionData = {
            timestamp: new Date().getTime(),
            authenticated: true
        };
        
        localStorage.setItem(AUTH_CONFIG.sessionKey, JSON.stringify(sessionData));
        showMainApp();
        
        // 清空密碼輸入框
        passwordInput.value = '';
        errorElement.textContent = '';
        
    } else {
        console.log('密碼錯誤');
        
        // 密碼錯誤
        errorElement.textContent = '密碼錯誤，請重試';
        passwordInput.value = '';
        passwordInput.focus();
        
        // 3秒後清除錯誤訊息
        setTimeout(() => {
            errorElement.textContent = '';
        }, 3000);
    }
}

// 顯示登入頁面
function showLogin() {
    console.log('顯示登入頁面');
    
    const loginContainer = document.getElementById('loginContainer');
    const mainContainer = document.getElementById('mainContainer');
    
    if (loginContainer && mainContainer) {
        loginContainer.style.display = 'flex';
        mainContainer.style.display = 'none';
        
        // 自動聚焦到密碼輸入框
        setTimeout(() => {
            const passwordInput = document.getElementById('passwordInput');
            if (passwordInput) {
                passwordInput.focus();
            }
        }, 100);
    } else {
        console.error('找不到登入容器或主容器元素');
    }
}

// 顯示主應用
function showMainApp() {
    console.log('顯示主應用');
    
    const loginContainer = document.getElementById('loginContainer');
    const mainContainer = document.getElementById('mainContainer');
    
    if (loginContainer && mainContainer) {
        loginContainer.style.display = 'none';
        mainContainer.style.display = 'block';
    } else {
        console.error('找不到登入容器或主容器元素');
    }
}

// 登出功能
function logout() {
    console.log('用戶登出');
    
    localStorage.removeItem(AUTH_CONFIG.sessionKey);
    showLogin();
    
    // 清空應用數據
    const inputText = document.getElementById('inputText');
    const outputSection = document.getElementById('outputSection');
    
    if (inputText) inputText.value = '';
    if (outputSection) outputSection.style.display = 'none';
}

// 防止直接訪問主應用
function requireAuth() {
    const session = localStorage.getItem(AUTH_CONFIG.sessionKey);
    
    if (!session) {
        console.log('需要認證：無session');
        showLogin();
        return false;
    }
    
    try {
        const sessionData = JSON.parse(session);
        const now = new Date().getTime();
        
        if (now - sessionData.timestamp >= AUTH_CONFIG.sessionDuration) {
            console.log('需要認證：session過期');
            logout();
            return false;
        }
        
        return true;
    } catch (e) {
        console.log('需要認證：session數據錯誤');
        logout();
        return false;
    }
}

// 導出函數供其他模組使用
window.AuthModule = {
    checkPassword,
    logout,
    requireAuth,
    showLogin,
    showMainApp
};

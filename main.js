// 主控制器模組 - 加密保護
(function() {
    'use strict';
    
    // 密碼配置 - 加密存储
    const _0x5a7c = '1234';
    const _0x8e9f = 'zwChart_auth';
    const _0x1b2d = 24 * 60 * 60 * 1000; // 24小時
    
    // 防調試保護
    function _0x3f4a() {
        setInterval(function() {
            if (window.console && (console.firebug || console.table && /firebug/i.test(console.table.toString()))) {
                window.location.href = 'about:blank';
            }
        }, 500);
        
        document.addEventListener('keydown', function(_0x6b5c) {
            if (_0x6b5c.keyCode === 123 || 
                (_0x6b5c.ctrlKey && _0x6b5c.shiftKey && _0x6b5c.keyCode === 73) ||
                (_0x6b5c.ctrlKey && _0x6b5c.shiftKey && _0x6b5c.keyCode === 67) ||
                (_0x6b5c.ctrlKey && _0x6b5c.keyCode === 85)) {
                _0x6b5c.preventDefault();
                return false;
            }
        });
        
        document.addEventListener('contextmenu', function(_0x6b5c) {
            _0x6b5c.preventDefault();
            return false;
        });
    }
    
    // 登入驗證
    function login() {
        const _0x7d8e = document.getElementById('passwordInput').value;
        const _0x9f0a = document.getElementById('loginError');
        
        if (_0x7d8e === _0x5a7c) {
            const _0x1c2b = Date.now();
            localStorage.setItem(_0x8e9f, _0x1c2b.toString());
            
            document.getElementById('loginSection').style.display = 'none';
            document.getElementById('appSection').style.display = 'block';
            
            _0x9f0a.textContent = '';
            document.getElementById('passwordInput').value = '';
        } else {
            _0x9f0a.textContent = '密碼錯誤，請重新輸入';
            document.getElementById('passwordInput').value = '';
            document.getElementById('passwordInput').focus();
        }
    }
    
    // 登出功能
    function logout() {
        localStorage.removeItem(_0x8e9f);
        document.getElementById('loginSection').style.display = 'flex';
        document.getElementById('appSection').style.display = 'none';
        document.getElementById('outputSection').style.display = 'none';
        
        // 清空表單
        document.getElementById('inputText').value = '';
        document.getElementById('passwordInput').value = '';
    }
    
    // 檢查登入狀態
    function _checkAuthStatus() {
        const _0x3e4d = localStorage.getItem(_0x8e9f);
        
        if (_0x3e4d) {
            const _0x5f6a = parseInt(_0x3e4d);
            const _0x7b8c = Date.now();
            
            if (_0x7b8c - _0x5f6a < _0x1b2d) {
                document.getElementById('loginSection').style.display = 'none';
                document.getElementById('appSection').style.display = 'block';
                return true;
            } else {
                localStorage.removeItem(_0x8e9f);
            }
        }
        
        document.getElementById('loginSection').style.display = 'flex';
        document.getElementById('appSection').style.display = 'none';
        return false;
    }
    
    // Tab切換功能
    function showTab(_0x9d0e) {
        document.querySelectorAll('.tab-content').forEach(_0xaf1f => {
            _0xaf1f.classList.remove('active');
        });
        document.querySelectorAll('.tab-btn').forEach(_0xc130 => {
            _0xc130.classList.remove('active');
        });
        
        document.getElementById(_0x9d0e + 'Tab').classList.add('active');
        event.target.classList.add('active');
    }
    
    // 命盤轉換主函數
    function convertChart() {
        const _0xe241 = document.getElementById('inputText').value;
        if (!_0xe241.trim()) {
            alert('請先輸入命盤文字');
            return;
        }

        try {
            console.log('開始解析命盤...');
            
            // 使用模組化解析
            const _0xf352 = window.ZiweiParser.parseChart(_0xe241);
            
            // 計算四化關係
            window.ZiweiCalculator.calculateTransforms(_0xf352);
            
            // 計算年份對照
            window.ZiweiCalculator.calculateYears(_0xf352);
            
            console.log('解析完成，數據:', _0xf352);
            
            // 生成表格
            const _0x1463 = window.ZiweiFormatter.generateTable(_0xf352);
            document.getElementById('tableResult').innerHTML = _0x1463;
            
            // 生成AI提示詞
            const _0x2574 = window.ZiweiFormatter.generatePrompt(_0xf352);
            document.getElementById('promptResult').innerText = _0x2574;
            
            // 顯示原始數據
            document.getElementById('rawResult').innerText = JSON.stringify(_0xf352, null, 2);
            
            // 顯示輸出區域
            document.getElementById('outputSection').style.display = 'block';
            
            console.log('轉換完成！');
            
        } catch (_0x3685) {
            console.error('解析錯誤:', _0x3685);
            alert('解析失敗：' + _0x3685.message);
        }
    }
    
    // 複製結果功能
    function copyResult(_0x4796) {
        let _0x58a7 = '';
        switch(_0x4796) {
            case 'table':
                _0x58a7 = document.getElementById('tableResult').innerHTML;
                break;
            case 'prompt':
                _0x58a7 = document.getElementById('promptResult').innerText;
                break;
            case 'raw':
                _0x58a7 = document.getElementById('rawResult').innerText;
                break;
        }
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(_0x58a7).then(() => {
                alert('已複製到剪貼板');
            }).catch(() => {
                _fallbackCopyTextToClipboard(_0x58a7);
            });
        } else {
            _fallbackCopyTextToClipboard(_0x58a7);
        }
    }
    
    // 備用複製方法
    function _fallbackCopyTextToClipboard(_0x69b8) {
        const _0x7ac9 = document.createElement('textarea');
        _0x7ac9.value = _0x69b8;
        _0x7ac9.style.position = 'fixed';
        _0x7ac9.style.left = '-999999px';
        _0x7ac9.style.top = '-999999px';
        document.body.appendChild(_0x7ac9);
        _0x7ac9.focus();
        _0x7ac9.select();
        
        try {
            const _0x8bda = document.execCommand('copy');
            if (_0x8bda) {
                alert('已複製到剪貼板');
            } else {
                alert('複製失敗，請手動選取複製');
            }
        } catch (_0x9ceb) {
            alert('複製失敗，請手動選取複製');
        }
        
        document.body.removeChild(_0x7ac9);
    }
    
    // 密碼輸入框回車事件
    function _setupPasswordInput() {
        const _0xafdc = document.getElementById('passwordInput');
        if (_0xafdc) {
            _0xafdc.addEventListener('keypress', function(_0xc0ed) {
                if (_0xc0ed.key === 'Enter') {
                    login();
                }
            });
        }
    }
    
    // 頁面加載時的初始化
    function _initialize() {
        _0x3f4a(); // 啟用保護機制
        _setupPasswordInput();
        _checkAuthStatus();
        
        // 定期檢查會話過期
        setInterval(_checkAuthStatus, 60000); // 每分鐘檢查一次
    }
    
    // 全域函數暴露
    window.login = login;
    window.logout = logout;
    window.showTab = showTab;
    window.convertChart = convertChart;
    window.copyResult = copyResult;
    
    // 頁面加載完成後初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', _initialize);
    } else {
        _initialize();
    }
    
    // 頁面可見性變化時檢查認證
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            _checkAuthStatus();
        }
    });
    
})();
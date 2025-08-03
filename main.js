// main.js - 主要控制邏輯（含認證檢查）

// Tab切換功能
function showTab(tabName) {
    // 檢查認證
    if (!requireAuth()) {
        return;
    }
    
    // 隱藏所有tab
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 顯示選中的tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
}

// 主要轉換功能
function convertChart() {
    // 檢查認證
    if (!requireAuth()) {
        return;
    }
    
    const inputText = document.getElementById('inputText').value;
    if (!inputText.trim()) {
        alert('請先輸入命盤文字');
        return;
    }

    try {
        console.log('開始解析命盤...');
        
        // 解析命盤
        const chartData = parseChart(inputText);
        
        console.log('解析完成，數據:', chartData);
        
        // 計算四化關係
        calculateTransforms(chartData);
        
        // 計算年份對照
        calculateYears(chartData);
        
        // 生成表格
        const tableHTML = generateTable(chartData);
        document.getElementById('tableResult').innerHTML = tableHTML;
        
        // 生成AI提示詞
        const promptText = generatePrompt(chartData);
        document.getElementById('promptResult').innerText = promptText;
        
        // 顯示原始數據
        document.getElementById('rawResult').innerText = JSON.stringify(chartData, null, 2);
        
        // 顯示輸出區域
        document.getElementById('outputSection').style.display = 'block';
        
        console.log('轉換完成！');
        
    } catch (error) {
        console.error('解析錯誤:', error);
        alert('解析失敗：' + error.message);
    }
}

// 複製結果功能
function copyResult(type) {
    // 檢查認證
    if (!requireAuth()) {
        return;
    }
    
    let content = '';
    switch(type) {
        case 'table':
            content = document.getElementById('tableResult').innerHTML;
            break;
        case 'prompt':
            content = document.getElementById('promptResult').innerText;
            break;
        case 'raw':
            content = document.getElementById('rawResult').innerText;
            break;
    }
    
    // 使用現代的 Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(content).then(() => {
            showCopySuccess();
        }).catch(() => {
            fallbackCopyText(content);
        });
    } else {
        // 降級方案
        fallbackCopyText(content);
    }
}

// 顯示複製成功提示
function showCopySuccess() {
    // 創建提示元素
    const toast = document.createElement('div');
    toast.textContent = '已複製到剪貼板';
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 1000;
        animation: fadeInOut 2s forwards;
    `;
    
    // 添加CSS動畫
    if (!document.getElementById('toastStyles')) {
        const style = document.createElement('style');
        style.id = 'toastStyles';
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(-10px); }
                10%, 90% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // 2秒後移除提示
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 2000);
}

// 降級複製方案
function fallbackCopyText(text) {
    // 創建臨時的 textarea 元素
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.cssText = `
        position: fixed;
        top: -1000px;
        left: -1000px;
        opacity: 0;
    `;
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopySuccess();
        } else {
            alert('複製失敗，請手動選取複製');
        }
    } catch (err) {
        console.error('複製失敗:', err);
        alert('複製失敗，請手動選取複製');
    }
    
    document.body.removeChild(textArea);
}

// 頁面載入完成後的初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('紫微斗數轉換器已載入');
    
    // 添加鍵盤快捷鍵
    document.addEventListener('keydown', function(e) {
        // 檢查認證狀態
        if (!requireAuth()) {
            return;
        }
        
        // Ctrl+Enter 或 Cmd+Enter 快速轉換
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            convertChart();
        }
        
        // Escape 鍵清空輸入
        if (e.key === 'Escape') {
            const inputText = document.getElementById('inputText');
            if (inputText === document.activeElement) {
                inputText.value = '';
            }
        }
    });
    
    // 添加文字框自動調整高度
    const textArea = document.getElementById('inputText');
    if (textArea) {
        textArea.addEventListener('input', function() {
            // 自動調整高度
            this.style.height = 'auto';
            this.style.height = Math.max(300, this.scrollHeight) + 'px';
        });
        
        // 添加拖放功能
        textArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = '#2c5aa0';
            this.style.backgroundColor = '#f8f9fa';
        });
        
        textArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.borderColor = '#ddd';
            this.style.backgroundColor = 'white';
        });
        
        textArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = '#ddd';
            this.style.backgroundColor = 'white';
            
            // 處理拖放的文字文件
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        textArea.value = event.target.result;
                        // 觸發高度調整
                        textArea.dispatchEvent(new Event('input'));
                    };
                    reader.readAsText(file);
                } else {
                    alert('請拖放文字檔案(.txt)');
                }
            }
        });
    }
});

// 錯誤處理
window.addEventListener('error', function(e) {
    console.error('頁面錯誤:', e.error);
    
    // 如果是關鍵錯誤，顯示友好提示
    if (e.error && e.error.message) {
        const errorMsg = e.error.message;
        if (errorMsg.includes('parseChart') || errorMsg.includes('generateTable')) {
            alert('系統發生錯誤，請重新載入頁面或聯絡技術支援');
        }
    }
});

// 防止右鍵菜單（可選的額外保護）
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});

// 防止開發者工具快捷鍵（可選的額外保護）
document.addEventListener('keydown', function(e) {
    // 防止 F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
        return false;
    }
});

// 清理功能（當用戶離開頁面時）
window.addEventListener('beforeunload', function() {
    // 清理敏感數據（如果需要）
    console.log('頁面即將關閉，清理數據...');
});

// 導出函數（如果需要在其他地方使用）
window.ZiweiConverter = {
    convertChart,
    copyResult,
    showTab
};

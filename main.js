// 主程式 - 整合所有功能

function showTab(tabName) {
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

function convertChart() {
    const inputText = document.getElementById('inputText').value;
    if (!inputText.trim()) {
        alert('解析失敗：' + error.message);
    }
}

function copyResult(type) {
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
    
    navigator.clipboard.writeText(content).then(() => {
        alert('已複製到剪貼板');
    }).catch(() => {
        alert('複製失敗，請手動選取複製');
    });
}

// 頁面載入完成後的初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('紫微斗數命盤轉換器已載入');
    
    // 可以在這裡添加一些初始化代碼，例如：
    // - 檢查瀏覽器兼容性
    // - 載入保存的數據
    // - 設置默認值等
});

// 全局錯誤處理
window.addEventListener('error', function(event) {
    console.error('全局錯誤:', event.error);
});('請先輸入命盤文字');
        return;
    }

    try {
        console.log('開始解析命盤...');
        
        // 解析命盤
        const chartData = parseChart(inputText);
        
        console.log('解析完成，數據:', chartData);
        
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
        alert
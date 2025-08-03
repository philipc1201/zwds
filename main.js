// 主要控制邏輯
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
}

function convertChart() {
    const inputText = document.getElementById('inputText').value;
    if (!inputText.trim()) {
        alert('請先輸入命盤文字');
        return;
    }

    try {
        console.log('開始解析命盤...');
        
        const chartData = parseChart(inputText);
        calculateTransforms(chartData);
        calculateYears(chartData);
        
        const tableHTML = generateTable(chartData);
        document.getElementById('tableResult').innerHTML = tableHTML;
        
        const promptText = generatePrompt(chartData);
        document.getElementById('promptResult').innerText = promptText;
        
        document.getElementById('rawResult').innerText = JSON.stringify(chartData, null, 2);
        document.getElementById('outputSection').style.display = 'block';
        
        console.log('轉換完成！');
        
    } catch (error) {
        console.error('解析錯誤:', error);
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

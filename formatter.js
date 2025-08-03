// 表格格式化
function generateTable(data) {
    // 表格生成邏輯 (請根據原始代碼完善)
    return '<div>表格內容</div>';
}

function formatStars(stars) {
    // 星曜格式化
    if (!stars || stars.length === 0) return '無';
    return stars.map(star => {
        let starText = `<span style="color: #d2691e; font-weight: bold;">${star.name}</span>`;
        if (star.temple) {
            starText += `<span style="color: #8b4513; font-size: 0.85em;">[${star.temple}]</span>`;
        }
        return starText;
    }).join('<br>');
}

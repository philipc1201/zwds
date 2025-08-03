// AI提示詞生成
function generatePrompt(data) {
    // 提示詞生成邏輯 (完整版請參考原始代碼)
    const birthYearStem = getBirthYearStem(data.basicInfo.lunarTime);
    
    let prompt = `你現在是資深的紫微斗數專家，請詳細分析以下命盤：

【基本資料】
性別：${data.basicInfo.gender || '未知'}
出生時間：${data.basicInfo.birthTime || '未知'}
...`;

    return prompt;
}

function getBirthYearStem(lunarTime) {
    if (!lunarTime) return null;
    const yearMatch = lunarTime.match(/([甲乙丙丁戊己庚辛壬癸])[子丑寅卯辰巳午未申酉戌亥]年/);
    return yearMatch ? yearMatch[1] : null;
}

// 生成HTML表格
function generateTable(data) {
    let html = `
        <div style="margin-bottom: 20px; padding: 15px; background: #e8f4fd; border-radius: 8px;">
            <h3>基本資料</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 10px;">
                <div><strong>性別：</strong>${data.basicInfo.gender || '未知'}</div>
                <div><strong>出生時間：</strong>${data.basicInfo.birthTime || '未知'}</div>
                <div><strong>農曆：</strong>${data.basicInfo.lunarTime || '未知'}</div>
                <div><strong>五行局：</strong>${data.basicInfo.wuxing || '未知'}</div>
                <div><strong>命主：</strong>${data.basicInfo.lifeMaster || '未知'}</div>
                <div><strong>身主：</strong>${data.basicInfo.bodyMaster || '未知'}</div>
                <div><strong>身宮：</strong>${data.basicInfo.bodyPalace || '未知'}宮</div>
                <div><strong>子年斗君：</strong>${data.basicInfo.childYearJun || '未知'}</div>
            </div>
        </div>

        <div style="margin-bottom: 15px; padding: 10px; background: #fff3cd; border-radius: 5px;">
            <strong>調試信息：</strong>找到宮位數量: ${Object.keys(data.palaces).length}<br>
            宮位列表: ${Object.keys(data.palaces).join('、')}
        </div>

        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">宮位</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">地支</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">主星</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">輔星</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">小星</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">生年四化</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">自化/飛化</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">大限年齡</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">流年年份</th>
                </tr>
            </thead>
            <tbody>
    `;

    // 按固定順序排列宮位
    const foundPalaces = Object.keys(data.palaces);
    const allPalaces = [...new Set([...palaceOrder, ...foundPalaces])];
    
    allPalaces.forEach(palaceName => {
        const palace = data.palaces[palaceName];
        if (!palace) {
            html += `
                <tr style="background-color: #ffebee;">
                    <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold; color: #d32f2f;">${palaceName}</td>
                    <td colspan="8" style="border: 1px solid #ddd; padding: 8px; color: #666;">未找到此宮位資料</td>
                </tr>
            `;
            return;
        }

        html += `
            <tr style="background-color: #fafafa;">
                <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold; color: #2c5aa0;">${palaceName}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${palace.earthBranch}</td>
                <td style="border: 1px solid #ddd; padding: 8px; vertical-align: top;">
                    ${formatStars(palace.mainStars)}
                </td>
                <td style="border: 1px solid #ddd; padding: 8px; vertical-align: top;">
                    ${formatStars(palace.supportStars)}
                </td>
                <td style="border: 1px solid #ddd; padding: 8px; vertical-align: top;">
                    ${formatMinorStars(palace.minorStars)}
                </td>
                <td style="border: 1px solid #ddd; padding: 8px; vertical-align: top;">
                    ${formatBirthYearTransforms(palace)}
                </td>
                <td style="border: 1px solid #ddd; padding: 8px; vertical-align: top;">
                    ${formatSelfAndFlyTransforms(palace)}
                </td>
                <td style="border: 1px solid #ddd; padding: 8px; vertical-align: top; color: #4169e1;">
                    ${formatMajorLimit(palace)}
                </td>
                <td style="border: 1px solid #ddd; padding: 8px; vertical-align: top; color: #4169e1;">
                    ${formatFluentYears(palace)}
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    return html;
}

function formatStars(stars) {
    if (!stars || stars.length === 0) return '無';
    
    return stars.map(star => {
        let starText = `<span style="color: #d2691e; font-weight: bold;">${star.name}</span>`;
        if (star.temple) {
            starText += `<span style="color: #8b4513; font-size: 0.85em;">[${star.temple}]</span>`;
        }
        return starText;
    }).join('<br>');
}

function formatMinorStars(stars) {
    if (!stars || stars.length === 0) return '無';
    
    return stars.map(star => {
        let starText = `<span style="color: #666;">${star.name}</span>`;
        if (star.temple) {
            starText += `<span style="color: #8b4513; font-size: 0.85em;">[${star.temple}]</span>`;
        }
        return starText;
    }).join(', ');
}

function formatBirthYearTransforms(palace) {
    const transforms = [];
    
    [...palace.mainStars, ...palace.supportStars].forEach(star => {
        if (star.birthYearTransform) {
            transforms.push(`<span style="background: #ffe4b5; padding: 2px 4px; border-radius: 3px; font-size: 0.9em;">${star.name}-生年${star.birthYearTransform}</span>`);
        }
    });
    
    return transforms.length > 0 ? transforms.join('<br>') : '無';
}

function formatSelfAndFlyTransforms(palace) {
    const transforms = [];
    
    // 自化
    palace.selfTransforms.forEach(transform => {
        transforms.push(`<span style="background: #ffcccb; padding: 2px 4px; border-radius: 3px; font-size: 0.9em;">${transform.description}</span>`);
    });
    
    // 飛化
    palace.flyInTransforms.forEach(transform => {
        transforms.push(`<span style="background: #e0ffe0; padding: 2px 4px; border-radius: 3px; font-size: 0.9em;">${transform.description}</span>`);
    });
    
    return transforms.length > 0 ? transforms.join('<br>') : '無';
}

function formatMajorLimit(palace) {
    if (palace.majorLimit.startAge && palace.majorLimit.endAge) {
        let result = `${palace.majorLimit.startAge}~${palace.majorLimit.endAge}虛歲`;
        if (palace.majorLimit.startYear && palace.majorLimit.endYear) {
            result += `<br>(${palace.majorLimit.startYear}-${palace.majorLimit.endYear})`;
        }
        
        // 加入大限十二宮資訊
        if (palace.majorLimit.majorTwelvePalaces && Object.keys(palace.majorLimit.majorTwelvePalaces).length > 0) {
            result += `<br><small style="color: #666; font-weight: bold;">★大限命宮★</small>`;
            
            // 顯示重要的大限宮位
            const importantPalaces = [
                { name: '財帛宮', desc: '大限財帛' },
                { name: '官祿宮', desc: '大限事業' },
                { name: '夫妻宮', desc: '大限感情' }
            ];
            
            importantPalaces.forEach(palaceInfo => {
                const majorPalace = palace.majorLimit.majorTwelvePalaces[palaceInfo.name];
                if (majorPalace && majorPalace.originalPalaceName) {
                    result += `<br><small style="color: #4169e1;">${palaceInfo.desc}: ${majorPalace.originalPalaceName}(${majorPalace.earthBranch})</small>`;
                }
            });
            
            // 加入大限四化
            if (palace.majorLimit.transforms && palace.majorLimit.transforms.length > 0) {
                const majorLimitStem = palace.earthBranch[0];
                result += `<br><small style="color: #e65100; font-weight: bold;">${majorLimitStem}干四化:</small>`;
                palace.majorLimit.transforms.forEach(transform => {
                    result += `<br><small style="color: #e65100;">${transform.star}化${transform.type}→${transform.targetPalace}</small>`;
                });
            }
        }
        
        return result;
    }
    return '無';
}

function formatFluentYears(palace) {
    if (!palace.fluentYear || palace.fluentYear.length === 0) return '無';
    
    let result = palace.fluentYear.join(',') + '歲';
    if (palace.fluentYearYears && palace.fluentYearYears.length > 0) {
        result += `<br>(${palace.fluentYearYears.join(',')})`;
    }
    return result;
}

// 格式化星曜供提示詞使用
function formatStarForPrompt(star) {
    let result = star.name;
    if (star.temple) {
        result += `[${star.temple}]`;
    }
    if (star.birthYearTransform) {
        result += `[生年${star.birthYearTransform}]`;
    }
    if (star.selfTransform) {
        result += `[自化${star.selfTransform}]`;
    }
    if (star.flyInTransform) {
        result += `[被化${star.flyInTransform}]`;
    }
    return result;
}
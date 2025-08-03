// 格式化輸出模組
window.ZiweiFormatter = (function() {
    'use strict';
    
    // 生成HTML表格
    function generateTable(_0x1a2b) {
        let _0x3c4d = `
            <div style="margin-bottom: 20px; padding: 15px; background: #e8f4fd; border-radius: 8px;">
                <h3>基本資料</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 10px;">
                    <div><strong>性別：</strong>${_0x1a2b.basicInfo.gender || '未知'}</div>
                    <div><strong>出生時間：</strong>${_0x1a2b.basicInfo.birthTime || '未知'}</div>
                    <div><strong>農曆：</strong>${_0x1a2b.basicInfo.lunarTime || '未知'}</div>
                    <div><strong>五行局：</strong>${_0x1a2b.basicInfo.wuxing || '未知'}</div>
                    <div><strong>命主：</strong>${_0x1a2b.basicInfo.lifeMaster || '未知'}</div>
                    <div><strong>身主：</strong>${_0x1a2b.basicInfo.bodyMaster || '未知'}</div>
                    <div><strong>身宮：</strong>${_0x1a2b.basicInfo.bodyPalace || '未知'}宮</div>
                    <div><strong>子年斗君：</strong>${_0x1a2b.basicInfo.childYearJun || '未知'}</div>
                </div>
            </div>

            <div style="margin-bottom: 15px; padding: 10px; background: #fff3cd; border-radius: 5px;">
                <strong>調試信息：</strong>找到宮位數量: ${Object.keys(_0x1a2b.palaces).length}<br>
                宮位列表: ${Object.keys(_0x1a2b.palaces).join('、')}
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

        const _0x5e6f = ['命宮', '父母宮', '福德宮', '田宅宮', '官祿宮', '交友宮', '遷移宮', '疾厄宮', '財帛宮', '子女宮', '夫妻宮', '兄弟宮'];
        const _0x7a8b = Object.keys(_0x1a2b.palaces);
        const _0x9c0d = [...new Set([..._0x5e6f, ..._0x7a8b])];
        
        _0x9c0d.forEach(_0x1e2f => {
            const _0x3a4b = _0x1a2b.palaces[_0x1e2f];
            if (!_0x3a4b) {
                _0x3c4d += `
                    <tr style="background-color: #ffebee;">
                        <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold; color: #d32f2f;">${_0x1e2f}</td>
                        <td colspan="8" style="border: 1px solid #ddd; padding: 8px; color: #666;">未找到此宮位資料</td>
                    </tr>
                `;
                return;
            }

            _0x3c4d += `
                <tr style="background-color: #fafafa;">
                    <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold; color: #2c5aa0;">${_0x1e2f}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${_0x3a4b.earthBranch}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; vertical-align: top;">
                        ${_formatStars(_0x3a4b.mainStars)}
                    </td>
                    <td style="border: 1px solid #ddd; padding: 8px; vertical-align: top;">
                        ${_formatStars(_0x3a4b.supportStars)}
                    </td>
                    <td style="border: 1px solid #ddd; padding: 8px; vertical-align: top;">
                        ${_formatMinorStars(_0x3a4b.minorStars)}
                    </td>
                    <td style="border: 1px solid #ddd; padding: 8px; vertical-align: top;">
                        ${_formatBirthYearTransforms(_0x3a4b)}
                    </td>
                    <td style="border: 1px solid #ddd; padding: 8px; vertical-align: top;">
                        ${_formatSelfAndFlyTransforms(_0x3a4b)}
                    </td>
                    <td style="border: 1px solid #ddd; padding: 8px; vertical-align: top; color: #4169e1;">
                        ${_formatMajorLimit(_0x3a4b)}
                    </td>
                    <td style="border: 1px solid #ddd; padding: 8px; vertical-align: top; color: #4169e1;">
                        ${_formatFluentYears(_0x3a4b)}
                    </td>
                </tr>
            `;
        });

        _0x3c4d += `
                </tbody>
            </table>
        `;

        return _0x3c4d;
    }
    
    // 格式化星曜顯示
    function _formatStars(_0x5c6d) {
        if (!_0x5c6d || _0x5c6d.length === 0) return '無';
        
        return _0x5c6d.map(_0x7e8f => {
            let _0x9a0b = `<span style="color: #d2691e; font-weight: bold;">${_0x7e8f.name}</span>`;
            if (_0x7e8f.temple) {
                _0x9a0b += `<span style="color: #8b4513; font-size: 0.85em;">[${_0x7e8f.temple}]</span>`;
            }
            return _0x9a0b;
        }).join('<br>');
    }
    
    // 格式化小星顯示
    function _formatMinorStars(_0x1b2c) {
        if (!_0x1b2c || _0x1b2c.length === 0) return '無';
        
        return _0x1b2c.map(_0x3d4e => {
            let _0x5f60 = `<span style="color: #666;">${_0x3d4e.name}</span>`;
            if (_0x3d4e.temple) {
                _0x5f60 += `<span style="color: #8b4513; font-size: 0.85em;">[${_0x3d4e.temple}]</span>`;
            }
            return _0x5f60;
        }).join(', ');
    }
    
    // 格式化生年四化
    function _formatBirthYearTransforms(_0x7182) {
        const _0x9384 = [];
        
        [..._0x7182.mainStars, ..._0x7182.supportStars].forEach(_0xa5b6 => {
            if (_0xa5b6.birthYearTransform) {
                _0x9384.push(`<span style="background: #ffe4b5; padding: 2px 4px; border-radius: 3px; font-size: 0.9em;">${_0xa5b6.name}-生年${_0xa5b6.birthYearTransform}</span>`);
            }
        });
        
        return _0x9384.length > 0 ? _0x9384.join('<br>') : '無';
    }
    
    // 格式化自化和飛化
    function _formatSelfAndFlyTransforms(_0xc7d8) {
        const _0xe9fa = [];
        
        _0xc7d8.selfTransforms.forEach(_0x1b0c => {
            _0xe9fa.push(`<span style="background: #ffcccb; padding: 2px 4px; border-radius: 3px; font-size: 0.9em;">${_0x1b0c.description}</span>`);
        });
        
        _0xc7d8.flyInTransforms.forEach(_0x3d2e => {
            _0xe9fa.push(`<span style="background: #e0ffe0; padding: 2px 4px; border-radius: 3px; font-size: 0.9em;">${_0x3d2e.description}</span>`);
        });
        
        return _0xe9fa.length > 0 ? _0xe9fa.join('<br>') : '無';
    }
    
    // 格式化大限
    function _formatMajorLimit(_0x5f40) {
        if (_0x5f40.majorLimit.startAge && _0x5f40.majorLimit.endAge) {
            let _0x7162 = `${_0x5f40.majorLimit.startAge}~${_0x5f40.majorLimit.endAge}虛歲`;
            if (_0x5f40.majorLimit.startYear && _0x5f40.majorLimit.endYear) {
                _0x7162 += `<br>(${_0x5f40.majorLimit.startYear}-${_0x5f40.majorLimit.endYear})`;
            }
            
            if (_0x5f40.majorLimit.majorTwelvePalaces && Object.keys(_0x5f40.majorLimit.majorTwelvePalaces).length > 0) {
                _0x7162 += `<br><small style="color: #666; font-weight: bold;">★大限命宮★</small>`;
                
                const _0x9384 = [
                    { name: '財帛宮', desc: '大限財帛' },
                    { name: '官祿宮', desc: '大限事業' },
                    { name: '夫妻宮', desc: '大限感情' }
                ];
                
                _0x9384.forEach(_0xa5b6 => {
                    const _0xc7d8 = _0x5f40.majorLimit.majorTwelvePalaces[_0xa5b6.name];
                    if (_0xc7d8 && _0xc7d8.originalPalaceName) {
                        _0x7162 += `<br><small style="color: #4169e1;">${_0xa5b6.desc}: ${_0xc7d8.originalPalaceName}(${_0xc7d8.earthBranch})</small>`;
                    }
                });
                
                if (_0x5f40.majorLimit.transforms && _0x5f40.majorLimit.transforms.length > 0) {
                    const _0xe9fa = _0x5f40.earthBranch[0];
                    _0x7162 += `<br><small style="color: #e65100; font-weight: bold;">${_0xe9fa}干四化:</small>`;
                    _0x5f40.majorLimit.transforms.forEach(_0x1b0c => {
                        _0x7162 += `<br><small style="color: #e65100;">${_0x1b0c.star}化${_0x1b0c.type}→${_0x1b0c.targetPalace}</small>`;
                    });
                }
            }
            
            return _0x7162;
        }
        return '無';
    }
    
    // 格式化流年
    function _formatFluentYears(_0x3d2e) {
        if (!_0x3d2e.fluentYear || _0x3d2e.fluentYear.length === 0) return '無';
        
        let _0x5f40 = _0x3d2e.fluentYear.join(',') + '歲';
        if (_0x3d2e.fluentYearYears && _0x3d2e.fluentYearYears.length > 0) {
            _0x5f40 += `<br>(${_0x3d2e.fluentYearYears.join(',')})`;
        }
        return _0x5f40;
    }
    
    // 生成AI分析提示詞
    function generatePrompt(_0x7162) {
        const _0x9384 = window.ZiweiCalculator.getBirthYearStem(_0x7162.basicInfo.lunarTime);
        
        let _0xa5b6 = `你現在是資深的紫微斗數專家，請詳細分析以下命盤：

【基本資料】
性別：${_0x7162.basicInfo.gender || '未知'}
出生時間：${_0x7162.basicInfo.birthTime || '未知'}
農曆時間：${_0x7162.basicInfo.lunarTime || '未知'}
五行局：${_0x7162.basicInfo.wuxing || '未知'}
命主：${_0x7162.basicInfo.lifeMaster || '未知'}
身主：${_0x7162.basicInfo.bodyMaster || '未知'}
身宮：${_0x7162.basicInfo.bodyPalace || '未知'}宮
子年斗君：${_0x7162.basicInfo.childYearJun || '未知'}

【生年四化】`;

        if (_0x9384 && window.ZiweiCalculator.getTransformTable()[_0x9384]) {
            const _0xc7d8 = window.ZiweiCalculator.getTransformTable()[_0x9384];
            _0xa5b6 += `\n${_0x9384}年生人四化：${_0xc7d8.祿}化祿、${_0xc7d8.權}化權、${_0xc7d8.科}化科、${_0xc7d8.忌}化忌\n`;
            
            for (let [_0xe9fa, _0x1b0c] of Object.entries(_0xc7d8)) {
                for (let [_0x3d2e, _0x5f40] of Object.entries(_0x7162.palaces)) {
                    const _0x7162 = [..._0x5f40.mainStars, ..._0x5f40.supportStars].find(_0x9384 => 
                        _0x9384.name === _0x1b0c && _0x9384.birthYearTransform === _0xe9fa
                    );
                    if (_0x7162) {
                        _0xa5b6 += _0xa5b6_limit + '\n';
                
                if (_0xe9fa.majorLimit.majorTwelvePalaces) {
                    _0xa5b6 += `此大限以${_0xc7d8}為大限命宮，大限十二宮分布：\n`;
                    const _0xc7d8_major = _0xe9fa.majorLimit.majorTwelvePalaces;
                    Object.entries(_0xc7d8_major).forEach(([_0xe9fa_type, _0x1b0c_info]) => {
                        _0xa5b6 += `大限${_0xe9fa_type}：${_0x1b0c_info.originalPalaceName}（${_0x1b0c_info.earthBranch}）\n`;
                    });
                    
                    if (_0xe9fa.majorLimit.transforms && _0xe9fa.majorLimit.transforms.length > 0) {
                        const _0x3d2e_stem = _0xe9fa.earthBranch[0];
                        _0xa5b6 += `大限${_0x3d2e_stem}干四化：\n`;
                        _0xe9fa.majorLimit.transforms.forEach(_0x5f40_trans => {
                            _0xa5b6 += `${_0x5f40_trans.description}\n`;
                        });
                    }
                }
            }
        });

        _0xa5b6 += `

【紫微斗數分析框架】

**重要基礎知識**：
- **十二宮順序（順時針）**：命宮→父母宮→福德宮→田宅宮→官祿宮→交友宮→遷移宮→疾厄宮→財帛宮→子女宮→夫妻宮→兄弟宮→（回到命宮）
- **十二地支順序**：子→丑→寅→卯→辰→巳→午→未→申→酉→戌→亥→子（循環）
- **流年宮位計算法**：
  1. 確定流年地支（如2028年戊申年，地支是「申」）
  2. 在命盤中找出「申」地支對應的宮位作為流年命宮
  3. 從流年命宮開始，按地支順序逐一安排：流年命宮（申）→流年父母宮（酉）→流年福德宮（戌）→流年田宅宮（亥）→流年官祿宮（子）→流年交友宮（丑）→流年遷移宮（寅）→流年疾厄宮（卯）→流年財帛宮（辰）→流年子女宮（巳）→流年夫妻宮（午）→流年兄弟宮（未）
  4. 每個流年宮位對應命盤中該地支的原始宮位
- **大限宮位計算法**：同樣從大限命宮的地支開始，按地支順序安排大限十二宮

請根據以下步驟分析紫微斗數命盤：

1. **本宮分析**
   - 確定要分析的本宮（如命宮、財帛宮、事業宮等）
   - 列出本宮內的主星、輔星、煞星
   - 分析主星的廟旺利陷狀態
   - 解讀宮內星曜組合的基本意義

2. **對宮分析（相對宮位）**
   - **重要**：對宮是指在十二宮順序中相隔六個宮位的宮位
   - **對宮關係**：
     * 命宮 ↔ 遷移宮、父母宮 ↔ 疾厄宮、福德宮 ↔ 財帛宮
     * 田宅宮 ↔ 子女宮、官祿宮 ↔ 夫妻宮、交友宮 ↔ 兄弟宮
   - 找出本宮的對宮
   - 分析對宮星曜配置
   - **重點關注**：
     * 對宮與本宮的相互影響關係
     * **必須分析**：當本宮+三合宮+對宮範圍內有成組星曜時，例如天魁天鉞、文昌文曲、左輔右弼等組合
   - 解讀對宮如何影響本宮的表現
   - 注意對宮星曜的沖剋或助力作用

【重點分析領域】
請特別針對以下生活層面進行深入分析：

1. **命格特質**（命宮為主）
   - 使用本對合鄰六合分析法深入解讀命主性格特質
   - 分析先天稟賦和人生格局

2. **事業運勢**（官祿宮為主）
   - 分析適合的職業方向和發展潛力
   - 預測事業高峰期和關鍵轉折點

3. **財運狀況**（財帛宮為主）
   - 分析財富累積能力和理財特質
   - 預測重要的財運週期

4. **感情婚姻**（夫妻宮為主）
   - 分析感情模式和婚姻運勢
   - 預測感情發展的關鍵時期

5. **健康狀況**（疾厄宮為主）
   - 分析先天體質和易患疾病
   - 提供養生保健建議

6. **人際關係**（交友宮、兄弟宮為主）
   - 分析人際交往模式和貴人運
   - 預測重要的人脈發展期

7. **家庭狀況**（田宅宮、父母宮、子女宮為主）
   - 分析家庭關係和居住環境
   - 預測家運變化

8. **大限流年預測**
   - **大限宮位安排**：以大限命宮地支為起點，按地支順序安排大限十二宮
   - **流年宮位安排**：以流年地支為流年命宮，按地支順序安排流年十二宮
   - **宮位對應關係**：每個流年/大限宮位都對應命盤中該地支的原始宮位
   - 結合當前大限分析人生階段特色
   - 預測未來十年的重要發展趨勢
   - 標註關鍵吉凶年份`;

        return _0xa5b6;
    }
    
    // 格式化星曜用於提示詞
    function _formatStarForPrompt(_0x7162) {
        let _0x9384 = _0x7162.name;
        if (_0x7162.temple) {
            _0x9384 += `[${_0x7162.temple}]`;
        }
        if (_0x7162.birthYearTransform) {
            _0x9384 += `[生年${_0x7162.birthYearTransform}]`;
        }
        if (_0x7162.selfTransform) {
            _0x9384 += `[自化${_0x7162.selfTransform}]`;
        }
        if (_0x7162.flyInTransform) {
            _0x9384 += `[被化${_0x7162.flyInTransform}]`;
        }
        return _0x9384;
    }
    
    // 公開介面
    return {
        generateTable: generateTable,
        generatePrompt: generatePrompt
    };
})(); += `${_0x1b0c}化${_0xe9fa}在${_0x3d2e}\n`;
                    }
                }
            }
        }

        _0xa5b6 += `\n【各宮位詳細資訊】\n`;

        const _0xa5b6_palaces = ['命宮', '父母宮', '福德宮', '田宅宮', '官祿宮', '交友宮', '遷移宮', '疾厄宮', '財帛宮', '子女宮', '夫妻宮', '兄弟宮'];
        
        _0xa5b6_palaces.forEach(_0xc7d8 => {
            const _0xe9fa = _0x7162.palaces[_0xc7d8];
            if (!_0xe9fa) return;

            _0xa5b6 += `\n${_0xc7d8}（${_0xe9fa.earthBranch}）：\n`;
            
            if (_0xe9fa.mainStars.length > 0) {
                _0xa5b6 += `主星：${_0xe9fa.mainStars.map(_0x1b0c => _formatStarForPrompt(_0x1b0c)).join('、')}\n`;
            }
            
            if (_0xe9fa.supportStars.length > 0) {
                _0xa5b6 += `輔星：${_0xe9fa.supportStars.map(_0x3d2e => _formatStarForPrompt(_0x3d2e)).join('、')}\n`;
            }
            
            if (_0xe9fa.minorStars.length > 0) {
                _0xa5b6 += `小星：${_0xe9fa.minorStars.map(_0x5f40 => _0x5f40.temple ? `${_0x5f40.name}[${_0x5f40.temple}]` : _0x5f40.name).join('、')}\n`;
            }
            
            if (_0xe9fa.selfTransforms.length > 0) {
                _0xa5b6 += `自化：${_0xe9fa.selfTransforms.map(_0x7162 => _0x7162.description).join('、')}\n`;
            }
            
            if (_0xe9fa.flyInTransforms.length > 0) {
                _0xa5b6 += `飛化：${_0xe9fa.flyInTransforms.map(_0x9384 => _0x9384.description).join('、')}\n`;
            }
            
            if (_0xe9fa.majorLimit.startAge) {
                let _0xa5b6_limit = `大限：${_0xe9fa.majorLimit.startAge}~${_0xe9fa.majorLimit.endAge}虛歲`;
                if (_0xe9fa.majorLimit.startYear) {
                    _0xa5b6_limit += `（${_0xe9fa.majorLimit.startYear}-${_0xe9fa.majorLimit.endYear}年）`;
                }
                _0xa5b6
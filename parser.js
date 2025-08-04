// 解析命盤的主要功能
function parseChart(text) {
    const data = {
        basicInfo: {},
        palaces: {},
        birthYear: null
    };

    // 1. 提取基本資訊
    parseBasicInfo(text, data);
    
    // 2. 解析各宮位
    parsePalaces(text, data);
    
    // 3. 計算四化關係
    calculateTransforms(data);
    
    // 4. 計算年份對照
    calculateYears(data);

    return data;
}

function parseBasicInfo(text, data) {
    // 性別
    const genderMatch = text.match(/性别\s*:\s*(\S+)/);
    if (genderMatch) data.basicInfo.gender = genderMatch[1];

    // 時間資訊
    const timeMatch = text.match(/鐘錶時間\s*:\s*([^\n]+)/);
    if (timeMatch) data.basicInfo.birthTime = timeMatch[1].trim();

    const lunarMatch = text.match(/農曆時間\s*:\s*([^\n]+)/);
    if (lunarMatch) data.basicInfo.lunarTime = lunarMatch[1].trim();

    // 提取出生年份
    const yearMatch = text.match(/(\d{4})-\d{1,2}-\d{1,2}/);
    if (yearMatch) data.birthYear = parseInt(yearMatch[1]);

    // 五行局
    const wuxingMatch = text.match(/五行局數\s*:\s*([^\n]+)/);
    if (wuxingMatch) data.basicInfo.wuxing = wuxingMatch[1].trim();

    // 命主身主
    const masterMatch = text.match(/身主:([^;]+);\s*命主:([^;]+);\s*子年斗君:([^;]+);\s*身宮:(\S+)/);
    if (masterMatch) {
        data.basicInfo.bodyMaster = masterMatch[1].trim();
        data.basicInfo.lifeMaster = masterMatch[2].trim();
        data.basicInfo.childYearJun = masterMatch[3].trim();
        data.basicInfo.bodyPalace = masterMatch[4].trim();
    }
}

function parsePalaces(text, data) {
    const palaceMatches = [];
    const lines = text.split('\n');
    
    // 找到所有宮位的位置
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const palaceMatch = line.match(/├([^宮]*宮)\[([^\]]+)\]/) || line.match(/└([^宮]*宮)\[([^\]]+)\]/);
        if (palaceMatch) {
            const palaceName = palaceMatch[1].trim().replace(/\s+/g, '');
            palaceMatches.push({
                lineIndex: i,
                name: palaceName,
                earthBranch: palaceMatch[2],
                line: line
            });
        }
    }
    
    console.log('找到的宮位:', palaceMatches.map(p => p.name));
    
    // 為每個宮位提取內容
    for (let i = 0; i < palaceMatches.length; i++) {
        const palace = palaceMatches[i];
        const nextPalace = palaceMatches[i + 1];
        
        const startLine = palace.lineIndex + 1;
        const endLine = nextPalace ? nextPalace.lineIndex : lines.length;
        
        let palaceContent = '';
        for (let j = startLine; j < endLine; j++) {
            if (j < lines.length) {
                palaceContent += lines[j] + '\n';
            }
        }
        
        console.log(`處理宮位: ${palace.name}, 內容長度: ${palaceContent.length}`);
        
        processPalace(palace.name, palace.earthBranch, palaceContent, data);
    }
}

function processPalace(palaceName, earthBranch, content, palace) {
    const palaceData = {
        earthBranch: earthBranch,
        mainStars: [],
        supportStars: [],
        minorStars: [],
        birthYearTransforms: [],
        selfTransforms: [],
        flyInTransforms: [],
        majorLimit: {},
        minorLimit: [],
        fluentYear: []
    };
    
    parseMainStars(content, palaceData);
    parseSupportStars(content, palaceData);
    parseMinorStars(content, palaceData);
    parseLimitsAndYears(content, palaceData);

    palace.palaces[palaceName] = palaceData;
}

function parseMainStars(content, palace) {
    const mainStarMatch = content.match(/├主星\s*:\s*([^\n├]+)/);
    if (!mainStarMatch) return;

    const starText = mainStarMatch[1];
    const starEntries = starText.split(',');
    
    starEntries.forEach(entry => {
        entry = entry.trim();
        if (!entry || entry === '無') return;
        
        const starPattern = /^(\S+?)\[([^\]]+?)\](?:\[([^\]]+?)\])?(?:\[([^\]]+?)\])?/;
        const match = starPattern.exec(entry);
        
        if (match) {
            const starName = match[1];
            const temple = match[2];
            const transform1 = match[3];
            const transform2 = match[4];

            const star = {
                name: starName,
                temple: temple,
                birthYearTransform: null,
                selfTransform: null,
                flyInTransform: null
            };

            [transform1, transform2].forEach(t => {
                if (!t) return;
                
                if (t.match(/生年[祿權科忌]/)) {
                    star.birthYearTransform = t.replace('生年', '');
                } else if (t.match(/↓[祿權科忌]/)) {
                    star.selfTransform = t.replace('↓', '');
                } else if (t.match(/↑[祿權科忌]/)) {
                    star.flyInTransform = t.replace('↑', '');
                }
            });

            palace.mainStars.push(star);
        } else {
            palace.mainStars.push({
                name: entry,
                temple: null,
                birthYearTransform: null,
                selfTransform: null,
                flyInTransform: null
            });
        }
    });
}

function parseSupportStars(content, palace) {
    const supportStarMatch = content.match(/├輔星\s*:\s*([^\n├]+)/);
    if (!supportStarMatch) return;

    const starText = supportStarMatch[1];
    if (starText.includes('無')) return;

    const starEntries = starText.split(',');
    
    starEntries.forEach(entry => {
        entry = entry.trim();
        if (!entry) return;
        
        const starPattern = /^(\S+?)\[([^\]]+?)\](?:\[([^\]]+?)\])?(?:\[([^\]]+?)\])?/;
        const match = starPattern.exec(entry);
        
        if (match) {
            const starName = match[1];
            const temple = match[2];
            const transform1 = match[3];
            const transform2 = match[4];

            const star = {
                name: starName,
                temple: temple,
                birthYearTransform: null,
                selfTransform: null,
                flyInTransform: null
            };

            [transform1, transform2].forEach(t => {
                if (!t) return;
                
                if (t.match(/生年[祿權科忌]/)) {
                    star.birthYearTransform = t.replace('生年', '');
                } else if (t.match(/↓[祿權科忌]/)) {
                    star.selfTransform = t.replace('↓', '');
                } else if (t.match(/↑[祿權科忌]/)) {
                    star.flyInTransform = t.replace('↑', '');
                }
            });

            palace.supportStars.push(star);
        } else {
            palace.supportStars.push({
                name: entry,
                temple: null,
                birthYearTransform: null,
                selfTransform: null,
                flyInTransform: null
            });
        }
    });
}

function parseMinorStars(content, palace) {
    const minorStarMatch = content.match(/├小星\s*:\s*([^\n├]+)/);
    if (!minorStarMatch) return;

    const starText = minorStarMatch[1];
    if (starText.includes('無')) return;

    const cleanText = starText.replace(/[,，]/g, ',');
    const starEntries = cleanText.split(',');

    starEntries.forEach(entry => {
        entry = entry.trim();
        if (!entry) return;

        const starPattern = /^([^[\]]+?)(?:\[([^\]]+?)\])?$/;
        const match = starPattern.exec(entry);

        if (match) {
            const starName = match[1].trim();
            const temple = match[2];

            if (starName) {
                palace.minorStars.push({
                    name: starName,
                    temple: temple
                });
            }
        }
    });
}

function parseLimitsAndYears(content, palace) {
    // 大限
    const majorLimitMatch = content.match(/├大限\s*:\s*([^\n├]+)/);
    if (majorLimitMatch) {
        const limitText = majorLimitMatch[1];
        const ageMatch = limitText.match(/(\d+)~(\d+)虛歲/);
        if (ageMatch) {
            palace.majorLimit = {
                startAge: parseInt(ageMatch[1]),
                endAge: parseInt(ageMatch[2])
            };
        }
    }

    // 小限
    const minorLimitMatch = content.match(/├小限\s*:\s*([^\n├]+)/);
    if (minorLimitMatch) {
        const ages = minorLimitMatch[1].match(/\d+/g);
        if (ages) {
            palace.minorLimit = ages.map(age => parseInt(age));
        }
    }

    // 流年
    const fluentYearMatch = content.match(/└流年\s*:\s*([^\n├└]+)/);
    if (fluentYearMatch) {
        const ages = fluentYearMatch[1].match(/\d+/g);
        if (ages) {
            palace.fluentYear = ages.map(age => parseInt(age));
        }
    }
}

function calculateTransforms(data) {
    // 計算各宮位的自化和飛化關係
    for (let [palaceName, palace] of Object.entries(data.palaces)) {
        const earthBranch = palace.earthBranch;
        let stem = '';
        
        if (earthBranch.length >= 1) {
            stem = earthBranch[0];
        }

        // 處理自化
        [...palace.mainStars, ...palace.supportStars].forEach(star => {
            if (star.selfTransform && transformTable[stem]) {
                const expectedStar = transformTable[stem][star.selfTransform];
                if (expectedStar === star.name) {
                    palace.selfTransforms.push({
                        star: star.name,
                        transform: star.selfTransform,
                        description: `${palaceName}${star.name}自化${star.selfTransform}`
                    });
                }
            }
        });
    }

    // 計算飛化
    calculateFlyTransforms(data);
}

function calculateFlyTransforms(data) {
    for (let [targetPalaceName, targetPalace] of Object.entries(data.palaces)) {
        [...targetPalace.mainStars, ...targetPalace.supportStars].forEach(star => {
            if (star.flyInTransform) {
                for (let [sourcePalaceName, sourcePalace] of Object.entries(data.palaces)) {
                    const sourceStem = sourcePalace.earthBranch[0];
                    if (transformTable[sourceStem] && 
                        transformTable[sourceStem][star.flyInTransform] === star.name) {
                        
                        targetPalace.flyInTransforms.push({
                            sourcePalace: sourcePalaceName,
                            targetStar: star.name,
                            transform: star.flyInTransform,
                            description: `${sourcePalaceName}起${sourceStem}干化${star.name}${star.flyInTransform}入${targetPalaceName}`
                        });
                        break;
                    }
                }
            }
        });
    }
}

function calculateYears(data) {
    if (!data.birthYear) return;

    for (let [palaceName, palace] of Object.entries(data.palaces)) {
        if (palace.majorLimit.startAge && palace.majorLimit.endAge) {
            palace.majorLimit.startYear = data.birthYear + palace.majorLimit.startAge - 1;
            palace.majorLimit.endYear = data.birthYear + palace.majorLimit.endAge - 1;
            palace.majorLimit.majorPalaceName = palaceName;
            palace.majorLimit.majorPalaceEarthBranch = palace.earthBranch;
        }

        palace.minorLimitYears = palace.minorLimit.map(age => data.birthYear + age - 1);
        palace.fluentYearYears = palace.fluentYear.map(age => data.birthYear + age - 1);
    }
    
    calculateMajorLimitPalaces(data);
}

function calculateMajorLimitPalaces(data) {
    for (let [palaceName, palace] of Object.entries(data.palaces)) {
        if (palace.majorLimit.startAge && palace.majorLimit.endAge) {
            const majorCommandPalaceEarthBranch = palace.earthBranch.match(/[子丑寅卯辰巳午未申酉戌亥]/);
            
            if (majorCommandPalaceEarthBranch && majorCommandPalaceEarthBranch[0]) {
                const earthBranch = majorCommandPalaceEarthBranch[0];
                const startIndex = earthBranchOrder.indexOf(earthBranch);
                
                console.log(`計算大限宮位 - ${palaceName}: 地支=${earthBranch}, 索引=${startIndex}`);
                
                if (startIndex !== -1) {
                    palace.majorLimit.majorTwelvePalaces = {};
                    
                    for (let i = 0; i < 12; i++) {
                        const currentEarthBranchIndex = (startIndex + i) % 12;
                        const currentEarthBranch = earthBranchOrder[currentEarthBranchIndex];
                        const currentPalaceType = palaceOrder[i];
                        
                        const originalPalace = findPalaceByEarthBranch(data.palaces, currentEarthBranch);
                        
                        palace.majorLimit.majorTwelvePalaces[currentPalaceType] = {
                            earthBranch: currentEarthBranch,
                            originalPalaceName: originalPalace ? originalPalace.name : '未知',
                            stars: originalPalace ? [...originalPalace.mainStars, ...originalPalace.supportStars] : []
                        };
                    }
                    
                    calculateMajorLimitTransforms(palace, data.palaces);
                    
                    console.log(`${palaceName} 大限十二宮:`, palace.majorLimit.majorTwelvePalaces);
                }
            }
        }
    }
}

function calculateMajorLimitTransforms(majorLimitPalace, allPalaces) {
    const majorLimitStem = majorLimitPalace.earthBranch[0];
    
    if (transformTable[majorLimitStem]) {
        const majorTransforms = transformTable[majorLimitStem];
        majorLimitPalace.majorLimit.transforms = [];
        
        for (let [transformType, starName] of Object.entries(majorTransforms)) {
            for (let [palaceName, palace] of Object.entries(allPalaces)) {
                const foundStar = [...palace.mainStars, ...palace.supportStars].find(star => star.name === starName);
                if (foundStar) {
                    majorLimitPalace.majorLimit.transforms.push({
                        type: transformType,
                        star: starName,
                        targetPalace: palaceName,
                        targetEarthBranch: palace.earthBranch,
                        description: `大限${starName}化${transformType}在${palaceName}（${palace.earthBranch}）`
                    });
                    break;
                }
            }
        }
        
        console.log(`大限${majorLimitPalace.majorLimit.majorPalaceName} - ${majorLimitStem}干四化:`, majorLimitPalace.majorLimit.transforms);
    }
}

function findPalaceByEarthBranch(palaces, targetEarthBranch) {
    for (let [palaceName, palace] of Object.entries(palaces)) {
        const earthBranchMatch = palace.earthBranch.match(/[子丑寅卯辰巳午未申酉戌亥]/);
        if (earthBranchMatch && earthBranchMatch[0] === targetEarthBranch) {
            return { name: palaceName, ...palace };
        }
    }
    return null;
}

// 工具函數：獲取生年天干
function getBirthYearStem(lunarTime) {
    if (!lunarTime) return null;
    
    const yearMatch = lunarTime.match(/([甲乙丙丁戊己庚辛壬癸])[子丑寅卯辰巳午未申酉戌亥]年/);
    return yearMatch ? yearMatch[1] : null;
}
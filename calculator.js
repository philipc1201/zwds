// 四化計算器模組
window.ZiweiCalculator = (function() {
    'use strict';
    
    // 四化表 - 加密存储
    const _0x2c1a = {
        '甲': { 祿: '廉貞', 權: '破軍', 科: '武曲', 忌: '太陽' },
        '乙': { 祿: '天機', 權: '天梁', 科: '紫微', 忌: '太陰' },
        '丙': { 祿: '天同', 權: '天機', 科: '文昌', 忌: '廉貞' },
        '丁': { 祿: '太陰', 權: '天同', 科: '天機', 忌: '巨門' },
        '戊': { 祿: '貪狼', 權: '太陰', 科: '太陽', 忌: '天機' },
        '己': { 祿: '武曲', 權: '貪狼', 科: '天梁', 忌: '文曲' },
        '庚': { 祿: '太陽', 權: '武曲', 科: '天府', 忌: '天同' },
        '辛': { 祿: '巨門', 權: '太陽', 科: '文曲', 忌: '文昌' },
        '壬': { 祿: '天梁', 權: '紫微', 科: '天府', 忌: '武曲' },
        '癸': { 祿: '破軍', 權: '巨門', 科: '太陰', 忌: '貪狼' }
    };
    
    // 獲取四化表
    function getTransformTable() {
        return _0x2c1a;
    }
    
    // 計算四化關係
    function calculateTransforms(data) {
        const _0x3b2d = getTransformTable();
        
        for (let [_0x4c3e, _0x5d4f] of Object.entries(data.palaces)) {
            const _0x6e5a = _0x5d4f.earthBranch;
            let _0x7f6b = '';
            
            if (_0x6e5a.length >= 1) {
                _0x7f6b = _0x6e5a[0];
            }

            [..._0x5d4f.mainStars, ..._0x5d4f.supportStars].forEach(_0x8a7c => {
                if (_0x8a7c.selfTransform && _0x3b2d[_0x7f6b]) {
                    const _0x9b8d = _0x3b2d[_0x7f6b][_0x8a7c.selfTransform];
                    if (_0x9b8d === _0x8a7c.name) {
                        _0x5d4f.selfTransforms.push({
                            star: _0x8a7c.name,
                            transform: _0x8a7c.selfTransform,
                            description: `${_0x4c3e}${_0x8a7c.name}自化${_0x8a7c.selfTransform}`
                        });
                    }
                }
            });
        }
        
        _calculateFlyTransforms(data);
    }
    
    // 計算飛化關係
    function _calculateFlyTransforms(data) {
        const _0x3b2d = getTransformTable();
        
        for (let [_0xac9e, _0xbdaf] of Object.entries(data.palaces)) {
            [..._0xbdaf.mainStars, ..._0xbdaf.supportStars].forEach(_0xcea1 => {
                if (_0xcea1.flyInTransform) {
                    for (let [_0xdfb2, _0xeac3] of Object.entries(data.palaces)) {
                        const _0xfbd4 = _0xeac3.earthBranch[0];
                        if (_0x3b2d[_0xfbd4] && 
                            _0x3b2d[_0xfbd4][_0xcea1.flyInTransform] === _0xcea1.name) {
                            
                            _0xbdaf.flyInTransforms.push({
                                sourcePalace: _0xdfb2,
                                targetStar: _0xcea1.name,
                                transform: _0xcea1.flyInTransform,
                                description: `${_0xdfb2}起${_0xfbd4}干化${_0xcea1.name}${_0xcea1.flyInTransform}入${_0xac9e}`
                            });
                            break;
                        }
                    }
                }
            });
        }
    }
    
    // 計算年份對照
    function calculateYears(data) {
        if (!data.birthYear) return;

        for (let [_0x1ce5, _0x2df6] of Object.entries(data.palaces)) {
            if (_0x2df6.majorLimit.startAge && _0x2df6.majorLimit.endAge) {
                _0x2df6.majorLimit.startYear = data.birthYear + _0x2df6.majorLimit.startAge - 1;
                _0x2df6.majorLimit.endYear = data.birthYear + _0x2df6.majorLimit.endAge - 1;
                _0x2df6.majorLimit.majorPalaceName = _0x1ce5;
                _0x2df6.majorLimit.majorPalaceEarthBranch = _0x2df6.earthBranch;
            }

            _0x2df6.minorLimitYears = _0x2df6.minorLimit.map(_0x3ea7 => data.birthYear + _0x3ea7 - 1);
            _0x2df6.fluentYearYears = _0x2df6.fluentYear.map(_0x4fb8 => data.birthYear + _0x4fb8 - 1);
        }
        
        _calculateMajorLimitPalaces(data);
    }
    
    // 計算大限十二宮分布
    function _calculateMajorLimitPalaces(data) {
        const _0x5ac9 = ['命宮', '父母宮', '福德宮', '田宅宮', '官祿宮', '交友宮', '遷移宮', '疾厄宮', '財帛宮', '子女宮', '夫妻宮', '兄弟宮'];
        const _0x6bda = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
        
        for (let [_0x7ceb, _0x8dfc] of Object.entries(data.palaces)) {
            if (_0x8dfc.majorLimit.startAge && _0x8dfc.majorLimit.endAge) {
                const _0x9e0d = _0x8dfc.earthBranch.match(/[子丑寅卯辰巳午未申酉戌亥]/);
                
                if (_0x9e0d && _0x9e0d[0]) {
                    const _0xaf1e = _0x9e0d[0];
                    const _0xb02f = _0x6bda.indexOf(_0xaf1e);
                    
                    if (_0xb02f !== -1) {
                        _0x8dfc.majorLimit.majorTwelvePalaces = {};
                        
                        for (let i = 0; i < 12; i++) {
                            const _0xc140 = (_0xb02f + i) % 12;
                            const _0xd251 = _0x6bda[_0xc140];
                            const _0xe362 = _0x5ac9[i];
                            
                            const _0xf473 = _findPalaceByEarthBranch(data.palaces, _0xd251);
                            
                            _0x8dfc.majorLimit.majorTwelvePalaces[_0xe362] = {
                                earthBranch: _0xd251,
                                originalPalaceName: _0xf473 ? _0xf473.name : '未知',
                                stars: _0xf473 ? [..._0xf473.mainStars, ..._0xf473.supportStars] : []
                            };
                        }
                        
                        _calculateMajorLimitTransforms(_0x8dfc, data.palaces);
                    }
                }
            }
        }
    }
    
    // 計算大限四化
    function _calculateMajorLimitTransforms(_0x1584, _0x2695) {
        const _0x37a6 = _0x1584.earthBranch[0];
        const _0x3b2d = getTransformTable();
        
        if (_0x3b2d[_0x37a6]) {
            const _0x48b7 = _0x3b2d[_0x37a6];
            _0x1584.majorLimit.transforms = [];
            
            for (let [_0x59c8, _0x6ad9] of Object.entries(_0x48b7)) {
                for (let [_0x7bea, _0x8cfb] of Object.entries(_0x2695)) {
                    const _0x9d0c = [..._0x8cfb.mainStars, ..._0x8cfb.supportStars].find(_0xae1d => _0xae1d.name === _0x6ad9);
                    if (_0x9d0c) {
                        _0x1584.majorLimit.transforms.push({
                            type: _0x59c8,
                            star: _0x6ad9,
                            targetPalace: _0x7bea,
                            targetEarthBranch: _0x8cfb.earthBranch,
                            description: `大限${_0x6ad9}化${_0x59c8}在${_0x7bea}（${_0x8cfb.earthBranch}）`
                        });
                        break;
                    }
                }
            }
        }
    }
    
    // 根據地支查找宮位
    function _findPalaceByEarthBranch(_0xbf2e, _0xc03f) {
        for (let [_0xd140, _0xe251] of Object.entries(_0xbf2e)) {
            const _0xf362 = _0xe251.earthBranch.match(/[子丑寅卯辰巳午未申酉戌亥]/);
            if (_0xf362 && _0xf362[0] === _0xc03f) {
                return { name: _0xd140, ..._0xe251 };
            }
        }
        return null;
    }
    
    // 獲取生年天干
    function getBirthYearStem(_0x1473) {
        if (!_0x1473) return null;
        const _0x2584 = _0x1473.match(/([甲乙丙丁戊己庚辛壬癸])[子丑寅卯辰巳午未申酉戌亥]年/);
        return _0x2584 ? _0x2584[1] : null;
    }
    
    // 公開介面
    return {
        calculateTransforms: calculateTransforms,
        calculateYears: calculateYears,
        getBirthYearStem: getBirthYearStem,
        getTransformTable: getTransformTable
    };
})();
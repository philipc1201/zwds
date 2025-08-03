// 命盤解析器模組
window.ZiweiParser = (function() {
    'use strict';
    
    // 主解析函數
    function parseChart(_0x1a2b) {
        const _0x3c4d = {
            basicInfo: {},
            palaces: {},
            birthYear: null
        };

        _parseBasicInfo(_0x1a2b, _0x3c4d);
        _parsePalaces(_0x1a2b, _0x3c4d);
        
        return _0x3c4d;
    }
    
    // 解析基本資訊
    function _parseBasicInfo(_0x5e6f, _0x7a8b) {
        const _0x9c0d = _0x5e6f.match(/性别\s*:\s*(\S+)/);
        if (_0x9c0d) _0x7a8b.basicInfo.gender = _0x9c0d[1];

        const _0x1e2f = _0x5e6f.match(/鐘錶時間\s*:\s*([^\n]+)/);
        if (_0x1e2f) _0x7a8b.basicInfo.birthTime = _0x1e2f[1].trim();

        const _0x3a4b = _0x5e6f.match(/農曆時間\s*:\s*([^\n]+)/);
        if (_0x3a4b) _0x7a8b.basicInfo.lunarTime = _0x3a4b[1].trim();

        const _0x5c6d = _0x5e6f.match(/(\d{4})-\d{1,2}-\d{1,2}/);
        if (_0x5c6d) _0x7a8b.birthYear = parseInt(_0x5c6d[1]);

        const _0x7e8f = _0x5e6f.match(/五行局數\s*:\s*([^\n]+)/);
        if (_0x7e8f) _0x7a8b.basicInfo.wuxing = _0x7e8f[1].trim();

        const _0x9a0b = _0x5e6f.match(/身主:([^;]+);\s*命主:([^;]+);\s*子年斗君:([^;]+);\s*身宮:(\S+)/);
        if (_0x9a0b) {
            _0x7a8b.basicInfo.bodyMaster = _0x9a0b[1].trim();
            _0x7a8b.basicInfo.lifeMaster = _0x9a0b[2].trim();
            _0x7a8b.basicInfo.childYearJun = _0x9a0b[3].trim();
            _0x7a8b.basicInfo.bodyPalace = _0x9a0b[4].trim();
        }
    }
    
    // 解析各宮位
    function _parsePalaces(_0x1b2c, _0x3d4e) {
        const _0x5f60 = [];
        const _0x7182 = _0x1b2c.split('\n');
        
        for (let i = 0; i < _0x7182.length; i++) {
            const _0x93a4 = _0x7182[i].trim();
            const _0xb5c6 = _0x93a4.match(/├([^宮]*宮)\[([^\]]+)\]/) || _0x93a4.match(/└([^宮]*宮)\[([^\]]+)\]/);
            if (_0xb5c6) {
                const _0xd7e8 = _0xb5c6[1].trim().replace(/\s+/g, '');
                _0x5f60.push({
                    lineIndex: i,
                    name: _0xd7e8,
                    earthBranch: _0xb5c6[2],
                    line: _0x93a4
                });
            }
        }
        
        for (let i = 0; i < _0x5f60.length; i++) {
            const _0xf90a = _0x5f60[i];
            const _0x1b0c = _0x5f60[i + 1];
            
            const _0x3d2e = _0xf90a.lineIndex + 1;
            const _0x5f40 = _0x1b0c ? _0x1b0c.lineIndex : _0x7182.length;
            
            let _0x7162 = '';
            for (let j = _0x3d2e; j < _0x5f40; j++) {
                if (j < _0x7182.length) {
                    _0x7162 += _0x7182[j] + '\n';
                }
            }
            
            _processPalace(_0xf90a.name, _0xf90a.earthBranch, _0x7162, _0x3d4e);
        }
    }
    
    // 處理單一宮位
    function _processPalace(_0x9384, _0xa5b6, _0xc7d8, _0xe9fa) {
        const _0x1b0c = {
            earthBranch: _0xa5b6,
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
        
        _parseMainStars(_0xc7d8, _0x1b0c);
        _parseSupportStars(_0xc7d8, _0x1b0c);
        _parseMinorStars(_0xc7d8, _0x1b0c);
        _parseLimitsAndYears(_0xc7d8, _0x1b0c);

        _0xe9fa.palaces[_0x9384] = _0x1b0c;
    }
    
    // 解析主星
    function _parseMainStars(_0x3d2e, _0x5f40) {
        const _0x7162 = _0x3d2e.match(/├主星\s*:\s*([^\n├]+)/);
        if (!_0x7162) return;

        const _0x9384 = _0x7162[1];
        const _0xa5b6 = _0x9384.split(',');
        
        _0xa5b6.forEach(_0xc7d8 => {
            _0xc7d8 = _0xc7d8.trim();
            if (!_0xc7d8 || _0xc7d8 === '無') return;
            
            const _0xe9fa = /^(\S+?)\[([^\]]+?)\](?:\[([^\]]+?)\])?(?:\[([^\]]+?)\])?/;
            const _0x1b0c = _0xe9fa.exec(_0xc7d8);
            
            if (_0x1b0c) {
                const _0x3d2e = _0x1b0c[1];
                const _0x5f40 = _0x1b0c[2];
                const _0x7162 = _0x1b0c[3];
                const _0x9384 = _0x1b0c[4];

                const _0xa5b6 = {
                    name: _0x3d2e,
                    temple: _0x5f40,
                    birthYearTransform: null,
                    selfTransform: null,
                    flyInTransform: null
                };

                [_0x7162, _0x9384].forEach(_0xc7d8 => {
                    if (!_0xc7d8) return;
                    
                    if (_0xc7d8.match(/生年[祿權科忌]/)) {
                        _0xa5b6.birthYearTransform = _0xc7d8.replace('生年', '');
                    } else if (_0xc7d8.match(/↓[祿權科忌]/)) {
                        _0xa5b6.selfTransform = _0xc7d8.replace('↓', '');
                    } else if (_0xc7d8.match(/↑[祿權科忌]/)) {
                        _0xa5b6.flyInTransform = _0xc7d8.replace('↑', '');
                    }
                });

                _0x5f40.mainStars.push(_0xa5b6);
            } else {
                _0x5f40.mainStars.push({
                    name: _0xc7d8,
                    temple: null,
                    birthYearTransform: null,
                    selfTransform: null,
                    flyInTransform: null
                });
            }
        });
    }
    
    // 解析輔星
    function _parseSupportStars(_0xe9fa, _0x1b0c) {
        const _0x3d2e = _0xe9fa.match(/├輔星\s*:\s*([^\n├]+)/);
        if (!_0x3d2e) return;

        const _0x5f40 = _0x3d2e[1];
        if (_0x5f40.includes('無')) return;

        const _0x7162 = _0x5f40.split(',');
        
        _0x7162.forEach(_0x9384 => {
            _0x9384 = _0x9384.trim();
            if (!_0x9384) return;
            
            const _0xa5b6 = /^(\S+?)\[([^\]]+?)\](?:\[([^\]]+?)\])?(?:\[([^\]]+?)\])?/;
            const _0xc7d8 = _0xa5b6.exec(_0x9384);
            
            if (_0xc7d8) {
                const _0xe9fa = _0xc7d8[1];
                const _0x1b0c = _0xc7d8[2];
                const _0x3d2e = _0xc7d8[3];
                const _0x5f40 = _0xc7d8[4];

                const _0x7162 = {
                    name: _0xe9fa,
                    temple: _0x1b0c,
                    birthYearTransform: null,
                    selfTransform: null,
                    flyInTransform: null
                };

                [_0x3d2e, _0x5f40].forEach(_0x9384 => {
                    if (!_0x9384) return;
                    
                    if (_0x9384.match(/生年[祿權科忌]/)) {
                        _0x7162.birthYearTransform = _0x9384.replace('生年', '');
                    } else if (_0x9384.match(/↓[祿權科忌]/)) {
                        _0x7162.selfTransform = _0x9384.replace('↓', '');
                    } else if (_0x9384.match(/↑[祿權科忌]/)) {
                        _0x7162.flyInTransform = _0x9384.replace('↑', '');
                    }
                });

                _0x1b0c.supportStars.push(_0x7162);
            } else {
                _0x1b0c.supportStars.push({
                    name: _0x9384,
                    temple: null,
                    birthYearTransform: null,
                    selfTransform: null,
                    flyInTransform: null
                });
            }
        });
    }
    
    // 解析小星
    function _parseMinorStars(_0xa5b6, _0xc7d8) {
        const _0xe9fa = _0xa5b6.match(/├小星\s*:\s*([^\n├]+)/);
        if (!_0xe9fa) return;

        const _0x1b0c = _0xe9fa[1];
        if (_0x1b0c.includes('無')) return;

        const _0x3d2e = _0x1b0c.replace(/[,，]/g, ',');
        const _0x5f40 = _0x3d2e.split(',');

        _0x5f40.forEach(_0x7162 => {
            _0x7162 = _0x7162.trim();
            if (!_0x7162) return;

            const _0x9384 = /^([^[\]]+?)(?:\[([^\]]+?)\])?$/;
            const _0xa5b6 = _0x9384.exec(_0x7162);

            if (_0xa5b6) {
                const _0xe9fa = _0xa5b6[1].trim();
                const _0x1b0c = _0xa5b6[2];

                if (_0xe9fa) {
                    _0xc7d8.minorStars.push({
                        name: _0xe9fa,
                        temple: _0x1b0c
                    });
                }
            }
        });
    }
    
    // 解析大限、小限、流年
    function _parseLimitsAndYears(_0x3d2e, _0x5f40) {
        const _0x7162 = _0x3d2e.match(/├大限\s*:\s*([^\n├]+)/);
        if (_0x7162) {
            const _0x9384 = _0x7162[1];
            const _0xa5b6 = _0x9384.match(/(\d+)~(\d+)虛歲/);
            if (_0xa5b6) {
                _0x5f40.majorLimit = {
                    startAge: parseInt(_0xa5b6[1]),
                    endAge: parseInt(_0xa5b6[2])
                };
            }
        }

        const _0xc7d8 = _0x3d2e.match(/├小限\s*:\s*([^\n├]+)/);
        if (_0xc7d8) {
            const _0xe9fa = _0xc7d8[1].match(/\d+/g);
            if (_0xe9fa) {
                _0x5f40.minorLimit = _0xe9fa.map(_0x1b0c => parseInt(_0x1b0c));
            }
        }

        const _0x1b0c = _0x3d2e.match(/└流年\s*:\s*([^\n├└]+)/);
        if (_0x1b0c) {
            const _0x3d2e = _0x1b0c[1].match(/\d+/g);
            if (_0x3d2e) {
                _0x5f40.fluentYear = _0x3d2e.map(_0x5f40 => parseInt(_0x5f40));
            }
        }
    }
    
    // 公開介面
    return {
        parseChart: parseChart
    };
})();
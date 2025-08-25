// src/components/OptionLibraryPanel.js

import React, { useMemo } from 'react';
import { useRule } from '../context/RuleContext';
import { optionsDictionary } from '../data/optionsDictionary';
import { v4 as uuidv4 } from 'uuid';

const OptionLibraryPanel = () => {
    const { activeEditorState, setActiveEditorState } = useRule();
    const { ruleOptions, headerData } = activeEditorState;
    const protocol = headerData.Protocol?.toLowerCase();

    const handleAddOption = (keyword) => {
        const newOption = {
            id: uuidv4(),
            keyword: keyword,
            value: optionsDictionary[keyword].defaultValue
        };
        if (keyword === 'content') {
            newOption.modifiers = { nocase: false, depth: '', offset: '' };
        }
        setActiveEditorState(prev => ({
            ...prev,
            ruleOptions: [...prev.ruleOptions, newOption]
        }));
    };

    const categorizedOptions = useMemo(() => {
        const addedKeywords = new Set(ruleOptions.map(o => o.keyword));
        
        const filtered = Object.keys(optionsDictionary).filter(keyword => {
            const optionInfo = optionsDictionary[keyword];
            if (optionInfo.isModifier) return false;
            if (optionInfo.allowMultiple === false && addedKeywords.has(keyword)) return false;
            if (optionInfo.dependsOnProtocol && optionInfo.dependsOnProtocol !== protocol) {
                return false;
            }
            return true;
        });

        const grouped = filtered.reduce((acc, keyword) => {
            const option = optionsDictionary[keyword];
            let category = option.displayCategory || 'Diğer';
            if (option.dependsOnProtocol) {
                category = `Protokole Özel: ${protocol.toUpperCase()}`;
            }
            if (!acc[category]) { acc[category] = []; }
            acc[category].push(keyword);
            return acc;
        }, {});

        const categoryOrder = ['Sık Kullanılanlar', `Protokole Özel: ${protocol?.toUpperCase()}`, 'Payload', 'Genel', 'Diğer'];
        return categoryOrder
            .map(category => ({ category, options: grouped[category] || [] }))
            .filter(group => group.options.length > 0);

    }, [ruleOptions, protocol]);

    return (
        <div className="option-library-panel">
            <h4>Seçenek Kütüphanesi</h4>
            <div className="library-list">
                {categorizedOptions.map(group => (
                    <React.Fragment key={group.category}>
                        <div className="library-category-header">{group.category}</div>
                        {group.options.map(keyword => (
                            <div key={keyword} className="library-item" onClick={() => handleAddOption(keyword)} title={`Ekle: ${keyword}`}>
                                <span className="library-item-keyword">{keyword}</span>
                                <span className="library-item-desc"> - {optionsDictionary[keyword].description}</span>
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default OptionLibraryPanel;
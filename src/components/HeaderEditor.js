// src/components/HeaderEditor.js

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRule } from '../context/RuleContext';
import suggestionsData from '../data/suggestionsData';
import RuleInputBox from './RuleInputBox';
import OptionsBuilder from './OptionsBuilder';

const HeaderEditor = () => {
    const { activeEditorState, setActiveEditorState } = useRule();
    const { headerData } = activeEditorState;
    
    const [isHeaderComplete, setIsHeaderComplete] = useState(false);
    const [activeInput, setActiveInput] = useState(null);

    const editorRef = useRef(null);
    const inputRefs = useRef([]);
    const labels = Object.keys(headerData);

    // Yeni bir kural yüklendiğinde veya editör temizlendiğinde, header görünümüne geri dön.
    useEffect(() => {
        setIsHeaderComplete(false);
    }, [activeEditorState.id]);

    const filteredSuggestions = useMemo(() => {
        if (!activeInput || !suggestionsData[activeInput]) return [];
        const value = headerData[activeInput] || '';
        const allSuggestions = suggestionsData[activeInput];
        if (!value) return allSuggestions;
        return allSuggestions.filter(s => s.toLowerCase().startsWith(value.toLowerCase()));
    }, [activeInput, headerData]);

    const handleChange = (label, value) => {
        setActiveEditorState(prev => ({ ...prev, headerData: { ...prev.headerData, [label]: value }}));
    };
    
    const handleFocus = (label) => setActiveInput(label);

    const applySuggestion = (suggestion) => {
        if (activeInput) handleChange(activeInput, suggestion);
    };

    const moveToNextField = (currentIndex) => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < labels.length) {
            setTimeout(() => inputRefs.current[nextIndex]?.focus(), 0);
        } else {
            setIsHeaderComplete(true);
        }
    };

    const handleSuggestionClick = (suggestion) => { 
        if (activeInput) {
            const currentIndex = labels.indexOf(activeInput);
            applySuggestion(suggestion);
            moveToNextField(currentIndex);
        }
    };
    
    const handleKeyDown = (e, currentIndex) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const currentValue = e.target.value?.toLowerCase();
            const firstSuggestion = filteredSuggestions[0]?.toLowerCase();

            if (filteredSuggestions.length > 0 && currentValue !== firstSuggestion) {
                applySuggestion(filteredSuggestions[0]);
            } else {
                moveToNextField(currentIndex);
            }
        }
        if (e.key === ' ' && e.target.value.trim() !== '') {
            e.preventDefault();
            moveToNextField(currentIndex);
        }
    };
    
    if (isHeaderComplete) {
        const finalHeaderString = labels.map(label => headerData[label]).join(' ');
        return (
            <div className="options-view-container">
                <div className="options-view-header">
                    <pre className="final-header-text">{finalHeaderString} (</pre>
                    <button className="back-to-header-btn" onClick={() => setIsHeaderComplete(false)}>&lt; Header'ı Düzenle</button>
                </div>
                <OptionsBuilder />
                <pre className="final-header-text">)</pre>
            </div>
        );
    }

    return (
        <div className="editor-row" ref={editorRef}>
            {labels.map((label, index) => (
                <RuleInputBox 
                    key={label + activeEditorState.id} // ID'yi key'e ekleyerek yeniden render garantisi
                    ref={el => inputRefs.current[index] = el} 
                    label={label} 
                    value={headerData[label]}
                    onChange={e => handleChange(label, e.target.value)}
                    onFocus={() => handleFocus(label)} 
                    onKeyDown={e => handleKeyDown(e, index)} 
                    isActive={activeInput === label} 
                    suggestions={filteredSuggestions}
                    onSuggestionClick={handleSuggestionClick} 
                />
            ))}
        </div>
    );
};

export default HeaderEditor;
// src/components/OptionsBuilder.js

import React, { useState, useEffect } from 'react';
import { useRule } from '../context/RuleContext';
import OptionRow from './OptionRow';
import EditorActions from './EditorActions';
import { optionsDictionary } from '../data/optionsDictionary';


const OptionsBuilder = () => {
    const { activeEditorState, setActiveEditorState } = useRule();
    const { ruleOptions } = activeEditorState;
    
    const [editingIndex, setEditingIndex] = useState(null);

    // Yeni bir option kütüphaneden eklendiğinde, düzenleme modunu başlat
    useEffect(() => {
        if(ruleOptions.length > 0) {
            const lastOption = ruleOptions[ruleOptions.length - 1];
            if (optionsDictionary[lastOption.keyword]?.inputType !== 'flag') {
                setEditingIndex(ruleOptions.length - 1);
            } else {
                setEditingIndex(null);
            }
        }
    }, [ruleOptions]);
    
    const handleValueChange = (index, newValue) => {
        const updatedOptions = [...ruleOptions];
        const targetOption = updatedOptions[index];
        if (targetOption) {
            if (typeof newValue === 'object' && newValue !== null) {
                targetOption.value = newValue.value;
                targetOption.modifiers = newValue.modifiers;
            } else {
                targetOption.value = newValue;
            }
            setActiveEditorState(prev => ({...prev, ruleOptions: updatedOptions}));
        }
    };
    
    const handleStopEditing = () => { 
        setEditingIndex(null); 
    };
    
    return (
        <div className="options-builder">
            <div className="added-options-list">
                {ruleOptions.map((option, index) => (
                    <OptionRow 
                        key={option.id}
                        option={option} 
                        isEditing={index === editingIndex} 
                        onStartEditing={() => setEditingIndex(index)} 
                        onStopEditing={handleStopEditing} 
                        onValueChange={(newValue) => handleValueChange(index, newValue)} 
                    />
                ))}
            </div>
            <EditorActions />
        </div>
    );
};

export default OptionsBuilder;
// src/components/EditorActions.js

import React from 'react';
import { useRule } from '../context/RuleContext';

const EditorActions = () => {
    const { saveOrUpdateRule, clearEditor, activeEditorState } = useRule();
    const isEditing = !!activeEditorState.id;

    return (
        <div className="editor-actions">
            <button onClick={clearEditor} className="action-button cancel-button">
                {isEditing ? 'Değişiklikleri Geri Al' : 'Temizle'}
            </button>
            <button onClick={saveOrUpdateRule} className="action-button save-button">
                {isEditing ? 'Kuralı Güncelle' : 'Kuralı Kaydet'}
            </button>
        </div>
    );
};

export default EditorActions;
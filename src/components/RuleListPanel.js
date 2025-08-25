// src/components/RuleListPanel.js

import React from 'react';
import { useRule } from '../context/RuleContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const RuleListPanel = () => {
    const { completedRules, loadRuleIntoEditor, deleteRule } = useRule();

    return (
        <div className="rule-list-panel">
            <h4>Kaydedilmiş Kurallar ({completedRules.length})</h4>
            <div className="rule-list-items">
                {completedRules.length === 0 ? (
                    <div className="empty-list-message">Henüz kaydedilmiş bir kural yok.</div>
                ) : (
                    completedRules.map(rule => (
                        <div key={rule.id} className="rule-list-item">
                            <div className="rule-item-actions">
                                <button title="Düzenle" onClick={() => loadRuleIntoEditor(rule)}>✏️</button>
                                <button title="Sil" onClick={() => deleteRule(rule.id)}>✖</button>
                            </div>
                            <div className="rule-item-string">
                               <SyntaxHighlighter language="bash" style={vscDarkPlus} customStyle={{ margin: 0, padding: 0, backgroundColor: 'transparent' }} codeTagProps={{ style: { fontSize: '0.9rem', fontFamily: "'Consolas', 'Courier New', monospace"} }}>
                                   {rule.ruleString}
                               </SyntaxHighlighter>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RuleListPanel;
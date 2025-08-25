// src/context/RuleContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateRuleString } from '../utils/ruleGenerator';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

const createNewEditorState = () => ({
    id: null, // Düzenlenen kuralın ID'si. null ise yeni kural demektir.
    headerData: { 'Action': '', 'Protocol': '', 'Source IP': '', 'Source Port': '', 'Direction': '', 'Destination IP': '', 'Destination Port': '' },
    ruleOptions: [],
});

const RuleContext = createContext();
export const useRule = () => useContext(RuleContext);

export const RuleProvider = ({ children }) => {
    const [completedRules, setCompletedRules] = useState(() => {
        const saved = localStorage.getItem('suricataCompletedRules');
        return saved ? JSON.parse(saved) : [];
    });

    const [activeEditorState, setActiveEditorState] = useState(createNewEditorState());

    useEffect(() => {
        localStorage.setItem('suricataCompletedRules', JSON.stringify(completedRules));
    }, [completedRules]);

    const loadRuleIntoEditor = (rule) => {
        setActiveEditorState({
            id: rule.id,
            headerData: rule.headerData,
            ruleOptions: rule.ruleOptions,
        });
        toast.info(`Kural düzenlenmek üzere editöre yüklendi.`);
    };

    const clearEditor = () => {
        setActiveEditorState(createNewEditorState());
    };
    
    const saveOrUpdateRule = () => {
        if (!activeEditorState.ruleOptions.some(o => o.keyword === 'msg') || !activeEditorState.ruleOptions.some(o => o.keyword === 'sid')) {
            toast.error('Lütfen kurala en azından "msg" ve "sid" seçeneklerini ekleyin.');
            return;
        }

        const finalRuleString = generateRuleString(activeEditorState.headerData, activeEditorState.ruleOptions);
        
        const ruleData = {
            headerData: activeEditorState.headerData,
            ruleOptions: activeEditorState.ruleOptions,
            ruleString: finalRuleString,
        };

        if (activeEditorState.id) { // Mevcut kuralı GÜNCELLE
            setCompletedRules(prev => prev.map(r => r.id === activeEditorState.id ? { ...r, ...ruleData } : r));
            toast.success('Kural başarıyla güncellendi!');
        } else { // YENİ kuralı KAYDET (Listenin başına ekle)
            setCompletedRules(prev => [{ ...ruleData, id: uuidv4() }, ...prev]);
            toast.success('Kural başarıyla kaydedildi!');
        }
        clearEditor(); // İşlem bitince editörü temizle.
    };

    const deleteRule = (ruleId) => {
        setCompletedRules(prev => prev.filter(r => r.id !== ruleId));
        toast.info('Kural silindi.');
    };

    const value = {
        completedRules,
        activeEditorState,
        setActiveEditorState,
        loadRuleIntoEditor,
        clearEditor,
        saveOrUpdateRule,
        deleteRule,
    };

    return (
        <RuleContext.Provider value={value}>
            {children}
        </RuleContext.Provider>
    );
};
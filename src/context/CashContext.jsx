// src/context/CashContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const CashContext = createContext(undefined);

export const CashProvider = ({ children }) => {
    const [isCashOpen, setIsCashOpen] = useState(false);

    useEffect(() => {
        const cashOpeningDateTime = localStorage.getItem('cashOpeningDateTime');
        const cashClosingDateTime = localStorage.getItem('cashClosingDateTime');
        if (cashOpeningDateTime && !cashClosingDateTime) {
            setIsCashOpen(true);
        }
    }, []);

    const openCash = (amount) => {
    setIsCashOpen(true);
    localStorage.setItem('cashOpeningAmount', amount.toString());
    localStorage.setItem('cashOpeningDateTime', new Date().toISOString());
    };

    const closeCash = () => {
        setIsCashOpen(false);
        localStorage.removeItem('cashOpeningAmount');
        localStorage.setItem('cashClosingDateTime', new Date().toISOString());
    };

    return (
        <CashContext.Provider value={{ isCashOpen, openCash, closeCash }}>
            {children}
        </CashContext.Provider>
    );
};

export const useCash = () => {
    return useContext(CashContext);
};
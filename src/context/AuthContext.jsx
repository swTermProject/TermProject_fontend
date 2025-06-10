import React, { createContext, useState, useContext, useEffect } from 'react';

// Context 생성
const AuthContext = createContext(null);

// Context를 사용하기 편하게 해주는 Custom Hook
export const useAuth = () => useContext(AuthContext);

// 앱 전체에 인증 상태를 제공하는 Provider 컴포넌트
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        // 앱이 처음 로드될 때 로컬 스토리지에서 사용자 정보와 토큰을 가져와 상태를 설정
        const storedUser = localStorage.getItem('user');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
    }, [token]);

    const login = (userData, token) => {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        setUser(userData);
        setToken(token);
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
    };

    const value = { user, token, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
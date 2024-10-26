'use client';
import { useEffect } from "react";

export interface SessionProviderProps {
  children: React.ReactNode;
}

// クラアントのローカルストレージでデータ保持してます
const SessionProvider = ({ children }: SessionProviderProps) => {
    useEffect(() => {
        if(window.location.pathname === "/login"){
            return;
        }

        const userId = localStorage.getItem("userID");

        if(!userId){
            window.location.href = "/login";
        }

        console.log(userId);
    },[]);

  return <>{children}</>;
};

export default SessionProvider;

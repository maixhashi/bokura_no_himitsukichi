import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/auth/status")
      .then((res) => {
        setIsAuthenticated(res.data.isAuthenticated);
        if (!res.data.isAuthenticated) {
          navigate("/login"); // 未認証ならログイン画面へリダイレクト
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
        navigate("/login");
      });
  }, [navigate]);

  return isAuthenticated;
};

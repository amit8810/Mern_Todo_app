import React, { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/Auth";
import { UserContext } from "../context/User";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const { setAuth } = useContext(AuthContext);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(
        `http://localhost:8000/api/v1/users/current-user`,{
          credentials: "include"
        }
      );
        const jsonData = await response.json();
        console.log(jsonData)
      if (jsonData.status !== 200) {
       navigate("/login");
      } else {
        setUser(jsonData.user);
        setAuth(true);
        navigate("/todos");
      }
    };

    fetchUser();
  }, []);
}

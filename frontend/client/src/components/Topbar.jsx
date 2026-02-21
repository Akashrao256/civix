import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Topbar() {
  const [user, setUser] = useState("User");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await API.get("/users/me");
        setUser(data.name);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="topbar">
      <h3>Dashboard Overview</h3>
      <span>Welcome, {user}</span>
    </div>
  );
}
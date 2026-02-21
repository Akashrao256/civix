import { useEffect, useState } from "react";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import PetitionCard from "../components/PetitionCard";
import PollCard from "../components/PollCard";

export default function Dashboard() {
  const [stats, setStats] = useState({
    petitions: 0,
    polls: 0,
    users: 0,
  });

  const [petitions, setPetitions] = useState([]);
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const petitionsRes = await API.get("/petitions");
        const pollsRes = await API.get("/polls");
        const usersRes = await API.get("/users");

        setPetitions(petitionsRes.data);
        setPolls(pollsRes.data);

        setStats({
          petitions: petitionsRes.data.length,
          polls: pollsRes.data.length,
          users: usersRes.data.length,
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <Topbar />

        {/* ✅ Welcome Banner Added Here */}
        <div className="welcome-banner">
          <div>
            <h2>Welcome Back </h2>
            <p>Manage petitions and stay updated with community activities.</p>
          </div>

          <button className="add-petition-btn">
            + Add Petition
          </button>
        </div>

        <div className="stats">
          <StatCard title="Total Petitions" value={stats.petitions} />
          <StatCard title="Active Polls" value={stats.polls} />
          <StatCard title="Total Users" value={stats.users} />
        </div>

        <h3>Recent Petitions</h3>
        <div className="grid">
          {petitions.map((p) => (
            <PetitionCard key={p._id} petition={p} />
          ))}
        </div>

        <h3>Active Polls</h3>
        <div className="grid">
          {polls.map((poll) => (
            <PollCard key={poll._id} poll={poll} />
          ))}
        </div>
      </div>
    </div>
  );
}
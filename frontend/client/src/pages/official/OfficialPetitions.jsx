import { useEffect, useState } from "react";
import api from "../../api/axios";
import PetitionCard from "../../components/PetitionCard";

export default function OfficialPetitions() {
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPetitions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/petitions");
      setPetitions(res.data.petitions || res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load petitions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPetitions();
  }, []);

  const handleStatusUpdate = async (petitionId, status) => {
    try {
      await api.patch(`/api/petitions/${petitionId}/status`, { status });

      setPetitions((prev) =>
        prev.map((petition) =>
          petition._id === petitionId ? { ...petition, status } : petition
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleResponseSubmit = async (petitionId, message) => {
    try {
      const res = await api.post(`/api/petitions/${petitionId}/respond`, {
        message,
      });

      const newResponse = res.data.response || {
        message,
        officialName: "Official",
        createdAt: new Date().toISOString(),
      };

      setPetitions((prev) =>
        prev.map((petition) =>
          petition._id === petitionId
            ? {
                ...petition,
                responses: [...(petition.responses || []), newResponse],
              }
            : petition
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send response");
    }
  };

  if (loading) return <p>Loading petitions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Local Petitions</h2>
        <p>View and respond to petitions in your locality</p>
      </div>

      {petitions.length === 0 ? (
        <p>No petitions found for your location.</p>
      ) : (
        <div className="petition-grid">
          {petitions.map((petition) => (
            <PetitionCard
              key={petition._id}
              petition={petition}
              isOfficial={true}
              onStatusUpdate={handleStatusUpdate}
              onResponseSubmit={handleResponseSubmit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
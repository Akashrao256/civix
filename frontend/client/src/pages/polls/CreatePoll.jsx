import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import AppSidebar from "../../components/AppSidebar";
import Button from "../../components/ui/Button";
import PageHeader from "../../components/ui/PageHeader";

export default function CreatePoll() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        question: "",
        targetLocation: "",
        options: ["", ""] // Start with 2 empty options
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData((prev) => ({ ...prev, options: newOptions }));
    };

    const addOption = () => {
        setFormData((prev) => ({ ...prev, options: [...prev.options, ""] }));
    };

    const removeOption = (indexToRemove) => {
        if (formData.options.length <= 2) return; // Minimum 2 options
        setFormData((prev) => ({
            ...prev,
            options: prev.options.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Filter out empty options
        const filteredOptions = formData.options.filter(opt => opt.trim() !== "");

        if (filteredOptions.length < 2) {
            setError("Please provide at least 2 valid options.");
            setLoading(false);
            return;
        }

        try {
            await API.post("/polls", {
                question: formData.question,
                targetLocation: formData.targetLocation,
                options: filteredOptions
            });
            navigate("/polls");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create poll");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-layout">
            <AppSidebar />
            <div className="app-main">
                <PageHeader
                    title="Create a New Poll"
                    subtitle="Gather feedback from the community on important issues."
                    actions={<Button variant="ghost" onClick={() => navigate("/polls")}>← Back to Polls</Button>}
                />

                <div className="form-shell">
                    <div className="form-card">
                        <div className="form-card-header">
                            <h2 className="form-card-title">Poll Details</h2>
                            <p className="form-card-subtitle">Provide a question and at least two options.</p>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={handleSubmit} className="form-stack">
                            <div className="form-group">
                                <label>Question</label>
                                <input
                                    type="text"
                                    name="question"
                                    value={formData.question}
                                    onChange={handleChange}
                                    placeholder="e.g., Should we build a new community center?"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Target Location (City, District, etc.)</label>
                                <input
                                    type="text"
                                    name="targetLocation"
                                    value={formData.targetLocation}
                                    onChange={handleChange}
                                    placeholder="e.g., Downtown"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label-row">
                                    <span>Options</span>
                                    <Button type="button" variant="ghost" onClick={addOption}>
                                        + Add Option
                                    </Button>
                                </label>

                                {formData.options.map((option, index) => (
                                    <div key={index} className="option-row">
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => handleOptionChange(index, e.target.value)}
                                            placeholder={`Option ${index + 1}`}
                                            required={index < 2}
                                        />
                                        {formData.options.length > 2 && (
                                            <Button
                                                type="button"
                                                variant="danger"
                                                className="option-remove"
                                                onClick={() => removeOption(index)}
                                                title="Remove Option"
                                            >
                                                ×
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <Button type="submit" disabled={loading}>
                                {loading ? "Creating Poll..." : "Create Poll"}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

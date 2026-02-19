"use client";

import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

type PriorityStatus = "Urgent" | "Normal";

const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    email: "",
    priority: "Normal" as PriorityStatus,
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_API}/contact/create-contact`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      if (!res.ok) throw new Error("Failed to send message");

      setSuccess("Message sent successfully. We will get back to you soon.");
      setFormData({ title: "", email: "", priority: "Normal", message: "" });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border rounded-2xl p-6 space-y-4 shadow-sm">
      <h2 className="text-2xl font-semibold">Send Your Message</h2>

      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
        placeholder="Subject"
        className="w-full rounded-lg border px-4 py-3"
      />

      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        placeholder="you@example.com"
        className="w-full rounded-lg border px-4 py-3"
      />

      <select
        name="priority"
        value={formData.priority}
        onChange={handleChange}
        className="w-full rounded-lg border px-4 py-3"
      >
        <option value="Normal">Normal</option>
        <option value="Urgent">Urgent</option>
      </select>

      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        rows={5}
        required
        placeholder="Write your message"
        className="w-full rounded-lg border px-4 py-3"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-700">{success}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-primary text-white py-3 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <FaPaperPlane />
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
};

export default ContactForm;

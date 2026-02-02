/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
// ContactForm component with enhanced UI
"use client";

import { useState } from "react";
import { FaPaperPlane, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

type PriorityStatus = "Urgent" | "Normal";

const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    email: "",
    priority: "Normal",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    
    const api = process.env.NEXT_PUBLIC_BACKEND_BASE_API;
    console.log("API Endpoint:", api);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_API}/contact/create-contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error("Failed to send message");

      setSuccess("🎉 Message sent successfully! We'll get back to you soon.");
      setFormData({
        title: "",
        email: "",
        priority: "Normal",
        message: "",
      });
    } catch {
      setError("⚠️ Something went wrong. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form
        onSubmit={handleSubmit}
        className="
          relative
          bg-linear-to-br from-white/90 to-base-100/90 dark:from-base-200/90 dark:to-base-300/90
          backdrop-blur-xl
          border-2 border-white/20
          p-8 md:p-10 rounded-3xl
          shadow-2xl
          space-y-8
          hover:shadow-3xl transition-shadow duration-300
        "
      >
        {/* Form Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-r from-primary to-secondary mb-4">
            <FaPaperPlane className="text-2xl text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
            Send Your Message
          </h2>
          <p className="text-base-content/70 mt-2">
            Fill in the details below and we'll respond promptly
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Title Field */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              What can we help you with?
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Brief summary of your request"
              className="
                mt-2 w-full rounded-xl
                border-2 border-base-300/50
                bg-white/50 dark:bg-base-200/50
                px-5 py-4
                focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
                transition-all duration-300
                placeholder:text-base-content/40
              "
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="text-sm font-semibold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-secondary rounded-full"></span>
              Your Email
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@company.com"
              className="
                mt-2 w-full rounded-xl
                border-2 border-base-300/50
                bg-white/50 dark:bg-base-200/50
                px-5 py-4
                focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/20
                transition-all duration-300
              "
            />
          </div>

          {/* Priority Field */}
          <div>
            <label className="text-sm font-semibold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-accent rounded-full"></span>
              Priority Level
            </label>
            <div className="relative">
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="
                  mt-2 w-full rounded-xl
                  border-2 border-base-300/50
                  bg-white/50 dark:bg-base-200/50
                  px-5 py-4
                  focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/20
                  appearance-none
                  transition-all duration-300
                "
              >
                <option value="Normal">📋 Normal Priority</option>
                <option value="Urgent">🚨 Urgent - Need immediate attention</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {formData.priority === "Urgent" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-2 p-3 bg-error/10 border border-error/20 rounded-lg"
              >
                <p className="text-error text-sm flex items-center gap-2">
                  <FaExclamationTriangle /> Urgent requests get top priority
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Message Field */}
        <div>
          <label className="text-sm font-semibold mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            Your Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            required
            placeholder="Please provide detailed information about your request..."
            className="
              mt-2 w-full rounded-xl
              border-2 border-base-300/50
              bg-white/50 dark:bg-base-200/50
              px-5 py-4
              focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20
              transition-all duration-300
              resize-none
            "
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-base-content/50">
              Be as detailed as possible for better assistance
            </span>
            <span className={`text-xs ${formData.message.length > 500 ? 'text-error' : 'text-base-content/50'}`}>
              {formData.message.length}/1000
            </span>
          </div>
        </div>

        {/* Status Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 bg-error/10 border border-error/30 rounded-xl"
            >
              <p className="text-error flex items-center gap-2">
                <FaExclamationTriangle /> {error}
              </p>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 bg-success/10 border border-success/30 rounded-xl"
            >
              <p className="text-success flex items-center gap-2">
                <FaCheckCircle /> {success}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full rounded-xl
            bg-linear-to-r from-primary via-primary/90 to-secondary
            text-white
            py-4 px-6
            font-bold text-lg
            hover:shadow-xl
            hover:scale-[1.02]
            active:scale-[0.98]
            transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
            relative overflow-hidden group
          "
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Sending Your Message...
              </>
            ) : (
              <>
                <FaPaperPlane className="group-hover:translate-x-1 transition-transform" />
                Send Message
              </>
            )}
          </span>
          <div className="absolute inset-0 bg-linear-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>

        {/* Privacy Note */}
        <p className="text-center text-xs text-base-content/50 pt-4 border-t border-base-300/50">
          Your information is secure. We respect your privacy and never share your data.
        </p>
      </form>
    </motion.div>
  );
};

export default ContactForm;
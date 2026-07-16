"use client";

import React, { useState } from "react";

type FormType = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function Support() {
  const [form, setForm] = useState<FormType>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
    alert("Message sent successfully!");
  };

  return (
    <section className="min-h-screen bg-white px-4 py-10">
      {/* HEADER */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-4xl font-bold text-gray-900">
          We’re here to help
        </h1>
        <p className="text-gray-500 mt-3">
          Have a question or need assistance? Send us a message and
          we’ll get back to you as soon as possible.
        </p>
      </div>

      {/* FORM CARD */}
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Send us a message
        </h2>

        <p className="text-gray-500 mb-6">
          Fill out the form below and we’ll respond shortly
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* NAME + EMAIL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm text-gray-600">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full mt-2 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@example.com"
                className="w-full mt-2 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
          </div>

          {/* SUBJECT */}
          <div>
            <label className="text-sm text-gray-600">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="What is this regarding?"
              className="w-full mt-2 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          {/* MESSAGE */}
          <div>
            <label className="text-sm text-gray-600">
              Message
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              placeholder="Tell us more about your issue..."
              className="w-full mt-2 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-black text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-900 transition"
          >
            <span>✈</span> Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
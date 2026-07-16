"use client";

import { useState } from "react";
import { Mail, Clock, Phone } from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";

import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { usePostSupportMessageMutation } from "../../api/support/supportApi";
import { errorMessage } from "../../lib/error/errorMsg";
import { toast } from "sonner";

const Support = () => {

    // FORM STATE
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    // ERROR STATE
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    // HANDLE INPUT CHANGE
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // REMOVE ERROR WHEN USER TYPES
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    // EMAIL VALIDATION
    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // FORM VALIDATION
    const validateForm = () => {
        const newErrors = {
            name: "",
            email: "",
            subject: "",
            message: "",
        };

        let isValid = true;

        // NAME
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
            isValid = false;
        }

        // EMAIL
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "Enter a valid email";
            isValid = false;
        }

        // SUBJECT
        if (!formData.subject.trim()) {
            newErrors.subject = "Subject is required";
            isValid = false;
        }

        // MESSAGE
        if (!formData.message.trim()) {
            newErrors.message = "Message is required";
            isValid = false;
        }

        setErrors(newErrors);

        return isValid;
    };

    const [postSupportMessage, { isLoading }] = usePostSupportMessageMutation();

    // SUBMIT FORM
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const res = await postSupportMessage(formData).unwrap();
            if (res) {
                // RESET FORM
                setFormData({
                    name: "",
                    email: "",
                    subject: "",
                    message: "",
                });

                return toast.success("Message sent successfully!");
            }
        } catch (error) {
            return errorMessage(error);
        }


        // alert("Message sent successfully!");
    };

    return (
        <div className="max-w-6xl mx-auto px-5 py-16 mt-10">

            {/* HEADER */}
            <div className="text-center mb-14">
                <h1 className="text-4xl font-bold text-gray-900">
                    We’re here to help
                </h1>

                <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
                    Have a question or need assistance? Send us a message and
                    we’ll respond as soon as possible.
                </p>
            </div>

            {/* MAIN GRID */}
            <div className="grid lg:grid-cols-2 gap-10">

                {/* LEFT SIDE */}
                <div className="space-y-6">

                    {/* EMAIL */}
                    <Card className="p-6 rounded-2xl shadow-sm hover:shadow-md transition">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-gray-100">
                                <Mail className="w-6 h-6 text-gray-700" />
                            </div>

                            <div>
                                <CardTitle>Email Support</CardTitle>

                                <CardDescription>
                                    support@example.com
                                </CardDescription>
                            </div>
                        </div>
                    </Card>

                    {/* PHONE */}
                    <Card className="p-6 rounded-2xl shadow-sm hover:shadow-md transition">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-gray-100">
                                <Phone className="w-6 h-6 text-gray-700" />
                            </div>

                            <div>
                                <CardTitle>Phone Support</CardTitle>

                                <CardDescription>
                                    +880 1234-567890
                                </CardDescription>
                            </div>
                        </div>
                    </Card>

                    {/* HOURS */}
                    <Card className="p-6 rounded-2xl shadow-sm hover:shadow-md transition">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-gray-100">
                                <Clock className="w-6 h-6 text-gray-700" />
                            </div>

                            <div>
                                <CardTitle>Working Hours</CardTitle>

                                <CardDescription>
                                    Mon - Fri (9 AM - 6 PM)
                                </CardDescription>
                            </div>
                        </div>
                    </Card>

                </div>

                {/* RIGHT SIDE FORM */}
                <Card className="p-8 rounded-2xl shadow-sm">
                    <CardHeader className="p-0 mb-6">
                        <CardTitle className="text-2xl">
                            Send us a message
                        </CardTitle>

                        <CardDescription>
                            Fill the form and our team will respond shortly
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-0">

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* NAME + EMAIL */}
                            <div className="grid md:grid-cols-2 gap-4">

                                {/* NAME */}
                                <div>
                                    <Input
                                        name="name"
                                        placeholder="Your name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />

                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* EMAIL */}
                                <div>
                                    <Input
                                        type="email"
                                        name="email"
                                        placeholder="Your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />

                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* SUBJECT */}
                            <div>
                                <Input
                                    name="subject"
                                    placeholder="Subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                />

                                {errors.subject && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.subject}
                                    </p>
                                )}
                            </div>

                            {/* MESSAGE */}
                            <div>
                                <Textarea
                                    name="message"
                                    placeholder="Write your message..."
                                    className="min-h-[140px]"
                                    value={formData.message}
                                    onChange={handleChange}
                                />

                                {errors.message && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.message}
                                    </p>
                                )}
                            </div>

                            {/* BUTTON */}
                            <Button
                                type="submit"
                                className="w-full py-3 text-white font-semibold bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] rounded-xl"
                            >
                                {
                                    isLoading ? "Sending..." : "Send Message"
                                }
                            </Button>

                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Support;
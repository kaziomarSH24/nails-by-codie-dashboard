"use client";
import React, { useState, FormEvent } from "react";
import { Editor } from "primereact/editor";
import type { EditorTextChangeEvent } from "primereact/editor";
import { Button } from "primereact/button";


const TermCondiction: React.FC = () => {
    const [content, setContent] = useState<string>("");

    const handleEditorChange = (e: EditorTextChangeEvent) => {
        setContent(e.htmlValue || "");
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!content.trim()) {
            // toast.error("Terms & Conditions cannot be empty ❌");
            return;
        }

        // toast.success("Terms & Conditions saved ✅");
        console.log("Saved content:", content);
    };

    return (
        <div className="pb-10 pt-4 px-6 rounded-[14px] bg-white ">
            <h1 className="text-[#10101E] font-bold text-4xl">Terms & Conditions</h1>
            <p className="mt-3.5 text-gray-500">Admin can edit disclaimer</p>

            <form onSubmit={handleSubmit} className="mx-auto mt-6 space-y-6">
                {/* PrimeReact Editor */}
                <Editor
                    value={content}
                    onTextChange={handleEditorChange}
                    style={{ height: "400px" }}
                    placeholder="Write your Terms & Conditions..."
                />

                {/* Submit Button */}
                <div className="flex justify-end gap-4 mt-16">
                    <button
                        className="w-full ptext-center  py-3 rounded-lg text-white font-bold bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] transition-colors duration-200 shadow-md"
                    >
                        Update
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TermCondiction;

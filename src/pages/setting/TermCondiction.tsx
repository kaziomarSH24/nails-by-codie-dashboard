"use client";
import React, { useState, useEffect, type FormEvent } from "react";
import { Editor } from "primereact/editor";
import type { EditorTextChangeEvent } from "primereact/editor";
import { useCreateTermCondictionMutation, useGetTermValueQuery } from "../../api/term-condiction-api/termCondiction";
import { errorMessage } from "../../lib/error/errorMsg";
import { Spinner } from "../../components/ui/spinner";
import { toast } from "sonner";

const TermCondiction: React.FC = () => {
    const [content, setContent] = useState<string>("");

    const { data, isLoading: isFetching } = useGetTermValueQuery({});

    const [createTermCondiction, { isLoading }] = useCreateTermCondictionMutation();

    // Set default content when data is loaded
    useEffect(() => {
        if (data?.data) {
            setContent(data?.data);
        }
    }, [data]);

    const handleEditorChange = (e: EditorTextChangeEvent) => {
        setContent(e.htmlValue || "");
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            content: content
        };

        try {
            const res = await createTermCondiction(payload).unwrap();
            if (res) {
                toast.success(res?.message);
            }
        } catch (error) {
            errorMessage(error);
        }
    };

    if (isFetching) {
        return (
            <div className="flex justify-center items-center h-96">
                <Spinner />
            </div>
        );
    }

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
                        type="submit"
                        className="w-full text-center py-3 rounded-lg text-white font-bold bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] transition-colors duration-200 shadow-md"
                    >
                        {isLoading ? (
                            <div className="flex justify-center">
                                <Spinner />
                            </div>
                        ) : (
                            <>Update</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TermCondiction;

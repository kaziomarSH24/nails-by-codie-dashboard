"use client";
import React, { useEffect, useState } from "react";
import { Editor } from "primereact/editor";
import type { EditorTextChangeEvent } from "primereact/editor";
import { Button } from "primereact/button";
import { errorMessage } from "../../lib/error/errorMsg";
import { useAllFaqQuery, useCreateFaqMutation, useFaqDeleteMutation, useFaqUpdateMutation } from "../../api/faq-api/faqApi";
import { toast } from "sonner";
import type { FAQTYPE } from "../../lib/type/faqType";
import DOMPurify from "dompurify";
import { deleteAlert } from "../../lib/alert/deleteAlert";
import { Spinner } from "../../components/ui/spinner";
import { courseUpdateAlert } from "../../lib/alert/courseUpdateAlert";

const Faq: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    // ========================  Create faq =======================

    const [createFaq, { isLoading }] = useCreateFaqMutation();

    const handleSave = async () => {
        try {


            const payload = {
                question: question,
                answer: answer,
                is_active: 1
            }

            const res = await createFaq(payload).unwrap();
            if (res) {
                setIsModalOpen(false);
                setQuestion("");
                setAnswer("");
                toast.success(res?.message)
            }
        } catch (error) {
            return errorMessage(error);
        }
    };


    // ========================== All faq ============================


    const { data } = useAllFaqQuery({});

    const faqData: FAQTYPE[] = data?.data?.data || []




    // =============================FAQ delete ============================

    const [faqDelete] = useFaqDeleteMutation();

    const handleFaqdelete = async (id: number) => {
        try {

            const res = await deleteAlert();

            if (res.isConfirmed) {
                const res = await faqDelete(id).unwrap();
                if (res) {
                    toast.success(res?.message);
                }
            }

        } catch (error) {
            return errorMessage(error)
        }
    }

    // ============================ faq update ========================

    const [selectedItem, setSelectedItem] = useState<FAQTYPE | null>(null);

    const [faqUpdate, { isLoading: uploadLoading }] = useFaqUpdateMutation();


    const [updateQuestion, setUpdateQuestion] = useState<string>();
    const [updateAnser, setUpdateAnser] = useState<string>();



    useEffect(() => {
        if (selectedItem) {
            setUpdateQuestion(selectedItem.question)
            setUpdateAnser(selectedItem.answer)
        }
    }, [selectedItem])

    const payload = {
        question: updateQuestion,
        answer: updateAnser,
        is_active: 1
    }




    const handleUpdateFaq = async () => {
        try {
            const id = selectedItem?.id
            const res = await courseUpdateAlert()
            if (res.isConfirmed) {
                const res = await faqUpdate({ id, payload }).unwrap();
                if (res) {
                    setUpdateModal(false)
                    toast.success(res?.message);
                }
            }

        } catch (error) {
            return errorMessage(error)
        }
    }



    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">FAQ Management</h1>
                <Button
                    onClick={() => setIsModalOpen(true)}
                >
                    <svg width="193" height="46" viewBox="0 0 193 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="192" height="45" rx="22.5" fill="url(#paint0_linear_50_2747)" />
                        <rect x="0.5" y="0.5" width="192" height="45" rx="22.5" stroke="#D09A40" />
                        <path d="M39 23.998H34V28.998C34 29.2633 33.8946 29.5176 33.7071 29.7052C33.5196 29.8927 33.2652 29.998 33 29.998C32.7348 29.998 32.4804 29.8927 32.2929 29.7052C32.1054 29.5176 32 29.2633 32 28.998V23.998H27C26.7348 23.998 26.4804 23.8927 26.2929 23.7052C26.1054 23.5176 26 23.2633 26 22.998C26 22.7328 26.1054 22.4785 26.2929 22.2909C26.4804 22.1034 26.7348 21.998 27 21.998H32V16.998C32 16.7328 32.1054 16.4785 32.2929 16.2909C32.4804 16.1034 32.7348 15.998 33 15.998C33.2652 15.998 33.5196 16.1034 33.7071 16.2909C33.8946 16.4785 34 16.7328 34 16.998V21.998H39C39.2652 21.998 39.5196 22.1034 39.7071 22.2909C39.8946 22.4785 40 22.7328 40 22.998C40 23.2633 39.8946 23.5176 39.7071 23.7052C39.5196 23.8927 39.2652 23.998 39 23.998Z" fill="white" />
                        <path d="M59.83 16.665H62.098L66.991 30H64.912L63.736 26.661H58.045L56.869 30H54.937L59.83 16.665ZM63.232 25.107L60.901 18.471L58.549 25.107H63.232ZM76.9105 16.245V30H75.2725L75.0415 28.488C74.7195 28.992 74.2855 29.405 73.7395 29.727C73.2075 30.035 72.5705 30.189 71.8285 30.189C71.0025 30.189 70.2745 29.972 69.6445 29.538C69.0145 29.104 68.5245 28.509 68.1745 27.753C67.8385 26.983 67.6705 26.115 67.6705 25.149C67.6705 24.183 67.8525 23.322 68.2165 22.566C68.5805 21.796 69.0845 21.194 69.7285 20.76C70.3865 20.326 71.1355 20.109 71.9755 20.109C72.5215 20.109 73.0045 20.207 73.4245 20.403C73.8445 20.585 74.1805 20.809 74.4325 21.075C74.6985 21.327 74.8945 21.586 75.0205 21.852V16.245H76.9105ZM72.3115 28.698C72.8575 28.698 73.3405 28.537 73.7605 28.215C74.1805 27.893 74.5025 27.466 74.7265 26.934C74.9645 26.388 75.0835 25.786 75.0835 25.128C75.0835 24.484 74.9715 23.896 74.7475 23.364C74.5375 22.818 74.2295 22.384 73.8235 22.062C73.4175 21.74 72.9415 21.579 72.3955 21.579C71.8355 21.579 71.3455 21.74 70.9255 22.062C70.5055 22.37 70.1765 22.797 69.9385 23.343C69.7145 23.889 69.6025 24.484 69.6025 25.128C69.6025 25.786 69.7075 26.388 69.9175 26.934C70.1415 27.466 70.4565 27.893 70.8625 28.215C71.2685 28.537 71.7515 28.698 72.3115 28.698ZM88.3949 16.245V30H86.7569L86.5259 28.488C86.2039 28.992 85.7699 29.405 85.2239 29.727C84.6919 30.035 84.0549 30.189 83.3129 30.189C82.4869 30.189 81.7589 29.972 81.1289 29.538C80.4989 29.104 80.0089 28.509 79.6589 27.753C79.3229 26.983 79.1549 26.115 79.1549 25.149C79.1549 24.183 79.3369 23.322 79.7009 22.566C80.0649 21.796 80.5689 21.194 81.2129 20.76C81.8709 20.326 82.6199 20.109 83.4599 20.109C84.0059 20.109 84.4889 20.207 84.9089 20.403C85.3289 20.585 85.6649 20.809 85.9169 21.075C86.1829 21.327 86.3789 21.586 86.5049 21.852V16.245H88.3949ZM83.7959 28.698C84.3419 28.698 84.8249 28.537 85.2449 28.215C85.6649 27.893 85.9869 27.466 86.2109 26.934C86.4489 26.388 86.5679 25.786 86.5679 25.128C86.5679 24.484 86.4559 23.896 86.2319 23.364C86.0219 22.818 85.7139 22.384 85.3079 22.062C84.9019 21.74 84.4259 21.579 83.8799 21.579C83.3199 21.579 82.8299 21.74 82.4099 22.062C81.9899 22.37 81.6609 22.797 81.4229 23.343C81.1989 23.889 81.0869 24.484 81.0869 25.128C81.0869 25.786 81.1919 26.388 81.4019 26.934C81.6259 27.466 81.9409 27.893 82.3469 28.215C82.7529 28.537 83.2359 28.698 83.7959 28.698ZM95.2972 16.665H97.4602L104.012 26.871V16.665H105.839V30H103.991L97.1032 19.29V30H95.2972V16.665ZM112.896 30.189C112 30.189 111.202 29.993 110.502 29.601C109.816 29.195 109.277 28.614 108.885 27.858C108.493 27.102 108.297 26.206 108.297 25.17C108.297 24.134 108.493 23.238 108.885 22.482C109.291 21.712 109.844 21.124 110.544 20.718C111.244 20.312 112.028 20.109 112.896 20.109C113.75 20.109 114.492 20.312 115.122 20.718C115.752 21.11 116.235 21.663 116.571 22.377C116.921 23.091 117.096 23.91 117.096 24.834V25.527H110.208C110.208 26.171 110.327 26.738 110.565 27.228C110.803 27.704 111.139 28.075 111.573 28.341C112.007 28.593 112.525 28.719 113.127 28.719C113.659 28.719 114.142 28.649 114.576 28.509C115.01 28.355 115.346 28.194 115.584 28.026C115.836 27.858 116.011 27.725 116.109 27.627L116.865 28.824C116.655 29.034 116.354 29.244 115.962 29.454C115.584 29.664 115.129 29.839 114.597 29.979C114.079 30.119 113.512 30.189 112.896 30.189ZM115.269 24.225C115.269 23.735 115.185 23.28 115.017 22.86C114.849 22.44 114.583 22.104 114.219 21.852C113.855 21.6 113.393 21.474 112.833 21.474C112.273 21.474 111.797 21.614 111.405 21.894C111.027 22.16 110.74 22.503 110.544 22.923C110.348 23.329 110.229 23.763 110.187 24.225H115.269ZM118.069 20.298H119.98L121.954 27.921L124.096 20.298H126.028L128.149 27.921L130.123 20.298H132.055L129.241 30H127.33L125.062 22.398L122.815 30H120.904L118.069 20.298ZM137.789 16.665H145.496V18.219H139.742V22.524H145.013V24.099H139.742V30H137.789V16.665ZM149.921 16.665H152.189L157.082 30H155.003L153.827 26.661H148.136L146.96 30H145.028L149.921 16.665ZM153.323 25.107L150.992 18.471L148.64 25.107H153.323ZM167.568 32.877C167.05 32.653 166.588 32.282 166.182 31.764C165.79 31.26 165.545 30.7 165.447 30.084C165.097 30.154 164.726 30.189 164.334 30.189C163.06 30.189 161.94 29.902 160.974 29.328C160.008 28.74 159.259 27.928 158.727 26.892C158.195 25.842 157.929 24.652 157.929 23.322C157.929 21.992 158.195 20.809 158.727 19.773C159.259 18.737 160.008 17.932 160.974 17.358C161.94 16.77 163.06 16.476 164.334 16.476C165.608 16.476 166.728 16.77 167.694 17.358C168.66 17.932 169.402 18.737 169.92 19.773C170.452 20.809 170.718 21.992 170.718 23.322C170.718 24.554 170.522 25.604 170.13 26.472C169.738 27.34 169.276 28.019 168.744 28.509C168.226 28.985 167.736 29.321 167.274 29.517C167.302 29.783 167.407 30.063 167.589 30.357C167.771 30.665 167.988 30.938 168.24 31.176C168.492 31.414 168.744 31.582 168.996 31.68L167.568 32.877ZM164.334 28.509C165.216 28.509 165.986 28.292 166.644 27.858C167.302 27.41 167.806 26.794 168.156 26.01C168.52 25.226 168.702 24.33 168.702 23.322C168.702 22.314 168.52 21.418 168.156 20.634C167.806 19.836 167.302 19.22 166.644 18.786C165.986 18.338 165.216 18.114 164.334 18.114C163.438 18.114 162.661 18.338 162.003 18.786C161.345 19.22 160.834 19.829 160.47 20.613C160.12 21.397 159.945 22.293 159.945 23.301C159.945 24.309 160.12 25.212 160.47 26.01C160.834 26.794 161.345 27.41 162.003 27.858C162.661 28.292 163.438 28.509 164.334 28.509Z" fill="white" />
                        <defs>
                            <linearGradient id="paint0_linear_50_2747" x1="90.4688" y1="-8.72414" x2="92.4706" y2="59.3814" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#F2DA87" />
                                <stop offset="0.5" stopColor="#91741A" />
                                <stop offset="1" stopColor="#F2DA87" />
                            </linearGradient>
                        </defs>
                    </svg>


                </Button>
            </div>


            <div className=" mt-10  px-6  py-3 bg-white " >
                {
                    faqData?.map((item, i) => {
                        return (
                            <div key={i} className=" flex shadow shadow-[#00000040] rounded-[4px] p-4  justify-between items-center my-8 " >
                                <div className="  " >
                                    <h1 className=" font-medium text-xl " >{item?.question}</h1>
                                    <p
                                        className="mt-3 text-lg"
                                        dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(item?.answer || ""),
                                        }}
                                    />
                                </div>
                                <div className=" flex items-center gap-x-5  " >
                                    {/* update <button></button> */}
                                    <span onClick={() => {
                                        setSelectedItem(item);
                                        setUpdateModal(true);
                                    }} className=" mt-1.5 cursor-pointer " >

                                        <svg width="21" height="24" viewBox="0 0 21 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.5163 0C11.8098 0.000325574 12.0921 0.11272 12.3056 0.31422C12.519 0.51572 12.6475 0.791115 12.6647 1.08414C12.6819 1.37716 12.5865 1.66569 12.3981 1.89078C12.2097 2.11587 11.9425 2.26053 11.651 2.2952L11.5163 2.30326H2.30326V18.4261H18.4261V9.21303C18.4264 8.91951 18.5388 8.63718 18.7403 8.42374C18.9418 8.21031 19.2172 8.08186 19.5102 8.06466C19.8032 8.04746 20.0918 8.14279 20.3168 8.33119C20.5419 8.51959 20.6866 8.78682 20.7213 9.07829L20.7293 9.21303V18.4261C20.7295 19.0072 20.51 19.5668 20.1149 19.9929C19.7198 20.419 19.1783 20.68 18.5988 20.7236L18.4261 20.7293H2.30326C1.72217 20.7295 1.16249 20.51 0.736412 20.1149C0.31033 19.7198 0.0493397 19.1783 0.00575839 18.5988L1.15472e-07 18.4261V2.30326C-0.000183776 1.72217 0.219278 1.16249 0.614391 0.736412C1.0095 0.31033 1.55107 0.0493396 2.13051 0.00575828L2.30326 0H11.5163ZM18.7059 0.395009C18.9132 0.188466 19.1912 0.0685524 19.4837 0.059622C19.7762 0.0506916 20.0611 0.153414 20.2805 0.346927C20.5 0.540439 20.6375 0.810231 20.6653 1.1015C20.693 1.39278 20.6089 1.68369 20.4299 1.91516L20.3343 2.02456L8.93319 13.4245C8.72594 13.6311 8.44785 13.751 8.1554 13.7599C7.86294 13.7689 7.57805 13.6661 7.35859 13.4726C7.13913 13.2791 7.00155 13.0093 6.97381 12.718C6.94606 12.4268 7.03022 12.1359 7.2092 11.9044L7.30478 11.7961L18.7059 0.395009Z" fill="#686868" />
                                        </svg>
                                    </span>
                                    <span onClick={() => handleFaqdelete(item?.id)} className=" cursor-pointer " >
                                        <svg width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1.15163 20.7293V3.45489H0V1.15163H5.75815V0H12.6679V1.15163H18.4261V3.45489H17.2744V20.7293H1.15163ZM3.45489 18.4261H14.9712V3.45489H3.45489V18.4261ZM5.75815 16.1228H8.06141V5.75815H5.75815V16.1228ZM10.3647 16.1228H12.6679V5.75815H10.3647V16.1228Z" fill="#686868" />
                                        </svg>

                                    </span>
                                </div>
                            </div>
                        )
                    })
                }
            </div>


            {/* create modal  */}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-full max-w-2xl p-6 rounded-lg relative">
                        <h2 className="text-2xl font-bold mb-4">Add Question & Answer</h2>

                        {/* Question Input */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">
                                Question
                            </label>
                            <input
                                type="text"
                                className="w-full border rounded px-3 py-2 focus:outline-0 "
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Enter your question"
                            />
                        </div>

                        {/* Answer Editor */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">
                                Answer
                            </label>
                            <Editor
                                value={answer}
                                onTextChange={(e: EditorTextChangeEvent) =>
                                    setAnswer(e.htmlValue || "")
                                }
                                style={{ height: "200px" }}
                                placeholder="Write the answer here..."
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-4 mt-4">
                            <Button
                                label="Cancel"
                                className="font-bold text-gray-700"
                                onClick={() => setIsModalOpen(false)}
                            />
                            <Button

                                className="py-3 rounded-lg px-7  font-bold bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] transition-colors duration-200 shadow-md text-white"
                                onClick={handleSave}
                            >
                                {isLoading ? <div className=" flex justify-center  " ><Spinner /> </div> : "Save"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* update modal  */}


            {updateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-full max-w-2xl p-6 rounded-lg relative">
                        <h2 className="text-2xl font-bold mb-4">Add Question & Answer</h2>

                        {/* Question Input */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">
                                Question
                            </label>
                            <input
                                type="text"
                                className="w-full border rounded px-3 py-2 focus:outline-0 "
                                value={updateQuestion}
                                onChange={(e) => setUpdateQuestion(e.target.value)}
                                placeholder="Enter your question"
                            />
                        </div>

                        {/* Answer Editor */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">
                                Answer
                            </label>
                            <Editor
                                value={updateAnser}
                                onTextChange={(e: EditorTextChangeEvent) =>
                                    setUpdateAnser(e.htmlValue || "")
                                }
                                style={{ height: "200px" }}
                                placeholder="Write the answer here..."
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-4 mt-4">
                            <Button
                                label="Cancel"
                                className="font-bold text-gray-700"
                                onClick={() => setUpdateModal(false)}
                            />
                            <Button

                                className="py-3 rounded-lg px-7  font-bold bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] transition-colors duration-200 shadow-md text-white"
                                onClick={handleUpdateFaq}
                            >
                                {
                                    uploadLoading ? <div className="flex justify-center" ><Spinner></Spinner></div> : "Update"
                                }
                            </Button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default Faq;


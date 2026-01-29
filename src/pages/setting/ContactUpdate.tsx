// "use client";

// import { useEffect, useState } from "react";
// import { Label } from "../../components/ui/label";
// import { Input } from "../../components/ui/input";
// import { errorMessage } from "../../lib/error/errorMsg";
// import { Spinner } from "../../components/ui/spinner";
// import { toast } from "sonner";

// /* ===================== TYPES ===================== */

// export interface ContactData {
//     id: string;
//     platform: string;
//     url: string;
//     icon?: string;
// }

// interface ContactUpdateFormProps {
//     setUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
//     data: ContactData; // required (update only)
// }

// /* ===================== COMPONENT ===================== */

// export default function ContactUpdate({
//     setUpdateModal,
//     data,
// }: ContactUpdateFormProps) {
//     const [platformName, setPlatformName] = useState("");
//     const [platformLink, setPlatformLink] = useState("");
//     const [thumbnail, setThumbnail] = useState<File | null>(null);
//     const [preview, setPreview] = useState<string | null>(null);


//     /* ===================== PREFILL ===================== */

//     useEffect(() => {
//         setPlatformName(data.platform);
//         setPlatformLink(data.url);
//         setPreview(data.icon ?? null);
//         setThumbnail(null);
//     }, [data]);

//     /* ===================== FILE HANDLER ===================== */

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (!file) return;

//         setThumbnail(file);
//         setPreview(URL.createObjectURL(file));
//     };

//     /* ===================== SUBMIT ===================== */

//     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();

//         const formData = new FormData();
//         formData.append("platform", platformName); // optional if backend needs
//         formData.append("url", platformLink);

//         if (thumbnail) {
//             formData.append("icon", thumbnail);
//         }

//         try {
//             const res = await contactUpdate({
//                 id: data.id,
//                 formData,
//             }).unwrap();

//             toast.success(res.message);
//             setUpdateModal(false);
//         } catch (error) {
//             errorMessage(error);
//         }
//     };

//     /* ===================== UI ===================== */

//     return (
//         <div>
//             <h2 className="text-xl text-[#3A3734] font-medium mb-6 text-center">
//                 Update Platform
//             </h2>

//             <form onSubmit={handleSubmit}>
//                 {/* ICON */}
//                 <div className="mb-4">
//                     <Label>Platform Icon</Label>

//                     <label className="mt-2 relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 overflow-hidden">
//                         {preview ? (
//                             <img
//                                 src={preview}
//                                 alt="Preview"
//                                 className="absolute inset-0 w-full h-full object-cover"
//                             />
//                         ) : (
//                             <span className="text-sm text-gray-400">
//                                 Click to upload icon
//                             </span>
//                         )}

//                         <input
//                             type="file"
//                             accept="image/png, image/jpeg, image/gif"
//                             className="hidden"
//                             onChange={handleFileChange}
//                         />
//                     </label>
//                 </div>

//                 {/* PLATFORM NAME (LOCKED) */}
//                 <div className="mb-4">
//                     <Label>Name</Label>
//                     <Input value={platformName} disabled />
//                 </div>

//                 {/* PLATFORM LINK */}
//                 <div className="mb-6">
//                     <Label>Platform Link / Number</Label>
//                     <Input
//                         type="url"
//                         value={platformLink}
//                         required
//                         onChange={(e) => setPlatformLink(e.target.value)}
//                     />
//                 </div>

//                 {/* SUBMIT */}
//                 <button
//                     disabled={isLoading}
//                     className="w-full py-3 rounded-lg text-white font-bold bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] mt-10"
//                 >
//                     {isLoading ? (
//                         <div className="flex justify-center">
//                             <Spinner />
//                         </div>
//                     ) : (
//                         "Update"
//                     )}
//                 </button>
//             </form>
//         </div>
//     );
// }

const ContactUpdate = () => {
    return (
        <div>ContactUpdate</div>
    )
}

export default ContactUpdate
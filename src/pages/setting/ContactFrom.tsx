

import { useState } from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";


export default function ContactFrom() {
    const [platformName, setPlatformName] = useState("");
    const [platformLink, setPlatformLink] = useState("");
    const [thumbnail, setThumbnail] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setThumbnail(e.target.files[0]);
        } else {
            setThumbnail(null);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log({ platformName, platformLink, thumbnail });
        // Add your submit logic here
    };

    return (
        <div >
            <h2 className="text-xl text-[#3A3734] font-medium mb-6 text-center">Add New Platform</h2>

            <form onSubmit={handleSubmit}  >
                {/* Course Thumbnail */}
                <div className="mb-4">
                    <Label>Course Thumbnail</Label>
                    <label className="mt-2 flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                        <svg width="88" height="66" viewBox="0 0 88 66" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M46.875 65.625V46.875H59.375L43.75 28.125L28.125 46.875H40.625V65.625H25V65.4688C24.475 65.5 23.975 65.625 23.4375 65.625C17.2215 65.625 11.2601 63.1557 6.86469 58.7603C2.4693 54.3649 0 48.4035 0 42.1875C0 30.1625 9.09375 20.3625 20.7625 19.0188C21.7856 13.6706 24.6403 8.8461 28.8357 5.37504C33.0311 1.90398 38.3049 0.00333761 43.75 0C49.1959 0.00301039 54.4706 1.9034 58.667 5.37439C62.8635 8.84538 65.7194 13.6701 66.7438 19.0188C78.4125 20.3625 87.4938 30.1625 87.4938 42.1875C87.4938 48.4035 85.0245 54.3649 80.6291 58.7603C76.2337 63.1557 70.2723 65.625 64.0563 65.625C63.5313 65.625 63.025 65.5 62.4938 65.4688V65.625H46.875Z" fill="#B9B9B9" />
                        </svg>

                        <span className="mt-2 text-lg text-[#989898] font-medium ">
                            Click to upload or drag and drop
                        </span>
                        <span className="text-xs text-[#989898]">PNG, JPG, GIF up to 5MB</span>
                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/gif"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>
                </div>

                {/* Name */}
                <div className="mb-4">
                    <Label>Name</Label>
                    <Input
                        placeholder="Enter Platform Name"
                        value={platformName}
                        onChange={(e) => setPlatformName(e.target.value)}
                    />
                </div>

                {/* Platform Link/Number */}
                <div className="mb-6">
                    <Label>Platform Link/Number</Label>
                    <Input
                        placeholder="Enter Platform link"
                        value={platformLink}
                        onChange={(e) => setPlatformLink(e.target.value)}
                    />
                </div>

                {/* Add Button */}
                <button
                    className=" block mx-auto "
                >
                    <svg width="400" height="56" viewBox="0 0 400 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="400" height="56" rx="11" fill="url(#paint0_linear_88_3699)" />
                        <path d="M187.328 34.125C186.805 34.125 186.453 33.8047 186.453 33.3281C186.453 33.1953 186.484 33.0234 186.562 32.8125L189.992 23.5156C190.219 22.8906 190.602 22.6016 191.219 22.6016C191.828 22.6016 192.203 22.8828 192.438 23.5078L195.875 32.8125C195.953 33.0312 195.984 33.1797 195.984 33.3281C195.984 33.7891 195.617 34.125 195.109 34.125C194.641 34.125 194.383 33.9062 194.227 33.4062L193.367 30.9766H189.055L188.203 33.3984C188.039 33.9062 187.781 34.125 187.328 34.125ZM189.5 29.5469H192.922L191.227 24.6016H191.18L189.5 29.5469ZM200.141 34.1406C198.062 34.1406 196.688 32.4844 196.688 29.8906C196.688 27.2969 198.062 25.6484 200.125 25.6484C201.305 25.6484 202.242 26.2422 202.703 27.1484H202.734V23.4688C202.734 22.9141 203.086 22.5781 203.586 22.5781C204.078 22.5781 204.43 22.9141 204.43 23.4688V33.3047C204.43 33.8359 204.086 34.1484 203.594 34.1484C203.117 34.1484 202.734 33.8359 202.734 33.3047V32.5391H202.711C202.289 33.5 201.422 34.1406 200.141 34.1406ZM200.586 32.7109C201.883 32.7109 202.75 31.6094 202.75 29.8906C202.75 28.1875 201.883 27.0703 200.586 27.0703C199.25 27.0703 198.414 28.1641 198.414 29.8906C198.414 31.625 199.25 32.7109 200.586 32.7109ZM209.25 34.1406C207.172 34.1406 205.797 32.4844 205.797 29.8906C205.797 27.2969 207.172 25.6484 209.234 25.6484C210.414 25.6484 211.352 26.2422 211.812 27.1484H211.844V23.4688C211.844 22.9141 212.195 22.5781 212.695 22.5781C213.188 22.5781 213.539 22.9141 213.539 23.4688V33.3047C213.539 33.8359 213.195 34.1484 212.703 34.1484C212.227 34.1484 211.844 33.8359 211.844 33.3047V32.5391H211.82C211.398 33.5 210.531 34.1406 209.25 34.1406ZM209.695 32.7109C210.992 32.7109 211.859 31.6094 211.859 29.8906C211.859 28.1875 210.992 27.0703 209.695 27.0703C208.359 27.0703 207.523 28.1641 207.523 29.8906C207.523 31.625 208.359 32.7109 209.695 32.7109Z" fill="black" />
                        <defs>
                            <linearGradient id="paint0_linear_88_3699" x1="194.471" y1="-21.7698" x2="193.556" y2="78.823" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#C9A227" />
                                <stop offset="0.5" stop-color="#F2DA87" />
                                <stop offset="1" stop-color="#C9A227" />
                            </linearGradient>
                        </defs>
                    </svg>

                </button>
            </form>
        </div>
    );
}

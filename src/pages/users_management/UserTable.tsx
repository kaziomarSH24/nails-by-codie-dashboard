"use client";

import { useState } from "react";
import { Search, RefreshCw } from "lucide-react";

import { Input } from "../../components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import UserDetails from "./UserDetails";
import { useAllUsersQuery } from "../../api/user-api/userApi";
import type { User } from "../../lib/type/userType";

const ITEMS_PER_PAGE = 15;

const UserTable = () => {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const { data, isLoading } = useAllUsersQuery({});

    const usersData: User[] = data?.data || [];

    /* ---------------- SEARCH ---------------- */
    const filteredUsers: User[] = usersData.filter(
        (user) =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            user.phone.toLowerCase().includes(search.toLowerCase())
    );

    /* ---------------- PAGINATION ---------------- */
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    /* -------- Pagination Range (1,2,3,... style) -------- */
    const getPaginationRange = () => {
        const totalNumbers = 5;

        if (totalPages <= totalNumbers) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);

        const pages: (number | string)[] = [1];

        if (startPage > 2) pages.push("...");

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (endPage < totalPages - 1) pages.push("...");

        pages.push(totalPages);

        return pages;
    };


    const [id, setId] = useState<number>();




    if (isLoading) {
        return <div className="p-10 text-center">Loading users...</div>;
    }

    return (
        <div className="shadow shadow-[#00000033] rounded-[14px] bg-white px-7 py-9">
            <h1 className="text-3xl font-medium mb-9">All Users</h1>

            {/* Search */}
            <div className="relative w-[80%] mb-5">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                    className="pl-10"
                    placeholder="Search by name, email, or phone"
                    value={search}
                    onChange={handleSearch}
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full table-auto rounded-lg">
                    <thead className="bg-[#E9E9E9] text-xs text-[#686868]">
                        <tr>
                            <th className="px-4 py-3 text-start">Name</th>
                            <th className="px-4 py-3 text-center">Email</th>
                            <th className="px-4 py-3 text-center">Phone</th>
                            <th className="px-4 py-3 text-center">Status</th>
                            <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedUsers.map((user) => (
                            <tr key={user.id} className="border-b text-xs hover:bg-gray-50">
                                <td className="px-4 py-2 flex items-center gap-2">
                                    <img src={user?.avatar ? user?.avatar : "/images/logo/user.png"} alt="" />
                                    {user.name}
                                </td>

                                <td className="px-4 py-2 text-center">{user.email}</td>
                                <td className="px-4 py-2 text-center">{user.phone}</td>

                                <td className="px-4 py-2 text-center">
                                    <span
                                        className={`px-3 py-1 rounded text-xs ${user.status === "active"
                                            ? "bg-[#EAF6EC] text-[#24983F]"
                                            : user.status === "inactive"
                                                ? "bg-[#F5F6EA] text-[#988E24]"
                                                : "bg-[#F6EAEA] text-[#982424]"
                                            }`}
                                    >
                                        {user.status}
                                    </span>
                                </td>

                                <td className="px-4 py-2 flex justify-center gap-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                onClick={() => setId(user?.id)}
                                            >
                                                View
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl">
                                            {id && <UserDetails id={id} />}
                                        </DialogContent>
                                    </Dialog>

                                    <Button variant="outline">
                                        <RefreshCw size={16} />
                                    </Button>
                                </td>
                            </tr>
                        ))}

                        {paginatedUsers.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-6 text-center text-gray-500">
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-end items-center gap-2 mt-6 flex-wrap">
                    <Button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                    >
                        Prev
                    </Button>

                    {getPaginationRange().map((page, index) =>
                        page === "..." ? (
                            <span key={index} className="px-2 text-gray-500">
                                ...
                            </span>
                        ) : (
                            <Button
                                key={page}
                                className={
                                    currentPage === page
                                        ? "bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] text-white"
                                        : ""
                                }
                                onClick={() => setCurrentPage(page as number)}
                            >
                                {page}
                            </Button>
                        )
                    )}

                    <Button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
};

export default UserTable;

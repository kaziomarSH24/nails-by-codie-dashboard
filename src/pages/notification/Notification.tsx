import React, { useState } from 'react'
import {
    useAllNotificationQuery,
    useDeleteNotificationMutation,
    useReadAllNotificationMutation,
    useReadSingleNotificationMutation
} from '../../api/notification/notificationApi'
import type { Notification } from '../../lib/type/notificationType';
import { FaRegTrashAlt } from "react-icons/fa";
import { errorMessage } from '../../lib/error/errorMsg';
import { deleteAlert } from '../../lib/alert/deleteAlert';
import { toast } from 'sonner';
import { readAlert } from '../../lib/alert/readAlert';
import { Link } from 'react-router-dom';

const NotificationComponent: React.FC = () => {
    const [page, setPage] = useState(1);
    const perPage = 10; // change this if needed


    const {
        data,
        refetch
    } = useAllNotificationQuery({
        page,
        per_page: perPage
    });

    const [deleteNotification] = useDeleteNotificationMutation();

    const notificationData: Notification[] = data?.data || [];

    // ✅ Correct meta access (important)
    const currentPage = data?.meta?.current_page || 1;
    const totalPages = data?.meta?.last_page || 1;

    // ========================= DELETE HANDLER =========================
    const handleDeleteNotification = async (id: string) => {
        try {
            const confirm = await deleteAlert();

            if (confirm.isConfirmed) {
                const res = await deleteNotification(id).unwrap();
                toast.success(res?.message || "Notification deleted");

                // If last item on page deleted → go back one page
                if (notificationData.length === 1 && page > 1) {
                    setPage(prev => prev - 1);
                } else {
                    refetch();
                }
            }

        } catch (error) {
            errorMessage(error);
        }
    };


    // ==================================== All Notification Read  =========================================

    const [readAllNotification] = useReadAllNotificationMutation();

    const handleReadAllNotification = async () => {
        try {
            const res = await readAlert();
            if (res.isConfirmed) {
                const res = await readAllNotification({}).unwrap();
                if (res) {
                    toast.success(res?.message)
                }
            }
        } catch (error) {
            return errorMessage(error)
        }
    };


    // =========================================== Read Single Notification ======================================

    const [readSingleNotification] = useReadSingleNotificationMutation();

    const handleSingleReadNotification = async (id: string) => {

        try {
            const res = await readSingleNotification(id).unwrap();
            if (res) {
                // toast.success(res?.message)
            }
        } catch (error) {
            return errorMessage(error)
        }
    }

    return (
        <>
            {/* Read All Button */}
            <div className='flex justify-end'>
                <button onClick={handleReadAllNotification} className='py-2 px-4 rounded-lg text-white font-bold bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87]'>
                    Read All
                </button>
            </div>

            {/* Notifications */}
            <div className="max-w-3xl mx-auto">
                {notificationData.length === 0 ? (
                    <div className="text-center py-10">No Notifications Found</div>
                ) : (
                    notificationData.map((item) => (
                        <div key={item.id}>
                            <div
                                onClick={() => {
                                    if (!item?.read_at) {
                                        handleSingleReadNotification(item.id);
                                    }
                                }}
                                className={`py-4 px-4 rounded-lg cursor-pointer transition-all duration-200
              ${item?.read_at == null
                                        ? "bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] text-white"
                                        : "shadow text-black bg-white"
                                    }
              my-5`}
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <h1 className="font-semibold">
                                            {item.data?.title}
                                        </h1>

                                        <p className="font-medium">
                                            {item.data?.message}
                                        </p>

                                        {item?.data?.meta?.order_id && (
                                            <p>
                                                Order id : {item.data.meta.order_id}
                                            </p>
                                        )}

                                        {item?.data?.action?.link && (
                                            <Link
                                                target="_blank"
                                                to={item.data.action.link}
                                                className="underline"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                Details
                                            </Link>
                                        )}
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // prevent mark-as-read
                                            handleDeleteNotification(item.id);
                                        }}
                                        className="hover:text-red-500 transition"
                                    >
                                        <FaRegTrashAlt size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {
                totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">

                        {/* Prev */}
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setPage(prev => prev - 1)}
                            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                        >
                            Prev
                        </button>

                        {/* Page Numbers */}
                        {Array.from({ length: totalPages }, (_, index) => {
                            const pageNumber = index + 1;

                            return (
                                <button
                                    key={pageNumber}
                                    onClick={() => setPage(pageNumber)}
                                    className={`px-3 py-1 rounded 
                                    ${currentPage === pageNumber
                                            ? 'bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] text-black'
                                            : 'bg-gray-200'
                                        }`}
                                >
                                    {pageNumber}
                                </button>
                            );
                        })}

                        {/* Next */}
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setPage(prev => prev + 1)}
                            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )
            }
        </>
    )
}

export default NotificationComponent;
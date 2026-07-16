import { useHomeApiQuery } from "../../api/home-api/homeApi";
import type { NotificationType } from "../../lib/type/homeType";

const Notification = () => {
    const { data, isLoading, isError } = useHomeApiQuery({});

    const notificationData: NotificationType[] =
        data?.data?.notifications ?? [];

    if (isLoading) {
        return <p className="p-5">Loading notifications...</p>;
    }

    if (isError) {
        return <p className="p-5 text-red-500">Failed to load notifications</p>;
    }

    return (
        <div className="shadow shadow-[#00000033] rounded-[7px] bg-[#FFFFFF] pt-9 pl-5 pr-16 pb-20 w-full h-[60vh] overflow-y-auto ">
            <h1 className="text-xl font-medium">Notifications</h1>

            {notificationData.length === 0 && (
                <p className="mt-4 text-sm text-gray-500">
                    No notifications found
                </p>
            )}

            {notificationData.map((item, i) => (
                <div key={i} className="mt-6">
                    <h1 className="font-medium">{item.title}</h1>
                    <p className="text-xs font-thin">
                        {item.time ?? "2 hours ago"}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default Notification;
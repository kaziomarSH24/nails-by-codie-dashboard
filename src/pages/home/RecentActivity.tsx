import { useHomeApiQuery } from "../../api/home-api/homeApi";
import type { RecentActivityType } from "../../lib/type/homeType";


const RecentActivity = () => {
    const { data } = useHomeApiQuery({});

    const activity: RecentActivityType[] = data?.data?.recent_activity || [];




    return (
        <div className=' shadow shadow-[#00000033] rounded-[7px] bg-[#FFFFFF] pt-9 pl-5 pr-16 pb-20 w-full h-[60vh]  overflow-y-auto  ' >
            <div>
                <h1 className=' text-xl font-medium ' >Recent Activity</h1>
                <p>Latest platform activities and updates</p>
            </div>
            <div className=' mt-6 ' >
                {
                    activity?.map((item, i) => {
                        return (
                            <div key={i} className="mt-7" >
                                <div>
                                    <h1>{item?.title}</h1>
                                    <p className=' text-xs font-thin ' >{item?.time}</p>
                                </div>
                            </div>
                        )
                    })
                }

            </div>
        </div>
    )
}

export default RecentActivity
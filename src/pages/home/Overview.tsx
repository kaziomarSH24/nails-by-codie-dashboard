import { useHomeApiQuery } from "../../api/home-api/homeApi"
import type { StatusType } from "../../lib/type/homeType";


const Overview = () => {
    const { data } = useHomeApiQuery({});
    const statusData: StatusType[] = data?.data?.stats || []
    return (
        <>
            <div className=' flex  justify-between gap-x-4  ' >
                {
                    statusData?.map((item, i) => {
                        return (
                            <div key={i} className=" w-[25%]" >
                                <div className=' rounded-[7px] shadow shadow-[#00000033] px-7 py-3.5 bg-[#FFFFFF] w-full  ' >
                                    <h1 className=' text-sm ' >{item?.label}</h1>
                                    <p className=' mt-2 text-2xl font-semibold  ' >
                                        {
                                            item?.value
                                        }
                                    </p>
                                    <span className=' mt-2 flex items-center  gap-x-1  ' >
                                        <p className=' text-transparent bg-gradient-to-r from-[#F2DA87] via-[#91741A] to-[#F2DA87] bg-clip-text' >{item?.growth} </p>
                                        {item?.growth_label}
                                    </span>
                                </div>

                            </div>
                        )
                    })
                }

            </div>
        </>
    )
}

export default Overview
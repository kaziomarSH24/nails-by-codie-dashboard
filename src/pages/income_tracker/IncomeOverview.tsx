import { useIncomeReportQuery } from "../../api/income-api/incomeApi"
import type { DashboardStats } from "../../lib/type/incomeType";


const IncomeOverview = () => {
    const { data } = useIncomeReportQuery({});
    const stats: DashboardStats = data?.stats
    return (
        <div className=' flex justify-between gap-x-4 ' >
            {/* income box  */}
            <div className=' w-[25%] shadow shadow-[#00000033] rounded-[7px] bg-white h-[120px] py-3.5 px-7 ' >
                <h1 className=' text-sm ' >Total Income</h1>
                <p className=' mt-2 font-medium text-2xl  ' >${stats?.total_income?.value}</p>
                <span className=' flex items-center gap-x-1 mt-2 text-transparent bg-gradient-to-r from-[#F2DA87] via-[#91741A] to-[#F2DA87] bg-clip-text ' >
                    {stats?.total_income?.growth > 0 ? <>+</> : <>-</>}{stats?.total_income?.growth}% <p className=' text-[#000000] ' >from last month</p>
                </span>
            </div>


            {/* Total Products */}
            <div className=' w-[25%] shadow shadow-[#00000033] rounded-[7px] bg-white h-[120px] py-3.5 px-7 ' >
                <h1 className=' text-sm ' >Products Sales Income</h1>
                <p className=' mt-2 font-medium text-2xl  ' >${stats?.product_income?.value} </p>
                <span className=' flex items-center gap-x-1 mt-2 text-transparent bg-gradient-to-r from-[#F2DA87] via-[#91741A] to-[#F2DA87] bg-clip-text ' >
                    {stats?.product_income?.growth > 0 ? <>+</> : <>-</>}{stats?.product_income.growth}% <p className=' text-[#000000] ' >from last month</p>
                </span>
            </div>


            {/* Total Courses */}
            <div className=' w-[25%] shadow shadow-[#00000033] rounded-[7px] bg-white h-[120px] py-3.5 px-7 ' >
                <h1 className=' text-sm ' >Course Income</h1>
                <p className=' mt-2 font-medium text-2xl  ' >${stats?.course_income?.value} </p>
                <span className=' flex items-center gap-x-1 mt-2 text-transparent bg-gradient-to-r from-[#F2DA87] via-[#91741A] to-[#F2DA87] bg-clip-text ' >
                    {stats?.course_income?.growth > 0 ? <>+</> : <>-</>}{stats?.course_income?.growth}% <p className=' text-[#000000] ' >from Last Month</p>
                </span>
            </div>



            {/* Total Income*/}
            <div className=' w-[25%] shadow shadow-[#00000033] rounded-[7px] bg-white h-[120px] py-3.5 px-7 ' >
                <h1 className=' text-sm ' >Number of Transitions</h1>
                <p className=' mt-2 font-medium text-2xl  ' >{stats?.total_transactions?.value}</p>
                <span className=' flex items-center gap-x-1 mt-2 text-transparent bg-gradient-to-r from-[#F2DA87] via-[#91741A] to-[#F2DA87] bg-clip-text ' >
                    {stats?.total_transactions?.growth > 0 ? <>+</> : <>-</>}{stats?.total_transactions?.growth}% <p className=' text-[#000000] ' >from Last Month</p>
                </span>
            </div>















        </div>
    )
}

export default IncomeOverview
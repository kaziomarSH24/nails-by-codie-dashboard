

const StockOverview = () => {
    return (
        <div className=' flex justify-between gap-x-4 ' >
            {/* income box  */}
            <div className=' w-[25%] shadow shadow-[#00000033] rounded-[7px] bg-white h-[120px] py-3.5 px-7 ' >
                <h1 className=' text-sm ' >Total Users</h1>
                <p className=' mt-2 font-medium text-2xl  ' >12,847</p>
                <span className=' flex items-center gap-x-1 mt-2 text-transparent bg-gradient-to-r from-[#F2DA87] via-[#91741A] to-[#F2DA87] bg-clip-text ' >
                    +12% <p className=' text-[#000000] ' >from last month</p>
                </span>
            </div>


            {/* Total Products */}
            <div className=' w-[25%] shadow shadow-[#00000033] rounded-[7px] bg-white h-[120px] py-3.5 px-7 ' >
                <h1 className=' text-sm ' >Total Products</h1>
                <p className=' mt-2 font-medium text-2xl  ' >86</p>
                <span className=' flex items-center gap-x-1 mt-2 text-transparent bg-gradient-to-r from-[#F2DA87] via-[#91741A] to-[#F2DA87] bg-clip-text ' >
                    +8% <p className=' text-[#000000] ' >from last month</p>
                </span>
            </div>


            {/* Total Courses */}
            <div className=' w-[25%] shadow shadow-[#00000033] rounded-[7px] bg-white h-[120px] py-3.5 px-7 ' >
                <h1 className=' text-sm ' >Total Courses</h1>
                <p className=' mt-2 font-medium text-2xl  ' >24</p>
                <span className=' flex items-center gap-x-1 mt-2 text-transparent bg-gradient-to-r from-[#F2DA87] via-[#91741A] to-[#F2DA87] bg-clip-text ' >
                    +23% <p className=' text-[#000000] ' >from yesterday</p>
                </span>
            </div>



            {/* Total Income*/}
            <div className=' w-[25%] shadow shadow-[#00000033] rounded-[7px] bg-white h-[120px] py-3.5 px-7 ' >
                <h1 className=' text-sm ' >Total Income</h1>
                <p className=' mt-2 font-medium text-2xl  ' >$24,429</p>
                <span className=' flex items-center gap-x-1 mt-2 text-transparent bg-gradient-to-r from-[#F2DA87] via-[#91741A] to-[#F2DA87] bg-clip-text ' >
                    +23% <p className=' text-[#000000] ' >from yesterday</p>
                </span>
            </div>















        </div>
    )
}

export default StockOverview
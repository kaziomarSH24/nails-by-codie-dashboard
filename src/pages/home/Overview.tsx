

const Overview = () => {
    return (
        <div className=' flex  justify-between gap-x-4  ' >
            {/* box 1  */}
            <div className=' rounded-[7px] shadow shadow-[#00000033] px-7 py-3.5 bg-[#FFFFFF]  w-[25%]  ' >
                <h1 className=' text-sm ' >Total Users</h1>
                <p className=' mt-2 text-2xl font-semibold  ' >
                    12,847
                </p>
                <span className=' mt-2 flex items-center  gap-x-1  ' >
                    <p className=' text-transparent bg-gradient-to-r from-[#F2DA87] via-[#91741A] to-[#F2DA87] bg-clip-text' >+12% </p>
                    from last month
                </span>
            </div>

            {/* box 2  */}



            <div className=' rounded-[7px] shadow shadow-[#00000033] px-7 py-3.5 bg-[#FFFFFF]  w-[25%]  ' >
                <h1 className=' text-sm ' >Total Products</h1>
                <p className=' mt-2 text-2xl font-semibold  ' >
                    86
                </p>
                <span className=' mt-2 flex items-center  gap-x-1  ' >
                    <p className=' text-transparent bg-gradient-to-r from-[#F2DA87] via-[#91741A] to-[#F2DA87] bg-clip-text' >+8%</p>
                    from last month
                </span>
            </div>



            {/* box 3  */}
            <div className=' rounded-[7px] shadow shadow-[#00000033] px-7 py-3.5 bg-[#FFFFFF]  w-[25%]  ' >
                <h1 className=' text-sm ' >Total Courses</h1>
                <p className=' mt-2 text-2xl font-semibold  ' >
                    24
                </p>
                <span className=' mt-2 flex items-center  gap-x-1  ' >
                    <p className=' text-transparent bg-gradient-to-r from-[#F2DA87] via-[#91741A] to-[#F2DA87] bg-clip-text' >+23%</p>
                    from yesterday
                </span>
            </div>

            {/* box 4  */}



            <div className=' rounded-[7px] shadow shadow-[#00000033] px-7 py-3.5 bg-[#FFFFFF]  w-[25%]  ' >
                <h1 className=' text-sm ' >Total Income</h1>
                <p className=' mt-2 text-2xl font-semibold  ' >
                    $24,429
                </p>
                <span className=' mt-2 flex items-center  gap-x-1  ' >
                    <p className=' text-transparent bg-gradient-to-r from-[#F2DA87] via-[#91741A] to-[#F2DA87] bg-clip-text' >+23%</p>
                    from last month
                </span>
            </div>







        </div>
    )
}

export default Overview
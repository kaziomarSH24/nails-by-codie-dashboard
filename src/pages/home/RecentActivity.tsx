import React from 'react'

const RecentActivity = () => {
    return (
        <div className=' shadow shadow-[#00000033] rounded-[7px] bg-[#FFFFFF] pt-9 pl-5 pr-16 pb-20 w-full ' >
            <div>
                <h1 className=' text-xl font-medium ' >Recent Activity</h1>
                <p>Latest platform activities and updates</p>
            </div>
            <div className=' mt-6 ' >
                <div>
                    <h1>New course "Advanced Nail Art" uploaded by Emma Wilson</h1>
                    <p className=' text-xs font-thin ' >2hours ago</p>
                </div>
                <div className=' mt-7 ' >
                    <h1>New course "Advanced Nail Art" uploaded by Emma Wilson</h1>
                    <p className=' text-xs font-thin ' >2hours ago</p>
                </div>
                <div className=' mt-7 ' >
                    <h1>New course "Advanced Nail Art" uploaded by Emma Wilson</h1>
                    <p className=' text-xs font-thin ' >2hours ago</p>
                </div>
            </div>
        </div>
    )
}

export default RecentActivity
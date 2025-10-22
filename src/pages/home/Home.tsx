import React from 'react'
import Overview from './Overview'
import IncomeChart from './IncomeChart'
import WeeklyUsersChart from './WeeklyUsersChart'
import Notification from './Notification'
import RecentActivity from './RecentActivity'

const Home: React.FC = () => {
    return (
        <div>
            <Overview></Overview>
            <div className=' mt-8 flex justify-between items-center gap-x-5  ' >
                <IncomeChart></IncomeChart>
                <WeeklyUsersChart></WeeklyUsersChart>
            </div>
            <div className=' mt-5 flex justify-between  gap-x-5 ' >
                <Notification></Notification>
                <RecentActivity></RecentActivity>
            </div>
        </div>
    )
}

export default Home
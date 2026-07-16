import React from 'react'
import IncomeOverview from './IncomeOverview'
import IncomeTable from './IncomeTable'

const IncomeTracker: React.FC = () => {
    return (
        <div>
            <IncomeOverview></IncomeOverview>
            <IncomeTable/>
        </div>
    )
}

export default IncomeTracker
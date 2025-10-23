import React from 'react'
import StockOverview from './StockOverview'
import StockTable from './StockTable'

const StockManagement: React.FC = () => {
    return (
        <div>
            <StockOverview></StockOverview>
            <div className=' mt-10 ' >
                <StockTable></StockTable>
            </div>
        </div>
    )
}

export default StockManagement
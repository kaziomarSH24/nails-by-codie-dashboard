
const RewardSetting = () => {
    return (
        <div className=' mt-12 ' >
            <div className=' py-7 px-11 rounded-[14px] shadow shadow-[#00000033] bg-white ' >
                <h1 className=' font-medium text-xl text-[#3A3734]  ' >Reward Settings</h1>


                <div className=' flex gap-x-5 ' >
                    {/* box 1  */}
                    <div className='p-2.5 border border-[#B9B9B9] rounded-[7px] mt-4 w-[300px]  ' >
                        <h1 className=' text-sm font-medium ' >Points per course/Product Purchase </h1>
                        <div className=' flex items-center gap-x-2.5 mt-2.5    ' >
                            <h1 className=' text-xs ' >1 USD spent</h1>
                            <input type="text" placeholder='100' name="" className=' w-20 py-2 px-3 border border-[#989898] hover:outline-none  focus:outline-0 rounded-[6px]   ' id="" />
                            <p className=' text-xs ' >Points earned</p>
                        </div>
                    </div>

                    {/* box 2  */}
                    <div className='p-2.5 border border-[#B9B9B9] rounded-[7px] mt-4 w-[300px]  ' >
                        <h1 className=' text-sm  font-medium ' >Set Coins Value</h1>
                        <div className=' flex items-center gap-x-2.5 mt-2.5    ' >
                            <h1 className=' text-xs ' >1 USD</h1>
                            <input type="text" placeholder='100' name="" className=' w-20 py-2 px-3 border border-[#989898] hover:outline-none  focus:outline-0 rounded-[6px]   ' id="" />
                            <p className=' text-xs ' >Point</p>
                        </div>
                    </div>
                </div>
                <div className=' mt-4 flex justify-end ' >
                    <span>
                        <svg width="60" height="30" viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="60" height="29.1892" rx="14.5946" fill="#53B96A" />
                            <g filter="url(#filter0_d_50_2322)">
                                <circle cx="45.4057" cy="14.5947" r="8.91892" fill="white" />
                            </g>
                            <defs>
                                <filter id="filter0_d_50_2322" x="33.0273" y="2.75684" width="24.7569" height="24.7569" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                    <feOffset dy="0.540545" />
                                    <feGaussianBlur stdDeviation="1.72975" />
                                    <feComposite in2="hardAlpha" operator="out" />
                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_50_2322" />
                                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_50_2322" result="shape" />
                                </filter>
                            </defs>
                        </svg>
                    </span>
                </div>
                <div className=' flex items-center justify-between  mt-4 ' >

                    <h1 className=' text-sm font-medium ' >Include Product Purchase</h1>
                    <div className='  space-y-3.5  ' >

                        <span className='  ' >
                            <svg width="60" height="30" viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="60" height="29.1892" rx="14.5946" fill="#53B96A" />
                                <g filter="url(#filter0_d_50_2322)">
                                    <circle cx="45.4057" cy="14.5947" r="8.91892" fill="white" />
                                </g>
                                <defs>
                                    <filter id="filter0_d_50_2322" x="33.0273" y="2.75684" width="24.7569" height="24.7569" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                        <feOffset dy="0.540545" />
                                        <feGaussianBlur stdDeviation="1.72975" />
                                        <feComposite in2="hardAlpha" operator="out" />
                                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
                                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_50_2322" />
                                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_50_2322" result="shape" />
                                    </filter>
                                </defs>
                            </svg>

                        </span>
                    </div>
                </div>






            </div>
        </div>
    )
}

export default RewardSetting
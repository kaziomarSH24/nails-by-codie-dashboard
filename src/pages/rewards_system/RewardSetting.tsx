import { useState } from "react"
import { useRewardClimMutation } from "../../api/reward-api/rewardApi";
import { errorMessage } from "../../lib/error/errorMsg";
import { rewardClimAlert } from "../../lib/alert/rewardClimAlert";
import { toast } from "sonner";
import { Spinner } from "../../components/ui/spinner";

const RewardSetting = () => {
    const [redeem_points, setRedeem_points] = useState<string>();
    const [earn_points, setEarn_points] = useState<string>();

    const [rewardClim, { isLoading }] = useRewardClimMutation();

    const handleClaim = async () => {
        try {
            const payload = {
                redeem_points_per_usd: redeem_points,
                earn_points_per_usd: earn_points
            };

            const res = await rewardClimAlert();

            if (res.isConfirmed) {
                const res = await rewardClim(payload).unwrap();
                if (res) {
                    toast.success(res?.message);
                    setRedeem_points("");
                    setEarn_points("");
                }
            }






        } catch (error) {
            return errorMessage(error)
        }
    }


    return (
        <div className=' mt-12 ' >
            <div className=' py-7 px-11 rounded-[14px] shadow shadow-[#00000033] bg-white ' >
                <h1 className=' font-medium text-xl text-[#3A3734]  ' >Reward Settings</h1>


                <div className=' flex gap-x-5 items-center ' >
                    {/* box 1  */}
                    <div className='p-2.5 border border-[#B9B9B9] rounded-[7px] mt-4 w-[300px]  ' >
                        <h1 className=' text-sm font-medium ' >Points per course/Product Purchase </h1>
                        <div className=' flex items-center gap-x-2.5 mt-2.5    ' >
                            <h1 className=' text-xs ' >1 USD spent</h1>
                            <input value={redeem_points} onChange={(e) => { setRedeem_points(e.target.value) }} type="text" placeholder='100' name="" className=' w-20 py-2 px-3 border border-[#989898] hover:outline-none  focus:outline-0 rounded-[6px]   ' id="" />
                            <p className=' text-xs ' >Points earned</p>
                        </div>
                    </div>

                    {/* box 2  */}
                    <div className='p-2.5 border border-[#B9B9B9] rounded-[7px] mt-4 w-[300px]  ' >
                        <h1 className=' text-sm  font-medium ' >Set Coins Value</h1>
                        <div className=' flex items-center gap-x-2.5 mt-2.5    ' >
                            <h1 className=' text-xs ' >1 USD</h1>
                            <input value={earn_points} onChange={(e) => { setEarn_points(e.target.value) }} type="text" placeholder='100' name="" className=' w-20 py-2 px-3 border border-[#989898] hover:outline-none  focus:outline-0 rounded-[6px]   ' id="" />
                            <p className=' text-xs ' >Point</p>
                        </div>
                    </div>
                    <div>
                        <button onClick={handleClaim} className="py-2 rounded-lg text-white font-bold bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] px-10 " >
                            {
                                isLoading ? <div className=" flex justify-center " > <Spinner></Spinner> </div> : <>Readme</>
                            }
                        </button>
                    </div>
                </div>

                <div className=' flex items-center justify-between  mt-4 ' >

                    <h1 className=' text-sm font-medium ' >Include Product Purchase</h1>
                    <div className='  space-y-3.5  ' >


                    </div>
                </div>






            </div>
        </div>
    )
}

export default RewardSetting
import { useUserDetailsQuery } from '../../api/user-api/userApi'
import { Spinner } from '../../components/ui/spinner';
import type { UserDetails } from '../../lib/type/authType';
import type { Appointment, Enrollment } from '../../lib/type/userType';

const UserDetails = ({ id }: { id: number }) => {
    const { data, isLoading } = useUserDetailsQuery(id);
    const userDetails: UserDetails = data?.data;
    const courseEnroll: Enrollment[] = data?.data?.enrollments || [];
    const appointment: Appointment[] = data?.data?.appointments || [];
    return (
        <div>
            {
                isLoading ? <div className=' h-[calc(100vh-30vh)] flex justify-center items-center  ' >
                    <Spinner></Spinner>
                </div> :
                    <>
                        <div className="space-y-2 mt-2">
                            {/* imgage and info  */}
                            <div className=" flex items-center gap-x-5  " >
                                <div>
                                    <img src={userDetails?.avatar || "/images/logo/user.png"} alt="" className=" w-20 h-20 rounded-full " />
                                </div>
                                <div className=" space-y-2 " >
                                    <h1 className=" text-lg font-medium " > {userDetails?.name} </h1>
                                    <p className=" text-xs " >{userDetails?.email}</p>
                                    <button className=" bg-[#EAF6EC] rounded-[4px] py-1 px-4 text-xs text-[#24983F]  " >{userDetails.status}</button>
                                </div>
                            </div>
                        </div>
                        <div className=" mt-7 flex items-center justify-between gap-x-4 " >

                            {/* box 1 phone  */}

                            <div className=" bg-[#E9E9E994] h-[76px] w-[33.33%] rounded-[5px] py-3 px-5 " >
                                <h1 className=" text-sm font-medium " >Phone</h1>
                                <p className=" text-sm mt-3 " >{userDetails?.phone || "017********"}</p>
                            </div>

                            {/* box 2 Subscription  */}

                            <div className=" bg-[#E9E9E994] h-[76px] w-[33.33%] rounded-[5px] py-3 px-5 " >
                                <h1 className=" text-sm font-medium " >Subscription</h1>
                                <button className=" bg-[#EAF6EC] text-[#24983F] border border-[#69E397]  px-4 py-1 rounded-[4px] text-xs mt-3 " >Paid</button>
                            </div>



                            {/* box 3 Date Joined  */}

                            <div className=" bg-[#E9E9E994] h-[76px] w-[33.33%] rounded-[5px] py-3 px-5 " >
                                <h1 className=" text-sm font-medium " >Date Joined</h1>
                                <p className=" text-sm mt-3 " >{new Date(userDetails.created_at).toDateString()} </p>
                            </div>

                        </div>
                        <div className=" mt-8 " >
                            {
                                courseEnroll.length > 0 && (<h1 className=" font-medium text-[16px] " >Course Enrollments</h1>)
                            }
                            {
                                courseEnroll?.map((item, i) => {
                                    return (
                                        <div key={i} >
                                            <div className=" border border-[#989898] rounded-[8px] flex justify-between py-3 px-4 mt-2 items-center " >
                                                <h1>{item?.course?.title}</h1>
                                                <button className=" bg-[#C2E9BE] rounded-[20px] py-1 px-3 text-[#2A912D] " >Enrolled</button>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>


                        <div className=" " >
                            {
                                appointment.length > 0 && (<h1 className=" font-medium text-[16px] " >Appointment History</h1>)
                            }
                            {
                                appointment?.map((item, i) => {
                                    return (
                                        <div className='  ' key={i} >
                                            <div className=" border border-[#989898] rounded-[8px] flex justify-between items-center py-3 px-4 mt-2 " >
                                                <h1>{item?.client_name}</h1>
                                                <p className=" text-[#000000] text-xs " > {new Date(item?.created_at).toLocaleDateString()} </p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>


                        <div className=" mt-12 flex justify-end " >
                            <button className=" border border-[#E32C2C] text-[#E32C2C] text-xs rounded-[6px] p-2.5 " >Syspend User</button>
                        </div>


                    </>
            }
        </div>
    )
}

export default UserDetails
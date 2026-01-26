import { useState } from "react";

import { toast } from "sonner";
import ReactPlayer from 'react-player'

import {
    useGetLessonByCourseIdQuery,
    useLessonDeleteMutation,
} from "../../api/lesson-api/lessonApi";
import { Button } from "../../components/ui/button";
import { Spinner } from "../../components/ui/spinner";
import { deleteAlert } from "../../lib/alert/deleteAlert";
import { errorMessage } from "../../lib/error/errorMsg";
import type { CourseLessonType, Lesson } from "../../lib/type/lessonType";
import { usePublishCourseMutation, useUnPublishCourseMutation } from "../../api/course-api/courseApi";
// import { updateAlert } from "../../lib/alert/updateAlert";
import LessonUpdate from "./LessonUpdate";
import { courseUpdateAlert } from "../../lib/alert/updateAlert";
// import { VideoPlayer, VideoPlayerContent, VideoPlayerControlBar, VideoPlayerMuteButton, VideoPlayerPlayButton, VideoPlayerSeekBackwardButton, VideoPlayerSeekForwardButton, VideoPlayerTimeDisplay, VideoPlayerTimeRange, VideoPlayerVolumeRange } from "../../components/kibo-ui/video-player";
// import { ReactPlayer } from 'react-player';

const CourseLesson = ({ id }: { id: string | undefined }) => {
    const courseId = id;

    // =================== STATE ===================
    const [openModal, setOpenModal] = useState(false);
    const [activeVideo, setActiveVideo] = useState<string | null>(null);
    const [lessonId, setLessonId] = useState<string | undefined>(undefined);

    console.log("video url is", activeVideo)

    // =================== lesson details api ===================
    const { data, isLoading } = useGetLessonByCourseIdQuery(courseId);


    const courseData: CourseLessonType = data?.data;
    const lessonData: Lesson[] = data?.data?.lessons || [];

    // =================== PLAY VIDEO ===================
    const handlePlay = (videoUrl: string) => {
        setActiveVideo(videoUrl);
        setOpenModal(true);
    };

    // =================== DELETE ===================
    const [lessonDelete, { isLoading: deleteLoading }] = useLessonDeleteMutation();
    const courseLessonDelete = async (id: string) => {
        setLessonId(id);
        try {
            const res = await deleteAlert();
            if (res.isConfirmed) {
                const response = await lessonDelete({
                    courseId,
                    lessonId: id,
                }).unwrap();

                toast.success(response?.message);
            }
        } catch (error) {
            errorMessage(error);
        }
    };


    //<<------------------------------- course status publish ----------------------------->>

    const [publishCourse, { isLoading: courseStatusLoading }] = usePublishCourseMutation();

    const courseStatusUpdate = async () => {
        try {
            const res = await courseUpdateAlert();

            if (res.isConfirmed) {
                const res = await publishCourse(courseId).unwrap();
                if (res) {
                    toast.success(res?.message);
                }
            }

        } catch (error) {
            return errorMessage(error);
        }
    }



    //<<------------------------------- course unpublish ----------------------------->>

    const [unPublishCourse, { isLoading: unPublishLoading }] = useUnPublishCourseMutation();

    const courseUnPublish = async () => {
        try {
            const res = await courseUpdateAlert();

            if (res.isConfirmed) {
                const res = await unPublishCourse(courseId).unwrap();
                if (res) {
                    toast.success(res?.message);
                }
            }

        } catch (error) {
            return errorMessage(error);
        }
    }


    // =================== UPDATE MODAL ===================

    const [updateModal, setUpdateModal] = useState<boolean>(false);

    console.log(updateModal)








    // =================== LOADING ===================
    if (isLoading) {
        return (
            <div className="flex justify-center mt-10">
                <Spinner />
            </div>
        );
    }

    return (
        <>
            <div>
                {/* =================== HEADER =================== */}
                <div className="flex gap-x-7 items-center">
                    <h1 className="text-3xl font-medium text-[#3A3734]">
                        {courseData?.title} Course Lessons
                    </h1>
                </div>

                {/* =================== LESSON LIST =================== */}
                {lessonData.map((item, index) => (
                    <div key={item.id} className="mt-6">
                        <div className="flex justify-between items-center px-6 py-3 rounded-[38px] border border-[#989898]">
                            {/* LEFT */}
                            <div className="flex items-center gap-x-6">
                                {/* ▶ Play icon */}
                                <div
                                    className="cursor-pointer"
                                    onClick={() => handlePlay(item.video_url)}
                                >
                                    ▶
                                </div>

                                <div>
                                    <h1 className="font-medium">
                                        {index + 1}. {item.title}
                                    </h1>
                                    <p className="text-sm text-gray-600">
                                        {item.description}
                                    </p>
                                </div>
                            </div>

                            {/* RIGHT ACTIONS */}
                            {/* update  */}
                            <div className=" flex items-center gap-x-6  " >
                                <div onClick={() => { setUpdateModal(!updateModal) }} className=" cursor-pointer  " >
                                    <svg width="52" height="35" viewBox="0 0 52 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="0.583333" y="0.583333" width="50.1667" height="33.8333" rx="6.41667" stroke="#989898" stroke-width="1.16667" />
                                        <path d="M29.7236 7.00465C29.9184 7.02215 30.0036 7.26015 29.8636 7.39898L20.1569 17.1056C20.0472 17.2154 19.9687 17.3523 19.9294 17.5023L18.7627 21.9707C18.7242 22.1183 18.725 22.2735 18.765 22.4208C18.805 22.568 18.8828 22.7023 18.9907 22.8102C19.0986 22.9181 19.2328 22.9959 19.3801 23.0359C19.5274 23.0759 19.6826 23.0767 19.8302 23.0382L24.2974 21.8715C24.4476 21.8318 24.5845 21.7529 24.6941 21.6428L34.5384 11.7985C34.5692 11.7669 34.6084 11.7447 34.6514 11.7347C34.6944 11.7247 34.7393 11.7272 34.7809 11.7419C34.8226 11.7566 34.8591 11.783 34.8862 11.8178C34.9133 11.8527 34.9298 11.8945 34.9339 11.9385C35.3437 15.8464 35.3202 19.7876 34.8639 23.6903C34.6037 25.9128 32.8176 27.657 30.6032 27.9055C26.5475 28.3548 22.4545 28.3548 18.3987 27.9055C16.1832 27.657 14.397 25.9128 14.1369 23.6903C13.6562 19.5778 13.6562 15.4233 14.1369 11.3108C14.397 9.08715 16.1832 7.34298 18.3987 7.09565C22.1606 6.67865 25.9554 6.64816 29.7236 7.00465Z" fill="#B9B9B9" />
                                        <path d="M31.2935 8.44311C31.3206 8.41595 31.3528 8.3944 31.3882 8.37969C31.4236 8.36499 31.4616 8.35742 31.5 8.35742C31.5383 8.35742 31.5763 8.36499 31.6118 8.37969C31.6472 8.3944 31.6794 8.41595 31.7065 8.44311L33.3561 10.0939C33.4106 10.1486 33.4412 10.2227 33.4412 10.2999C33.4412 10.3771 33.4106 10.4511 33.3561 10.5058L23.681 20.1833C23.6442 20.2199 23.5983 20.2461 23.548 20.2591L21.315 20.8424C21.2658 20.8553 21.214 20.855 21.1649 20.8417C21.1159 20.8284 21.0711 20.8024 21.0351 20.7665C20.9992 20.7305 20.9732 20.6857 20.9599 20.6366C20.9466 20.5876 20.9463 20.5358 20.9591 20.4866L21.5425 18.2536C21.5555 18.2033 21.5816 18.1574 21.6183 18.1206L31.2935 8.44311Z" fill="#B9B9B9" />
                                    </svg>

                                </div>
                                {/* delete  */}
                                <div onClick={() => { courseLessonDelete(String(item.id)) }} className=" cursor-pointer " >
                                    {
                                        <span>
                                            <svg width="52" height="35" viewBox="0 0 52 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="0.583333" y="0.583333" width="50.1667" height="33.8333" rx="6.41667" stroke="#989898" stroke-width="1.16667" />
                                                <path d="M18.6665 28C18.0248 28 17.4757 27.7717 17.0192 27.3152C16.5626 26.8586 16.334 26.3091 16.3332 25.6667V10.5C16.0026 10.5 15.7257 10.388 15.5025 10.164C15.2793 9.94 15.1673 9.66311 15.1665 9.33333C15.1657 9.00356 15.2777 8.72667 15.5025 8.50267C15.7273 8.27867 16.0042 8.16667 16.3332 8.16667H20.9998C20.9998 7.83611 21.1118 7.55922 21.3358 7.336C21.5598 7.11278 21.8367 7.00078 22.1665 7H26.8332C27.1637 7 27.441 7.112 27.665 7.336C27.889 7.56 28.0006 7.83689 27.9998 8.16667H32.6665C32.9971 8.16667 33.2743 8.27867 33.4983 8.50267C33.7223 8.72667 33.834 9.00356 33.8332 9.33333C33.8324 9.66311 33.7204 9.94039 33.4972 10.1652C33.274 10.3899 32.9971 10.5016 32.6665 10.5V25.6667C32.6665 26.3083 32.4382 26.8578 31.9817 27.3152C31.5251 27.7725 30.9756 28.0008 30.3332 28H18.6665ZM22.1665 23.3333C22.4971 23.3333 22.7743 23.2213 22.9983 22.9973C23.2223 22.7733 23.334 22.4964 23.3332 22.1667V14C23.3332 13.6694 23.2212 13.3926 22.9972 13.1693C22.7732 12.9461 22.4963 12.8341 22.1665 12.8333C21.8367 12.8326 21.5598 12.9446 21.3358 13.1693C21.1118 13.3941 20.9998 13.671 20.9998 14V22.1667C20.9998 22.4972 21.1118 22.7745 21.3358 22.9985C21.5598 23.2225 21.8367 23.3341 22.1665 23.3333ZM26.8332 23.3333C27.1637 23.3333 27.441 23.2213 27.665 22.9973C27.889 22.7733 28.0006 22.4964 27.9998 22.1667V14C27.9998 13.6694 27.8878 13.3926 27.6638 13.1693C27.4398 12.9461 27.163 12.8341 26.8332 12.8333C26.5034 12.8326 26.2265 12.9446 26.0025 13.1693C25.7785 13.3941 25.6665 13.671 25.6665 14V22.1667C25.6665 22.4972 25.7785 22.7745 26.0025 22.9985C26.2265 23.2225 26.5034 23.3341 26.8332 23.3333Z" fill="#B9B9B9" />
                                            </svg>

                                        </span>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* =================== ACTION BUTTONS =================== */}
                <div className="mt-16 flex gap-x-6 justify-end">
                    <Button className="bg-white text-black border rounded-[39px] px-9 py-2.5">
                        Close
                    </Button>

                    <Button className="bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] px-9 py-2.5 rounded-[39px]">
                        {
                            courseData?.is_published == 1 ? <> <div onClick={courseUnPublish}  >
                                {
                                    unPublishLoading ? <> <div className=" flex justify-center " > <Spinner /> </div> </> : <> <div>UnPublish Course</div> </>
                                }
                            </div> </> : <>
                                <div onClick={courseStatusUpdate} >

                                    {
                                        courseStatusLoading ? <><div><Spinner /> </div></> : <><div>Publish Course</div></>
                                    }

                                </div>
                            </>
                        }
                    </Button>
                </div>
            </div>

            {/* =================== VIDEO MODAL =================== */}
            {openModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div className="bg-white w-[90%] max-w-4xl rounded-xl p-4 relative">
                        {/* Close */}
                        <button
                            onClick={() => {
                                setOpenModal(false);
                                setActiveVideo(null);
                            }}
                            className="absolute top-3 right-3 text-xl font-bold"
                        >
                            ✕
                        </button>

                        {/* Player */}
                        {activeVideo && (
                            <div className="aspect-video">
                                <div className="w-full h[400px] ">

                                    {/* <VideoPlayer className="overflow-hidden rounded-lg border">
                                        <VideoPlayerContent
                                            crossOrigin=""
                                            // muted
                                            preload="auto"
                                            slot="media"
                                            src={"https://www.youtube.com/watch?v=0rDIt3dlrV4"}
                                        />
                                        <VideoPlayerControlBar>
                                            <VideoPlayerPlayButton />
                                            <VideoPlayerSeekBackwardButton />
                                            <VideoPlayerSeekForwardButton />
                                            <VideoPlayerTimeRange />
                                            <VideoPlayerTimeDisplay showDuration />
                                            <VideoPlayerMuteButton />
                                            <VideoPlayerVolumeRange />
                                        </VideoPlayerControlBar>
                                    </VideoPlayer> */}
                                    <ReactPlayer
                                        url={"<ReactPlayer src='https://www.youtube.com/watch?v=LXb3EKWsInQ"}
                                    // width="100%"
                                    // height="100%"
                                    // controls
                                    // playing
                                    // muted

                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}


            {/* =================== LESSON UPDATE MODAL =================== */}

            {updateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div className="bg-white w-[90%] max-w-4xl rounded-xl relative flex flex-col max-h-[90vh]">

                        {/* Header */}
                        <div className="flex justify-end p-4 border-b">
                            <button
                                onClick={() => setUpdateModal(false)}
                                className="text-xl font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {<LessonUpdate courseId={courseId} lessonId={lessonId} />}
                        </div>

                    </div>
                </div>
            )}








        </>
    );
};

export default CourseLesson;

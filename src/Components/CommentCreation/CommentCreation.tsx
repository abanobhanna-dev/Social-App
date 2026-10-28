import { IoMdSend } from "react-icons/io";
import { FaImage } from "react-icons/fa6";
import { ImSpinner11 } from "react-icons/im";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
export default function CommentCreation({ postId, queryKey }: { postId: string, queryKey: string[] }) {
    const form = useForm({
        defaultValues: {
            content: "",
            image: "",
        }
    })

    const query = useQueryClient()

    const { register, handleSubmit, reset } = form;

    const formdata = new FormData()


    function CreateComment() {
        return axios.post(`https://route-posts.routemisr.com/posts/${postId}/comments`, formdata, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")
                    }`
            }
        })
    }

    const { mutate, isPending } = useMutation({
        mutationFn: CreateComment,
        onSuccess: (res) => {
            toast.success(res.data.message)

            query.invalidateQueries({ queryKey: queryKey })
            reset()

        },
        onError: (err) => {
            toast.error(err.message)
        }
    })


    function handleCreateComment(values: { content: string, image: string }) {
        // console.log(values)
        if (!values.content && !values.image) {
            return
        }
        if (values.content) {
            formdata.append("content", values.content)
        }
        if (values.image) {
            formdata.append("image", values.image[0])
        }
        mutate()
    }
    return (
        <div className="bg-slate-100 p-4 my-4 rounded-2xl">
            <form onSubmit={handleSubmit(handleCreateComment)} className="max-w-md mx-auto">
                <div className="relative flex items-center gap-2">
                    {/* Input */}
                    <input
                        {...register("content")}
                        type="text"
                        className="flex-1 bg-white border border-slate-200 text-slate-800 text-sm rounded-xl 
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                       block w-full p-3.5 pe-24 shadow-sm placeholder:text-slate-400
                       transition-all duration-200"
                        placeholder="اكتب تعليقك..."
                    />

                    {/* Buttons inside input */}
                    <div className="absolute end-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        {/* Image Upload */}
                        <label className="cursor-pointer p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition">
                            <FaImage className="size-5" />
                            <input type="file" hidden accept="image/*" {...register("image")} />
                        </label>

                        {/* Send Button */}
                        <button
                            disabled={isPending}
                            type="submit"
                            className="p-2 rounded-lg disabled:bg-slate-900 disabled:cursor-not-allowed text-white bg-blue-600 hover:bg-blue-700 
                            transition shadow-sm active:scale-95"
                        >
                            {isPending ? <ImSpinner11 className="animate-spin" /> : <IoMdSend className="size-5" />}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

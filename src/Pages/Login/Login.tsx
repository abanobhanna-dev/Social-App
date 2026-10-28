import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginSchemaType } from "./../../Schemas/auth.schema";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "./../../Context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);
  const [showPassword, setshowPassword] = useState(false);
  // {بنستخدم useContext(AuthContext) عشان نوصل لـ userLogin و setuserLogin.}
  const { setuserLogin } = useContext(AuthContext);
  const form = useForm<LoginSchemaType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(LoginSchema),
    mode: "onTouched",
  });
  const { register, handleSubmit, formState } = form;

  function handleLoging(value: LoginSchemaType) {
    // console.log(value);
    setisLoading(true);
    axios
      .post(`https://route-posts.routemisr.com/users/signin`, value)
      .then((res) => {
        // console.log(res);
        toast.success("Successfully toasted!");
        // console.log(res.data.data.token);
        // بنحفظ التوكن في localStorage باسم "userToken".
        localStorage.setItem("userToken", res.data.data.token);
        // بنحدث الـ Context بـ setuserLogin(res.data.data.token).
        setuserLogin(res.data.data.token);
        // بنروح على صفحة /home.
        navigate("/home");
      })
      .catch((err) => {
        console.log(err);
        toast.error("This didn't work.");
      })
      .finally(() => {
        setisLoading(false);
      });
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent py-2">
            Login Now
          </h1>
          <p className="mt-3 text-sm text-body/80">
            انضم إلينا وابدأ رحلتك الاجتماعية
          </p>
        </div>
        {/* Card */}
        <form
          onSubmit={handleSubmit(handleLoging)}
          className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl shadow-indigo-100/50 rounded-2xl p-8 md:p-10 space-y-1"
        >
          {/* Email */}
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="email"
              {...register("email")}
              id="email"
              className="block py-3 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer transition-colors"
              placeholder=" "
            />
            <label
              htmlFor="email"
              className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Enter Your Email
            </label>
            {formState.errors.email?.message && (
              <p className="text-red-600 font-bold bg-red-200 p-3 my-2">
                {formState.errors.email?.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative z-0 w-full mb-6 group">
            <div className="flex">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                id="password"
                className="block py-3 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer transition-colors"
                placeholder=" "
              />
              <label
                htmlFor="password"
                className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
              >
                Enter Your Password
              </label>
              <button
                type="button"
                onClick={() => setshowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            {formState.errors.password?.message && (
              <p className="text-red-600 font-bold bg-red-200 p-3 my-2">
                {formState.errors.password?.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            disabled={isLoading}
            type="submit"
            className="w-full disabled:bg-slate-400 disabled:text-white disabled:cursor-not-allowed relative overflow-hidden text-white font-semibold text-sm px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-200/60 hover:shadow-xl hover:shadow-indigo-300/50 focus:outline-none focus:ring-4 focus:ring-indigo-300/50 transition-all duration-300 active:scale-[0.98]"
          >
            {isLoading ? "Loading" : "Login"}
          </button>
          <div className="flex justify-center my-2 text-blue-600 font-bold underline cursor-pointer ">
            <Link to={"/register"}>Don't You Have An Account? Go Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

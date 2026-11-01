import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, type RegisterSchemaType } from "./../../Schemas/auth.schema";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash, FaUsers, FaComments, FaUser, FaCalendarAlt } from "react-icons/fa";
import { MdEmail, MdLock } from "react-icons/md";

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);
  const [showPassword, setshowPassword] = useState(false);
  const [showRePassword, setshowRePassword] = useState(false);

  const form = useForm<RegisterSchemaType>({
    defaultValues: {
      name: "",
      email: "",
      dateOfBirth: "",
      gender: "female",
      password: "",
      rePassword: "",
    },
    resolver: zodResolver(RegisterSchema),
    mode: "onTouched",
  });

  const { register, handleSubmit, formState } = form;

  function handleRegister(value: RegisterSchemaType) {
    setisLoading(true);
    axios
      .post(`https://route-posts.routemisr.com/users/signup`, value)
      .then((res) => {
        console.log(res);
        toast.success("Successfully toasted!");
        navigate("/login");
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
    <div className="min-h-screen flex items-center justify-center bg-[#e8f5f3] px-4 py-8">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          
          {/* Header - Dark Teal with Curve */}
          <div className="relative bg-[#0d6e6e] pt-10 pb-16 px-8 text-center">
            {/* Decorative Curve */}
            <div className="absolute bottom-0 left-0 right-0 h-14 bg-white rounded-t-[50%]"></div>
            
            {/* Icons */}
            <div className="flex justify-center items-center gap-3 mb-5 relative z-10">
              <FaUsers className="text-white text-3xl opacity-90" />
              <FaComments className="text-white text-3xl opacity-90" />
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white relative z-10">
              Register Now
            </h1>
            
            {/* Arabic Subtitle */}
            <p className="mt-3 text-base text-white/90 relative z-10">
              انضم إلينا وابدأ رحلتك الاجتماعية
            </p>
          </div>

          {/* Form Section */}
          <form
            onSubmit={handleSubmit(handleRegister)}
            className="px-8 md:px-12 lg:px-16 pb-10 pt-4 space-y-5"
          >
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Your Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400 text-lg" />
                </div>
                <input
                  type="text"
                  {...register("name")}
                  id="name"
                  placeholder="Enter Your Name"
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#0d6e6e] focus:border-transparent transition"
                />
              </div>
              {formState.errors.name?.message && formState.touchedFields.name && (
                <p className="text-red-600 text-sm mt-1.5 font-medium">
                  {formState.errors.name?.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Your Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MdEmail className="text-gray-400 text-xl" />
                </div>
                <input
                  type="email"
                  {...register("email")}
                  id="email"
                  placeholder="hanaabanob244@gmail.com"
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#0d6e6e] focus:border-transparent transition"
                />
              </div>
              {formState.errors.email?.message && (
                <p className="text-red-600 text-sm mt-1.5 font-medium">
                  {formState.errors.email?.message}
                </p>
              )}
            </div>

            {/* Birthday Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Your Birthday
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400 text-lg" />
                </div>
                <input
                  type="date"
                  {...register("dateOfBirth")}
                  id="dateOfBirth"
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#0d6e6e] focus:border-transparent transition"
                />
              </div>
              {formState.errors.dateOfBirth?.message && (
                <p className="text-red-600 text-sm mt-1.5 font-medium">
                  {formState.errors.dateOfBirth?.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Your Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MdLock className="text-gray-400 text-xl" />
                </div>
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#0d6e6e] focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setshowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEye className="text-xl" /> : <FaEyeSlash className="text-xl" />}
                </button>
              </div>
              {formState.errors.password?.message && (
                <p className="text-red-600 text-sm mt-1.5 font-medium">
                  {formState.errors.password?.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MdLock className="text-gray-400 text-xl" />
                </div>
                <input
                  {...register("rePassword")}
                  type={showRePassword ? "text" : "password"}
                  id="rePassword"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#0d6e6e] focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setshowRePassword(!showRePassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showRePassword ? <FaEye className="text-xl" /> : <FaEyeSlash className="text-xl" />}
                </button>
              </div>
              {formState.errors.rePassword?.message && (
                <p className="text-red-600 text-sm mt-1.5 font-medium">
                  {formState.errors.rePassword?.message}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Gender
              </label>
              <div className="flex items-center gap-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    {...register("gender")}
                    type="radio"
                    value="male"
                    className="w-5 h-5 text-[#0d6e6e] border-gray-300 focus:ring-[#0d6e6e] accent-[#0d6e6e]"
                  />
                  <span className="text-gray-700 font-medium">Male</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    {...register("gender")}
                    type="radio"
                    value="female"
                    className="w-5 h-5 text-[#0d6e6e] border-gray-300 focus:ring-[#0d6e6e] accent-[#0d6e6e]"
                  />
                  <span className="text-gray-700 font-medium">Female</span>
                </label>
              </div>
              {formState.errors.gender?.message && (
                <p className="text-red-600 text-sm mt-1.5 font-medium">
                  {formState.errors.gender?.message}
                </p>
              )}
            </div>

            {/* Register Button */}
            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-[#0d6e6e] hover:bg-[#0a5a5a] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl text-lg transition-all duration-200 active:scale-[0.98] shadow-md mt-2"
            >
              {isLoading ? "Loading..." : "Register"}
            </button>

            {/* Login Link */}
            <div className="text-center pt-2">
              <Link
                to="/login"
                className="text-base text-[#0d6e6e] hover:underline font-medium"
              >
                Do You Have An Account? Go Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
import { useMutation } from "@tanstack/react-query"
import axios, { isAxiosError } from "axios"
import { useContext, useState } from "react"
import toast from "react-hot-toast"
import { AuthContext } from "../../Context/AuthContext"
import { useNavigate } from 'react-router-dom';
export default function ChangePassword() {
  const [password, setPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const navigate = useNavigate()
  const { setuserLogin } = useContext(AuthContext)

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      axios.patch(
        `https://route-posts.routemisr.com/users/change-password`,
        { password, newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`
          }
        }
      ),
    onSuccess: (res) => {
      toast.success(res.data.message || "Password change")
      localStorage.removeItem("userToken")
      setuserLogin(null);
      navigate("/login")
    },
    onError: (err) => {
      const message = isAxiosError(err) ? err.response?.data?.message : undefined
      toast.error(message || "Something wnet wrong")
    }
  })

  function handleSubmit() {
    if (!password || !newPassword || !confirmPassword) {
      toast.error("Please fill all fields")
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match")
      return;
    }
    if (newPassword === password) {
      toast.error("New Password must be different form the current one")
      return;
    }
    mutate()
  }
  return <>
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-6 my-10">
      <h2 className="text-xl font-bold text-slate-900 mb-4">Change Password</h2>

      <div className="flex flex-col gap-3">
        <input
          type="password"
          placeholder="Current password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-slate-300 rounded-lg p-3"
        />
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border border-slate-300 rounded-lg p-3"
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border border-slate-300 rounded-lg p-3"
        />
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="bg-blue-600 text-white py-2 rounded-lg font-medium">
          {isPending ? "Saving" : "Change Password"}
        </button>
      </div>
    </div>
  </>
}

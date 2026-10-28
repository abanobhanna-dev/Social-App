import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Custom Hook لعمل Follow أو Unfollow لمستخدم
export default function useFollow() {
  // بنستخدم queryClient عشان نقدر نحدث البيانات بعد النجاح
  const queryClient = useQueryClient();

  // الـ Mutation المسؤولة عن Follow / Unfollow
  const { mutate: followUser, isPending } = useMutation({
    // الدالة اللي بتنفذ الطلب
    mutationFn: (userId: string) => {
      return axios.put(
        `https://route-posts.routemisr.com/users/${userId}/follow`,
        {}, // Body فاضي
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
    },

    // لما العملية تنجح
    onSuccess: () => {
      // نحدث بيانات البروفايل عشان العدد يتغير
      queryClient.invalidateQueries({ queryKey: ["getMyProfile"] });

      // لو في استعلامات تانية خاصة باليوزر نحدثها كمان
      queryClient.invalidateQueries({ queryKey: ["getUserProfile"] });
    },

    // لو حصل خطأ
    onError: (error) => {
      console.log("خطأ في عمل Follow/Unfollow:", error);
    },
  });

  // بنرجع الدالة وحالة التحميل عشان نستخدمهم في أي كومبوننت
  return { followUser, isPending };
}

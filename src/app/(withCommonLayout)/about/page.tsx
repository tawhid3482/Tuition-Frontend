// "use client";
// import { useGetAllUserQuery } from "@/src/redux/features/user/userApi";
// import React from "react";

// const AboutPage = () => {
//   const { data: users } = useGetAllUserQuery(undefined);
//   console.log(users);
//   return <div>all users</div>;
// };

// export default AboutPage;

"use client";

import { useTestNotification } from "@/src/hooks/useTestNotification";

export default function TestNotificationButton() {
  const { sendTestNotification } = useTestNotification();

  return (
    <div className="">
      <button
        onClick={sendTestNotification}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Send Test Notification
      </button>

      {/* <NotificationBell /> */}
    </div>
  );
}

import axios from "axios";

export const instance = axios.create({
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_API}/auth/refresh-token`,
          {},
          { withCredentials: true },
        );

        return instance(originalRequest);
      } catch {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  },
);


// import axios from "axios";

// export const instance = axios.create({
//   withCredentials: true, // cookie পাঠানোর জন্য
//   headers: { "Content-Type": "application/json" },
//   timeout: 60000,
// });

// instance.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error?.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         await axios.post(
//           `${process.env.NEXT_PUBLIC_BACKEND_BASE_API}/auth/refresh-token`,
//           {},
//           { withCredentials: true }
//         );
//         return instance(originalRequest);
//       } catch {
//         if (typeof window !== "undefined") window.location.href = "/login";
//       }
//     }

//     return Promise.reject(error);
//   }
// );

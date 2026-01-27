/* eslint-disable @typescript-eslint/ban-ts-comment */
import { authKey } from "@/src/contants/authKey";
import { getNewAccessToken } from "@/src/services/auth.services";
import { IGenericErrorResponse, ResponseSuccessType } from "@/src/types/common";
import { getFromLocalStorage, setToLocalStorage } from "@/src/utils/local-storage";



import axios from "axios";
import toast from "react-hot-toast";

const instance = axios.create();
instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.headers["Accept"] = "application/json";
instance.defaults.timeout = 60000;

instance.interceptors.request.use(
  function (config) {
    const accessToken = getFromLocalStorage(authKey);
    if (accessToken) {
      config.headers.Authorization = accessToken;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  //@ts-ignore
  function (response) {
    const responseObject: ResponseSuccessType = {
      data: response?.data?.data,
      meta: response?.data?.meta,
    };
    return responseObject;
  },
  async function (error) {
    const config = error.config;
    if (error?.response?.status === 401) {
      if (typeof window !== "undefined") {
        toast.error("Please login to continue");

        setTimeout(() => {
          window.location.href = "/signin";
        }, 1000);
      }
    }
    // console.log(config);
    if (error?.response?.status === 500 && !config.sent) {
      config.sent = true;
      const response = await getNewAccessToken();
      const accessToken = response?.data?.accessToken;
      config.headers["Authorization"] = accessToken;
      setToLocalStorage(authKey, accessToken);
    //   setAccessToken(accessToken);
      return instance(config);
    } else {
      const responseObject: IGenericErrorResponse = {
        statusCode: error?.response?.data?.statusCode || 500,
        message: error?.response?.data?.message || "Something went wrong!!!",
        errorMessages: error?.response?.data?.message,
      };
      return responseObject;
    }
  }
);

export { instance };


// /* eslint-disable @typescript-eslint/ban-ts-comment */

// import axios from "axios";
// import { authKey } from "@/contants/authkey";
// import { getFromLocalStorage, setToLocalStorage } from "@/utils/local-storage";
// import { getNewAccessToken } from "@/services/auth.services";
// import setAccessToken from "@/services/actions/setAccessToken";
// import toast from "react-hot-toast";

// const instance = axios.create({
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
//   timeout: 60000,
// });

// // Request interceptor
// instance.interceptors.request.use(
//   (config) => {
//     const accessToken = getFromLocalStorage(authKey);
//     if (accessToken) {
//       config.headers.Authorization = accessToken;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor
// instance.interceptors.response.use(
//   (response) => response, // ❌ keep raw response for RTK Query
//   async (error) => {
//     const config = error.config;
//     if (error?.response?.status === 401 && typeof window !== "undefined") {
//       toast.error("Please login to continue");
//       setTimeout(() => {
//         window.location.href = "/signin";
//       }, 1000);
//     }

//     // Try refreshing token once for 500 errors
//     if (error?.response?.status === 500 && !config.sent) {
//       config.sent = true;
//       const response = await getNewAccessToken();
//       const accessToken = response?.data?.accessToken;
//       config.headers["Authorization"] = accessToken;
//       setToLocalStorage(authKey, accessToken);
//       setAccessToken(accessToken);
//       return instance(config);
//     }

//     return Promise.reject(error);
//   }
// );

// export { instance };

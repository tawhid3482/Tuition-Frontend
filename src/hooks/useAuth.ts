import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";

const useAuth = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  return {
    isAuthenticated,
    user,
  };
};

export default useAuth;

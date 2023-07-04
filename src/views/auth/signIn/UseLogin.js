import { AUTH_URL } from "constants/Url";
import AuthHelper from "helpers/AuthHelper";
import FetchHelper from "helpers/FetchHelper";
import { useEffect, useState } from "react";

const UseLogin = (router) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const authHelper = AuthHelper(router);
  const fetchHelper = FetchHelper(router);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const login = async () => {
    try {
      setLoading(() => true);
      let url = `${AUTH_URL}/auth/login`;
      let response = await fetchHelper.post(url, {
        username,
        password,
        fcmToken: "",
      });

      await authHelper.setData(response.data);
      setLoading(() => true);
      router.push("/admin");
    } catch (error) {
      console.log("LOGIN ERROR", error);
      setHasError(true);
      setError(error);
      setLoading(() => true);
    }
  };

  const dismissError = () => {
    setError("");
    setHasError(false);
  };

  const checkAuthentication = async () => {
    const user = await authHelper.getUser();
    console.log("user", user);
    if (user) {
      router.push("/admin");
    }
  };

  return {
    error,
    hasError,
    loading,
    setUsername,
    setPassword,
    login,
    dismissError,
  };
};

export default UseLogin;

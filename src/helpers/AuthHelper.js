const AuthHelper = (router) => {
  const AUTH_TOKEN_KEY = "myauthtoken";
  const AUTH_REFRESH_KEY = "myauthtokenrefresh";

  const setData = async (data) => {
    await localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    await localStorage.setItem(AUTH_REFRESH_KEY, data.refreshToken);
  };

  const getToken = async () => {
    return await localStorage.getItem(AUTH_TOKEN_KEY);
  };

  const getRefreshToken = async () => {
    return await localStorage.getItem(AUTH_REFRESH_KEY);
  };

  const removeToken = async () => {
    await localStorage.removeItem(AUTH_TOKEN_KEY);
    await localStorage.removeItem(AUTH_REFRESH_KEY);
  };

  function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  }

  const getUser = async () => {
    const token = await getToken();
    if (!token) {
      return false;
    }

    return parseJwt(token);
  };

  const signOut = async () => {
    await removeToken();
    router.replace('/auth/login');
  }

  return {
    setData,
    getToken,
    getRefreshToken,
    removeToken,
    getUser,
    signOut
  };
};

export default AuthHelper;

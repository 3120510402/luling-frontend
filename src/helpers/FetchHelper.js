import AuthHelper from "./AuthHelper";

const HTTP_METHOD = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};
const FetchHelper = (router) => {
  return {
    get: async (url, headers = {}) => {
      return await Request(router, url, HTTP_METHOD.GET, {}, headers);
    },
    post: async (url, body = {}, headers = {}) => {
      return await Request(router, url, HTTP_METHOD.POST, body, headers);
    },
    put: async (url, body = {}, headers = {}) => {
      body = {
        ...body,
      };
      return await Request(router, url, HTTP_METHOD.PUT, body, headers);
    },
    delete: async (url, body = {}, headers = {}) => {
      body = {
        ...body,
      };
      return await Request(router, url, HTTP_METHOD.DELETE, body, headers);
    },
  };
};

const Request = async (router, url, method, requestBody, headers) => {
  const authHelper = AuthHelper(router);
  try {
    // * HANDLE HEADERS
    headers = {
      ...headers,
      //   "Content-Type": "multipart/form-data",
      Accept: "application/json",
      "User-Agent": "SILAMPARIWEB"
    };
    // append auth
    let token = await authHelper.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    if (!headers.hasOwnProperty("Content-Type")) {
      headers["Content-Type"] = "application/json";
    }

    // * HANDLE REQUEST BODY
    console.log("requestBody", requestBody);
    let body;

    if (method !== HTTP_METHOD.GET) {
      if (headers["Content-Type"] === "multipart/form-data") {
        body = new FormData();
        if (method === HTTP_METHOD.POST) {
          for (let key in requestBody) {
            let itemBody = requestBody[key];
            if (typeof itemBody === "string") {
              body.append(key, itemBody);
            } else if (typeof itemBody === "object") {
              if (itemBody instanceof File) {
                body.append(key, itemBody, itemBody.name);
              } else if (itemBody.length) {
                for (let itemBodyKey in itemBody) {
                  body.append(`${key}[]`, itemBody[itemBodyKey]);
                }
              }
            }
          }
        }
        delete headers["Content-Type"];
        // headers["Accept"] = "*/*";
      } else {
        body = JSON.stringify(requestBody);
      }
    }

    let response = await fetch(url, {
      method,
      body,
      headers,
    });

    response = await response.json();
    if (response.statusCode === 401) {
      // TODO: Redirect to login page
      await authHelper.signOut();
    } else if (response.statusCode >= 200 && response.statusCode <= 299) {
      return response;
    } else {
      throw response;
    }
  } catch (error) {
    let message = "";
    if (typeof error == "object") {
      if (error.hasOwnProperty("statusCode")) {
        let errMessage = error.message;
        if (typeof errMessage == "object") {
          message = errMessage[0];
        } else {
          message = errMessage;
        }
      } else {
        message = error;
      }
    } else {
      message = error;
    }

    console.log("REQUEST ERROR");
    console.log(message);
    throw message;
  }
};

export default FetchHelper;

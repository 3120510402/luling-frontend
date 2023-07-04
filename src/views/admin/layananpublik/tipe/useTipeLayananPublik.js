import { LAYANAN_PUBLIK_URL } from "constants/Url";
import FetchHelper from "helpers/FetchHelper";
import { useEffect, useState } from "react";

const useTipeLayananPublik = (router) => {
  const BASE_URL = `${LAYANAN_PUBLIK_URL}/type`;

  // dependencies
  const fetchHelper = FetchHelper(router);

  // state
  const [data, setData] = useState([]);
  const [metaData, setMetaData] = useState({
    pageCount: 0,
  });
  const formDefault = {
    name: "",
    description: "",
    icon: "",
  };
  const [form, setForm] = useState(formDefault);
  const [isModalOpen, SetIsModalOpen] = useState(false);
  const [isModalOpenImage, SetIsModalOpenImage] = useState(false);

  const [filter, setFilter] = useState({
    page: 1,
    take: 10,
    search: "",
  });

  //  * NOTIFICATION HANDLER
  const [notification, setNotification] = useState({
    title: "",
    message: "",
    type: "",
    active: false,
  });
  const setError = (message) => {
    if (typeof message !== "string") message = "Telah terjadi kesalahan";
    setNotification(() => ({
      message,
      title: "Error !",
      type: "error",
      active: true,
    }));
  };

  const setSuccess = (message) => {
    setNotification(() => ({
      message,
      title: "Success !",
      type: "success",
      active: true,
    }));
  };

  const dismissNotification = () => {
    setNotification(() => ({
      title: "",
      message: "",
      type: "",
      active: false,
    }));
  };
  //  * END OF NOTIFICATION HANDLER

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [filter]);

  const fetchAllData = async () => {
    try {
      let filters = [];
      for (let key in filter) {
        console.log(key);
        if (key !== undefined) {
          filters.push(`${key}=${filter[key]}`);
        }
      }

      const url = `${BASE_URL}?${filters.join("&")}`;
      const response = await fetchHelper.get(url);

      setData(() => response.data);
      setMetaData(() => response.meta);
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  const handleFilter = (name, value) => {
    setFilter((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleForm = (name, value) => {
    setForm((prevData) => ({ ...prevData, [name]: value }));
  };

  const onModalClose = () => {
    SetIsModalOpen(() => false);
  };

  const onModalCloseImage = () => {
    SetIsModalOpenImage(() => false);
  };

  const actionCreate = async () => {
    if (form.id) {
      setForm(() => formDefault);
    }

    SetIsModalOpen(() => true);
  };

  const actionEdit = async (data) => {
    setForm((prev) => ({ ...prev, ...data }));
    SetIsModalOpen(() => true);
  };

  const actionDelete = async (data) => {
    try {
      let url = `${BASE_URL}/${data.id}`;
      await fetchHelper.delete(url);

      await fetchAllData();
    } catch (error) {
      setError(error);
    }
  };

  const handleSubmit = async () => {
    let body = {
      name: form.name,
      description: form.description,
    };
    try {
      let url = `${BASE_URL}`;

      if (form.id) {
        url += `/${form.id}`;
        const response = await fetchHelper.put(url, body);
        setSuccess(response.message);
      } else {
        body["icon"] = form.icon;
        const response = await fetchHelper.post(url, body, {
          "Content-Type": "multipart/form-data",
        });
        setSuccess(response.message);
      }

      await fetchAllData();
    } catch (error) {
      setError(error);
    }
    onModalClose();
  };

  const actionEditImage = async (data) => {
    setForm((prev) => ({ ...prev, ...data }));
    SetIsModalOpenImage(() => true);
  };


  const handleUploadImage = async () => {
    let body = {
      icon: form.icon,
    };
    try {
      let url = `${BASE_URL}`;

      if (form.id) {
        url += `/${form.id}/update-image`;
        const response = await fetchHelper.post(url, body, {
          "Content-Type": "multipart/form-data",
        });
        setSuccess(response.message);
      } else {
        setError("ID tidak ditemukan");
        return;
      }

      await fetchAllData();
    } catch (error) {
      setError(error);
    }
    onModalCloseImage();
  };

  return {
    data,
    filter,
    metaData,
    isModalOpen,
    isModalOpenImage,
    notification,
    form,
    dismissNotification,
    handleFilter,
    onModalClose,
    onModalCloseImage,
    actionCreate,
    actionEdit,
    actionEditImage,
    actionDelete,
    handleForm,
    handleSubmit,
    handleUploadImage,
  };
};

export default useTipeLayananPublik;

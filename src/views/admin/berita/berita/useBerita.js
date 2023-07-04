import { BERITA_URL } from "constants/Url";
import FetchHelper from "helpers/FetchHelper";
import { useEffect, useState } from "react";

const useBerita = (router) => {
  const BASE_URL = `${BERITA_URL}/news`;

  // dependencies
  const fetchHelper = FetchHelper(router);

  // state
  const [data, setData] = useState([]);
  const [metaData, setMetaData] = useState({
    pageCount: 0,
  });
  const formDefault = {
    image: "",
    title: "",
    content: "",
    tags: "",
    categories: [],
    listCategory: [],
  };
  const [form, setForm] = useState(formDefault);
  const [isModalOpen, SetIsModalOpen] = useState(false);

  const [filter, setFilter] = useState({
    page: 1,
    take: 10,
    search: "",
  });

  const [error, setError] = useState({
    error: "",
    hasError: false,
  });

  useEffect(() => {
    initCategories();
    fetchAllData();
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [filter]);

  const initCategories = async () => {
    try {
      const url = `${BERITA_URL}/category/select`;
      const response = await fetchHelper.get(url);

      handleForm("listCategory", response.data);
    } catch (error) {
      setError(() => ({ error, hasError: true }));
    }
  };

  const fetchAllData = async () => {
    try {
      let filters = [];
      for (let key in filter) {
        if (key != undefined) {
          filters.push(`${key}=${filter[key]}`);
        }
      }
      filters.push('sort[news_id]=DESC');

      const url = `${BASE_URL}?${filters.join("&")}`;
      console.log("URL", url);
      const response = await fetchHelper.get(url);

      setData(() => response.data);
      setMetaData(() => response.meta);
    } catch (error) {
      if (typeof error !== "string")
        error = "Telah terjadi kesalahn saat menjalankan aksi";
      setError(() => ({ error, hasError: true }));
    }
  };

  const handleFilter = (name, value) => {
    setFilter((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleForm = (name, value) => {
    setForm((prevData) => ({ ...prevData, [name]: value }));
  };

  const dismissError = () => {
    setError(() => ({ error: "", hasError: false }));
  };

  const onModalClose = () => {
    SetIsModalOpen(() => false);
  };

  const actionCreate = async () => {
    if (form.id) {
      setForm(() => formDefault);
    }
    SetIsModalOpen(() => true);
  };

  const actionEdit = async (data) => {
    data = { ...form, ...data };
    setForm(() => data);
    console.log(form);
    SetIsModalOpen(() => true);
  };

  const actionDelete = async (data) => {
    try {
      if (!window.confirm("Yakin ingin menghapus data berita ini ?")) {
        return false;
      }
      let url = `${BASE_URL}/${data.id}`;
      await fetchHelper.delete(url);

      await fetchAllData();
    } catch (error) {
      if (typeof error !== "string")
        error = "Telah terjadi kesalahn saat menjalankan aksi";
      setError(() => ({ error, hasError: true }));
    }
  };

  const handleSubmit = async () => {
    try {
      let body = {
        id: form.id,
        title: form.title,
        tags: form.tags.join(','),
        content: form.content,
        image: form.image,
        categories: [],
      };

      for (let i in form.categories) {
        body.categories.push(form.categories[i].value);
      }

      let url = `${BASE_URL}`;

      if (body.id) {
        url += `/${body.id}`;
        await fetchHelper.put(url, body, {
          "Content-Type": "multipart/form-data",
        });
      } else {
        await fetchHelper.post(url, body, {
          "Content-Type": "multipart/form-data",
        });
      }

      await fetchAllData();
    } catch (err) {
      console.log("error", err);
      let error = "";
      if (typeof err !== "string")
        error = "Terjadi kesalahan saat mengirim data";
      else error = err;
      setError(() => ({ error, hasError: true }));
    }
    onModalClose();
  };

  return {
    data,
    filter,
    metaData,
    isModalOpen,
    error,
    form,
    dismissError,
    handleFilter,
    onModalClose,
    actionCreate,
    actionEdit,
    actionDelete,
    handleForm,
    handleSubmit,
  };
};

export default useBerita;

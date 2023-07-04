import { BERITA_URL } from "constants/Url";
import { AGENDA_URL } from "constants/Url";
import FetchHelper from "helpers/FetchHelper";
import { useEffect, useState } from "react";

const useAgenda = (router) => {
  const BASE_URL = `${BERITA_URL}/category`;

  // dependencies
  const fetchHelper = FetchHelper(router);

  // state
  const [data, setData] = useState([]);
  const [metaData, setMetaData] = useState({
    pageCount: 0,
  });
  const formDefault = {
    name: "",
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
        if (key != undefined) {
          filters.push(`${key}=${filter[key]}`);
        }
      }

      const url = `${BASE_URL}?${filters.join("&")}`;
      console.log("URL", url);
      const response = await fetchHelper.get(url);

      setData(() => response.data);
      setMetaData(() => response.meta);
    } catch (error) {
      console.log(error);
      setError(() => ({ error, hasError: true }));
    }
  };

  const handleFilter = (name, value) => {
    setFilter((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleForm = (e) => {
    const { name, value } = e.target;
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
    console.log(data)
    setForm((prev) => ({ ...prev, ...data }));
    SetIsModalOpen(() => true);
  };
  const actionDelete = async (data) => {
    try {
      let url = `${BASE_URL}/${data.id}`;
      await fetchHelper.delete(url);

      await fetchAllData();
    } catch (error) {
      setError(() => ({ error, hasError: true }));
    }
  };

  const handleSubmit = async () => {
    try {
      let url = `${BASE_URL}`;

      if (form.id) {
        url += `/${form.id}`;
        await fetchHelper.put(url, form);
      } else {
        await fetchHelper.post(url, form);
      }

      await fetchAllData();
    } catch (error) {
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

export default useAgenda;

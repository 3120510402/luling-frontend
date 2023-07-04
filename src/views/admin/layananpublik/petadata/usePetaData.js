import { WILAYAH_URL } from "constants/Url";
import { LAYANAN_PUBLIK_URL } from "constants/Url";
import FetchHelper from "helpers/FetchHelper";
import { useEffect, useState } from "react";

const useTipeLayananPublik = (router) => {
  const BASE_URL = `${LAYANAN_PUBLIK_URL}/place`;

  // dependencies
  const fetchHelper = FetchHelper(router);

  // state
  const [data, setData] = useState([]);
  const [metaData, setMetaData] = useState({
    pageCount: 0,
  });

  const [select, setSelect] = useState({
    type: [],
    typeChild: {},
    kecamatan: [],
    kecamatanChild: {},
  });

  const [map, setMap] = useState({
    zoom: 11,
    center: {
      lat: -3.279246,
      lng: 102.879691,
    },
    polygon: [],
    coordinate: null,
    marker: null,
    key: 0,
  });

  const formDefault = {
    name: "",
    address: "",
    phone: "",
    email: "",
    kelurahanId: "",
    kecamatanId: "",
    latitude: "",
    longitude: "",
    typeId: "",
    subtypeId: "",
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
    const init = async () => {
      await fetchTypes();
      await fetchKecamatan();
      await fetchAllData();
    };

    init();
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [filter]);

  useEffect(() => {
    console.log(form);
    console.log(select.typeChild[`${form.typeId}`]);
  }, [form]);

  const fetchTypes = async () => {
    try {
      const url = `${LAYANAN_PUBLIK_URL}/type/select`;
      const response = await fetchHelper.get(url);

      setSelect((prev) => ({ ...prev, type: response.data.parent }));
      setSelect((prev) => ({ ...prev, typeChild: response.data.child }));
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };
  const fetchKecamatan = async () => {
    try {
      const url2 = `${WILAYAH_URL}/kecamatan/select`;
      const response2 = await fetchHelper.get(url2);

      setSelect((prev) => ({ ...prev, kecamatan: response2.data.parent }));
      setSelect((prev) => ({ ...prev, kecamatanChild: response2.data.child }));
      console.log(select);
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };
  const fetchPolygon = async (kelurahanId) => {
    if (!form.kecamatanId || !kelurahanId) {
      console.log("---FAILED FETCH POLYGON----");
      return;
    }

    try {
      const url2 = `${WILAYAH_URL}/kecamatan/${form.kecamatanId}/geomap/${kelurahanId}`;
      const response2 = await fetchHelper.get(url2);

      const temp = [];
      if (response2.data.length > 0) {
        for (let i = 0; i < response2.data.length; i++) {
          let item = response2.data[i];
          temp.push({ lat: item.latitude, lng: item.longitude });
        }
        setMap((prev) => ({ ...prev, polygon: temp, key: prev.key + 1 }));
      }
      console.log(temp);
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  const fetchAllData = async () => {
    try {
      let filters = [];
      if (filter.page === "") {
        handleFilter("page", 1);
        return;
      }
      if (filter.take === "" || filter.take < 5) {
        handleFilter("take", 5);
        return;
      }

      for (let key in filter) {
        if (key !== undefined) {
          filters.push(`${key}=${filter[key]}`);
        }
      }
      filters.push(`sort[id]=desc`);

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
    await fetchPolygon(form.kelurahanId);
    SetIsModalOpen(() => true);
  };

  const actionDelete = async (data) => {
    try {
      if (!window.confirm("Apakah anda yakin menghapus data peta ini ?")) {
        return false;
      }
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
      address: form.address,
      phone: form.phone,
      email: form.email,
      kelurahanId: form.kelurahanId,
      kecamatanId: form.kecamatanId,
      latitude: form.latitude,
      longitude: form.longitude,
      typeId: form.typeId,
      subtypeId: form.subtypeId,
    };

    try {
      let url = `${BASE_URL}`;

      if (form.id) {
        url += `/${form.id}`;
        const response = await fetchHelper.put(url, body);
        setSuccess(response.message);
      } else {
        const response = await fetchHelper.post(url, body);
        setSuccess(response.message);
      }

      await fetchAllData();
    } catch (error) {
      setError(error);
    }
    onModalClose();
  };

  return {
    select,
    data,
    filter,
    metaData,
    isModalOpen,
    notification,
    form,
    dismissNotification,
    handleFilter,
    onModalClose,
    onModalCloseImage,
    actionCreate,
    actionEdit,
    actionDelete,
    handleForm,
    handleSubmit,
    fetchPolygon,
    map,
    setMap,
  };
};

export default useTipeLayananPublik;

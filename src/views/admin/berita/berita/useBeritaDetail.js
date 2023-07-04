import { BERITA_URL } from "constants/Url";
import { ContentState, EditorState, convertFromHTML } from "draft-js";
import FetchHelper from "helpers/FetchHelper";
import htmlToDraft from "html-to-draftjs";
import { useEffect, useState } from "react";

const useBeritaDetail = (router, id, location) => {
  const BASE_URL = `${BERITA_URL}/news`;

  // dependencies
  const fetchHelper = FetchHelper(router);

  // state
  const [data, setData] = useState([]);

  const formDefault = {
    image: "",
    title: "",
    content: "",
    tags: "",
    categories: [],
    listCategory: [],
    reactions: {},
    comments: [],
  };
  const [form, setForm] = useState(formDefault);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const [notification, setNotification] = useState({
    title: "",
    message: "",
    type: "",
    active: false,
  });

  useEffect(() => {
    const init = async () => {
      await initCategories();
      await initReactions();
      await initComments();
      await fetchData();
      console.log(location.pathname);
      location.pathname.includes(data.title);
    };

    init();
  }, []);

  const setError = (message) => {
    if(typeof message !== "string") message = "Telah terjadi kesalahan"
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

  const initCategories = async () => {
    try {
      const url = `${BERITA_URL}/category/select`;
      const response = await fetchHelper.get(url);
      handleForm("listCategory", response.data);
    } catch (error) {
      setError(error);
    }
  };

  const initComments = async () => {
    try {
      const url = `${BERITA_URL}/comments/${id}?sort[id]=desc`;
      const response = await fetchHelper.get(url);
      handleForm("comments", response.data);
    } catch (error) {
      setError(error);
    }
  };

  const initReactions = async () => {
    try {
      const url = `${BERITA_URL}/reaction/${id}`;
      const response = await fetchHelper.get(url);
      handleForm("reactions", response.data.count);
    } catch (error) {
      setError(error);
    }
  };

  const fetchData = async () => {
    try {
      const url = `${BASE_URL}/${id}`;
      const response = await fetchHelper.get(url);

      setData(() => response.data);
      setForm((prev) => ({
        ...prev,
        title: response.data.title,
        tags: response.data.tags.split(','),
        content: response.data.content,
      }));
      setEditorState(
        EditorState.createWithContent(
          ContentState.createFromBlockArray(
            convertFromHTML(response.data.content)
          )
        )
      );
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  const handleForm = (name, value) => {
    setForm((prevData) => ({ ...prevData, [name]: value }));
  };

  const dismissNotification = () => {
    setNotification(() => ({
      title: "",
      message: "",
      type: "",
      active: false,
    }));
  };

  const actionDelete = async (data) => {
    try {
      let url = `${BASE_URL}/${data.id}`;
      await fetchHelper.delete(url);

      await fetchData();
    } catch (error) {
      setError(error);
    }
  };

  const handleSubmitImage = async () => {
    try {
      let body = {
        image: form.image,
      };

      if (!body.image) {
        setError("Gambar tidak boleh kosong");
        return;
      }

      let url = `${BASE_URL}/${id}/update-image`;
      const response = await fetchHelper.post(url, body, {
        "Content-Type": "multipart/form-data",
      });

      await fetchData();
      setSuccess(response.message);
    } catch (err) {
      console.log("error", err);
      let error = "";
      if (typeof err == "object")
        error = "Terjadi kesalahan saat mengirim data";
      else error = err;
      setError(error);
    }
  };

  const handleSubmit = async () => {
    try {
      let body = {
        title: form.title,
        tags: form.tags.join(','),
        content: form.content,
      };

      let url = `${BASE_URL}/${id}`;
      const response = await fetchHelper.put(url, body);

      await fetchData();
      setSuccess(response.message);
    } catch (err) {
      let error = "";
      if (typeof err == "object")
        error = "Terjadi kesalahan saat mengirim data";
      else error = err;
      setError(error);
    }
  };

  const handleSubmitKategori = async () => {
    try {
      if (!form.category) {
        setError("Harap pilih kategori terlebih dahulu");
        return;
      }

      let url = `${BASE_URL}/${id}/add-category/${form.category}`;
      const response = await fetchHelper.post(url);

      await fetchData();
      setSuccess(response.message);
    } catch (err) {
      let error = "";
      if (typeof err == "object")
        error = "Terjadi kesalahan saat mengirim data";
      else error = err;
      setError(error);
    }
  };

  const handleRemoveKategori = async (idCategory) => {
    try {
      if (!idCategory) {
        setError("Harap pilih kategori terlebih dahulu");
        return;
      }

      let url = `${BASE_URL}/${id}/remove-category/${idCategory}`;
      const response = await fetchHelper.post(url);

      await fetchData();
      setSuccess(response.message);
    } catch (err) {
      let error = "";
      if (typeof err == "object")
        error = "Terjadi kesalahan saat mengirim data";
      else error = err;
      setError(error);
    }
  };

  return {
    data,
    notification,
    form,
    editorState,
    dismissNotification,
    actionDelete,
    handleForm,
    handleSubmit,
    handleSubmitImage,
    setEditorState,
    handleSubmitKategori,
    handleRemoveKategori,
  };
};

export default useBeritaDetail;

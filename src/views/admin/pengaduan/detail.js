/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  GridItem,
  Image,
  Menu,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import Card from "components/card/Card";
// Default theme.
import "@vime/core/themes/default.css";
import { AlertComponent } from "components/mycomponents/useNotification";
import useNotification from "components/mycomponents/useNotification";
import { useEffect, useState } from "react";
import FetchHelper from "helpers/FetchHelper";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { PENGADUAN_URL } from "constants/Url";
import { MdAdd, MdEdit } from "react-icons/md";
import MyMap from "components/mycomponents/my-map";
import CustomInput from "components/mycomponents/custom-input";
import { AUTH_URL } from "constants/Url";
import { IoMdEye, IoMdTrash } from "react-icons/io";
import AuthHelper from "helpers/AuthHelper";
import StringHelper from "helpers/StringHelper";

export default function PengaduanDetailPage() {
  const notificationHook = useNotification();
  const router = useHistory();
  const { id } = useParams();
  const fetchWrapper = FetchHelper(router);
  const [user, setUsers] = useState({});

  const [modal, setModal] = useState({
    show: false,
  });
  const [form, setForm] = useState({
    dispositionTo: null,
  });
  const [formRespond, setFormRespond] = useState({
    image: null,
    message: null,
  });
  const [data, setData] = useState([]);
  const [respond, setRespond] = useState([]);
  const [disposisi, setDisposisi] = useState([]);

  const [dispositionTarget, setDispositionTarget] = useState([]);

  const dismissModal = (targetId) => {
    setModal((prevState) => ({
      ...prevState,
      [targetId]: false,
    }));
  };

  const openModal = (targetId) => {
    setModal((prevState) => ({
      ...prevState,
      [targetId]: true,
    }));
  };

  const actionTambahRespon = async () => {
    try {
      if (!data?.id || !formRespond.message || !formRespond.image) {
        notificationHook.error("Silahkan isi form");
        return;
      }

      const body = {
        message: formRespond.message,
        image: formRespond.image,
      };

      const response = await fetchWrapper.post(
        `${PENGADUAN_URL}/respond/${data?.id}`,
        body,
        {
          "Content-Type": "multipart/form-data",
        }
      );
      console.log(response.data);
      notificationHook.success(response.message);
      await fetchResponses();
    } catch (e) {
      notificationHook.error(e.toString());
    }
  };

  const aksiDisposisikan = async () => {
    try {
      const response = await fetchWrapper.post(
        `${PENGADUAN_URL}/disposisi/${id}`,
        {
          dispositionTo: form.dispositionTo,
        }
      );
      console.log(response.data);
      dismissModal("show");
      notificationHook.success("Disposisi berhasil disimpan");
      fetchDisposisi();
    } catch (e) {
      notificationHook.error(e.toString());
    }
  };

  const aksiHapus = async (targetId) => {
    try {
      if (!window.confirm("Apakah anda yakin menghapus disposisi ini ?")) {
        return false;
      }
      const response = await fetchWrapper.delete(
        `${PENGADUAN_URL}/disposisi/${targetId}`
      );
      notificationHook.success("Disposisi berhasil dihapus");
      fetchDisposisi();
    } catch (e) {
      notificationHook.error(e.toString());
    }
  };

  const fetchResponses = async () => {
    try {
      const response = await fetchWrapper.get(`${PENGADUAN_URL}/respond/${id}`);
      console.log(response.data);
      setRespond(() => response.data);
    } catch (e) {
      notificationHook.error(e.toString());
    }
  };

  const fetchDispositionTarget = async () => {
    try {
      const response = await fetchWrapper.get(
        `${AUTH_URL}/users/search/3?take=200`
      );
      console.log(response.data);
      let temp = [];
      for (let i = 0; i < response.data.length; i++) {
        temp.push({
          value: response.data[i].id,
          label: response.data[i].username,
        });
      }
      setDispositionTarget(() => temp);
    } catch (e) {
      notificationHook.error(e.toString());
    }
  };

  const fetchComplaint = async () => {
    try {
      console.log(`${PENGADUAN_URL}/pengaduan/${id}`);
      const response = await fetchWrapper.get(
        `${PENGADUAN_URL}/pengaduan/${id}`
      );
      console.log(response.data.lat);
      console.log(response.data.long);
      setData(() => response.data);
    } catch (e) {
      notificationHook.error(e.toString());
    }
  };

  const fetchUser = async () => {
    try {
      const user = await AuthHelper().getUser();
      setUsers(() => user);
    } catch (error) {
      console.log("user", error);
    }
  };

  const handleForm = (name, value = null) => {
    if (typeof name === "string") {
      // skip not exist schema
      if (form[name] === undefined) return;

      setForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setForm((prev) => ({ ...prev, ...name }));
    }
  };

  const fetchDisposisi = async () => {
    try {
      const response = await fetchWrapper.get(
        `${PENGADUAN_URL}/disposisi/${id}`
      );
      // console.log(response.data);
      setDisposisi(() => response.data);
    } catch (e) {
      notificationHook.error(e.toString());
    }
  };

  useEffect(() => {
    const initalRequest = async () => {
      await fetchUser();
      await fetchComplaint();
      await fetchDisposisi();
      await fetchResponses();
      await fetchDispositionTarget();
    };

    initalRequest();
  }, []);

  const Kolom = ({ title, value }) => {
    return (
      <Tr>
        <Th>{title}</Th>
        <Td style={{ color: "#444" }}>{value}</Td>
      </Tr>
    );
  };

  const textColor = useColorModeValue("secondaryGray.900", "white");
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {/* Modal Disposisi */}
      <Modal
        onClose={() => dismissModal("show")}
        size={"xl"}
        isOpen={modal.show}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Disposisi</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CustomInput
              label="Disposisi Ke"
              type="select"
              value={dispositionTarget.find(
                ({ value }) => value === form.dispositionTo
              )}
              onChange={(value) => handleForm({ dispositionTo: value })}
              options={dispositionTarget}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => dismissModal("show")}>Close</Button>
            <Button colorScheme="green" onClick={() => aksiDisposisikan()}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <SimpleGrid mb="20px" spacing={{ base: "20px", xl: "20px" }}>
        <Card
          direction="column"
          w="100%"
          px="0px"
          overflowX={{ sm: "scroll", lg: "hidden" }}
        >
          <AlertComponent hook={notificationHook} />
          <Flex px="25px" justify="space-between" mb="20px" align="center">
            <Text
              color={textColor}
              fontSize="22px"
              fontWeight="700"
              lineHeight="100%"
            >
              Detail Pengaduan
            </Text>
            <Menu />
          </Flex>
          {data.lat && data.long && <MyMap lat={data.lat} lng={data.long} />}
        </Card>
      </SimpleGrid>

      <SimpleGrid
        columns={{ sm: 12, md: 12 }}
        color={"white"}
        marginBottom={4}
        gap={3}
      >
        <GridItem colSpan={8}>
          <Card
            direction="column"
            w="100%"
            px="0px"
            overflowX={{ sm: "scroll", lg: "hidden" }}
          >
            <Flex>
              <Table>
                <Tbody>
                  <Kolom title={"Judul"} value={data.title} />
                  <Kolom title={"Konten"} value={data.content} />
                  <Kolom
                    title={"Publikasi"}
                    value={data.show_public === 1 ? "Tidak" : "Ya"}
                  />
                  <Kolom
                    title={"Anonymous"}
                    value={data.is_anonymous === 0 ? "Tidak" : "Ya"}
                  />
                  <Kolom
                    title={"Jml Disposisi"}
                    value={
                      data.dispositionCount > 0
                        ? `${data.dispositionCount} kali`
                        : "Belum Didisposisikan"
                    }
                  />
                  <Kolom
                    title={"Titik Lokasi"}
                    value={
                      <a
                        style={{
                          padding: "2px",
                          paddingLeft: "8px",
                          paddingRight: "8px",
                          borderRadius: "4px",
                          background: "#5446C3",
                          color: "white",
                        }}
                        href={`https://www.google.com/maps/@${data.lat},${data.long},15z`}
                        target="_blank"
                      >
                        Buka
                      </a>
                    }
                  />
                  <Kolom
                    title="Status"
                    value={
                      data &&
                      data._status && (
                        <span
                          style={{
                            padding: "2px",
                            background: data._status.color,
                            display: "block",
                            color: "white",
                            textAlign: "center",
                            borderRadius: "5px",
                          }}
                        >
                          {data._status.msg}
                        </span>
                      )
                    }
                  />
                </Tbody>
              </Table>
            </Flex>
          </Card>

          <Card
            direction="column"
            w="100%"
            px="0px"
            style={{ marginTop: "1rem" }}
            overflowX={{ sm: "scroll", lg: "hidden" }}
          >
            <Flex px="25px" justify="space-between" mb="20px" align="center">
              <Text
                color={textColor}
                fontSize="22px"
                fontWeight="700"
                lineHeight="100%"
              >
                List Disposisi
              </Text>
              {user && user.roleId === 1 && (
                <Button colorScheme="blue" onClick={() => openModal("show")}>
                  <MdAdd />
                  Tambah
                </Button>
              )}
            </Flex>
            <Flex>
              <Table>
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Kepada</Th>
                    <Th>Oleh</Th>
                    <Th>STATUS</Th>
                    <Th>Aksi</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {disposisi?.map((item, idx) => (
                    <Tr>
                      <Td style={{ color: "#444" }}>{idx + 1}</Td>
                      <Td style={{ color: "#444" }}>
                        {item._dispositionTo?.name}
                      </Td>
                      <Td style={{ color: "#444" }}>
                        {item._dispositionBy?.name}
                      </Td>
                      <Td style={{ color: "#444" }}>
                        {
                          <span
                            style={{
                              padding: "2px",
                              background: item._status.color,
                              display: "block",
                              color: "white",
                              textAlign: "center",
                              borderRadius: "5px",
                            }}
                          >
                            {item._status.msg}
                          </span>
                        }
                      </Td>
                      <Td style={{ color: "#444" }}>
                        {user && user.roleId === 1 && (
                          <Button
                            colorScheme="red"
                            onClick={() => aksiHapus(item.id)}
                          >
                            <IoMdTrash />
                          </Button>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Flex>
          </Card>

          <Card
            direction="column"
            w="100%"
            px="10px"
            style={{ marginTop: "1rem" }}
            overflowX={{ sm: "scroll", lg: "hidden" }}
          >
            <Text
              color={textColor}
              fontSize="22px"
              fontWeight="700"
              lineHeight="100%"
            >
              Form Tanggapan
            </Text>
            <AlertComponent hook={notificationHook} />
            <CustomInput
              label={"Image"}
              type="file"
              name="image"
              onChange={(image) =>
                setFormRespond((prev) => ({ ...prev, image }))
              }
            />
            <CustomInput
              label={"Pesan"}
              type="textarea"
              name="message"
              value={formRespond.message}
              onChange={(message) =>
                setFormRespond((prev) => ({ ...prev, message }))
              }
            />
            <Flex style={{ marginTop: ".5rem" }}>
              <Button
                colorScheme="blue"
                onClick={() => {
                  actionTambahRespon();
                }}
                size="sm"
                variant="outline"
              >
                Simpan
              </Button>
            </Flex>
          </Card>

          <Card
            direction="column"
            w="100%"
            px="10px"
            style={{ marginTop: "1rem" }}
            overflowX={{ sm: "scroll", lg: "hidden" }}
          >
            <Text
              color={textColor}
              fontSize="22px"
              fontWeight="700"
              lineHeight="100%"
            >
              Tanggapan
            </Text>

            <Box>
              {respond &&
                respond.map((item, index) => (
                  <Flex key={index} color="white" py="10px">
                    <Center w="100px">
                      <Avatar
                        _hover={{ cursor: "pointer" }}
                        color="white"
                        name={item?._createdBy?.name ?? "Unknown"}
                        bg="#11047A"
                        size="sm"
                        w="50px"
                        h="50px"
                      />
                    </Center>
                    <Box flex="1">
                      <Text color={textColor} fontSize="14px" fontWeight="700">
                        {item?._createdBy?.name ?? "Unknown"}
                      </Text>
                      <Text
                        style={{ color: "#aaa" }}
                        fontSize="10px"
                        fontWeight="700"
                      >
                        {StringHelper.datetime(item?._createdAt)}
                      </Text>
                      <hr />
                      {item.image !== null && (
                        <a href={item.image} target="_blank">
                          <img
                            src={item.image}
                            style={{
                              width: "150px",
                              height: "auto",
                              borderWidth: "1px",
                              borderStyle: "solid",
                              borderColor: "#aaa",
                              margin: ".5rem",
                            }}
                          />
                        </a>
                      )}
                      <Text color={textColor}>{item?.message}</Text>
                    </Box>
                  </Flex>
                ))}
            </Box>
          </Card>
        </GridItem>
        <GridItem colSpan={4}>
          <Card
            direction="column"
            w="100%"
            px="0px"
            overflowX={{ sm: "scroll", lg: "hidden" }}
          >
            <Image src={data.photo} className="img img-fluid" />
          </Card>
        </GridItem>
      </SimpleGrid>
    </Box>
  );
}

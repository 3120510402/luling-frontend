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
  Square,
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

const useObjects = (defaultValue) => {
  const [obj, setOjb] = useState(defaultValue);

  const handleObj = (name, value = null) => {
    if (typeof name === "string") {
      // skip not exist schema
      if (obj[name] === undefined) return;

      setOjb((prev) => ({ ...prev, [name]: value }));
    } else {
      setOjb((prev) => ({ ...prev, ...name }));
    }
  };

  return [obj, handleObj];
};

export default function PengaduanDetailPage() {
  const notificationHook = useNotification();
  const router = useHistory();
  const { id } = useParams();
  const fetchWrapper = FetchHelper(router);
  const [data, setData] = useState([]);
  const [respond, setRespond] = useState([]);
  const [form, handleForm] = useObjects({
    id: 0,
    message: "",
    image: null,
  });

  const fetchDisposisi = async () => {
    try {
      const response = await fetchWrapper.get(
        `${PENGADUAN_URL}/disposisi/${id}/view`
      );
      setData(() => response.data);
    } catch (e) {
      notificationHook.error(e.toString());
    }
  };

  const fetchResponses = async (complaintId) => {
    try {
      if (complaintId !== undefined) {
        const response = await fetchWrapper.get(
          `${PENGADUAN_URL}/respond/${complaintId}`
        );
        setRespond(() => response.data);
      }
    } catch (e) {
      console.log("ini salahh", complaintId);
      notificationHook.error(e.toString());
    }
  };

  const actionTambahRespon = async () => {
    try {
      if (!data?.complaint?.id || !form.message || !form.image) {
        notificationHook.error("Silahkan isi form");
        return;
      }

      const body = {
        message: form.message,
        image: form.image,
      };
      const response = await fetchWrapper.post(
        `${PENGADUAN_URL}/respond/${data?.complaint?.id}`,
        body,
        {
          "Content-Type": "multipart/form-data",
        }
      );
      await fetchResponses(data?.complaint?.id);
      notificationHook.success(response.message);
    } catch (e) {
      console.log("uwuwuwu");
      notificationHook.error(e.toString());
    }
  };

  useEffect(() => {
    const initalRequest = async () => {
      await fetchDisposisi();
      // if (data !== null) {
      //   await fetchResponses();
      // }
    };

    initalRequest();
  }, []);

  useEffect(() => {
    const init = () => {
      fetchResponses(data?.complaint?.id);
    };

    init();
  }, [data]);

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
      <SimpleGrid mb="20px" spacing={{ base: "20px", xl: "20px" }}>
        <Card
          direction="column"
          w="100%"
          px="0px"
          overflowX={{ sm: "scroll", lg: "hidden" }}
        >
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
          {data?.complaint?.lat && data?.complaint?.long && (
            <MyMap lat={data?.complaint?.lat} lng={data?.complaint?.long} />
          )}
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
                  <Kolom title={"Judul"} value={data?.complaint?.title} />
                  <Kolom title={"Konten"} value={data?.complaint?.content} />
                  <Kolom
                    title={"Publikasi"}
                    value={data?.complaint?.show_public === 1 ? "Tidak" : "Ya"}
                  />
                  <Kolom
                    title={"Anonymous"}
                    value={data?.complaint?.is_anonymous === 0 ? "Tidak" : "Ya"}
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
                        href={`https://www.google.com/maps/@${data?.complaint?.lat},${data?.complaint?.long},15z`}
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
                      data.complaint &&
                      data?.complaint?._status && (
                        <span
                          style={{
                            padding: "2px",
                            background: data?.complaint?._status.color,
                            display: "block",
                            color: "white",
                            textAlign: "center",
                            borderRadius: "5px",
                          }}
                        >
                          {data?.complaint?._status.msg}
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
              onChange={(image) => handleForm("image", image)}
            />
            <CustomInput
              label={"Pesan"}
              type="textarea"
              name="message"
              value={form.message}
              onChange={(message) => handleForm("message", message)}
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
            {data?.complaint?.photo ? (
              <Image src={data?.complaint?.photo} className="img img-fluid" />
            ) : (
              <span style={{ textAlign: "center", color: "#aaa" }}>
                Foto Kosong
              </span>
            )}
          </Card>
        </GridItem>
      </SimpleGrid>
    </Box>
  );
}

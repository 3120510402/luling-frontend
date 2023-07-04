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
import { SEKTORAL_URL } from "constants/Url";

const useObjects = (defaultValue) => {
  const [obj, setOjb] = useState(defaultValue);

  const handleObj = (name, value = null) => {
    if (typeof name === "string") {
      // disable it, only for data sectore
      // if (obj[name] === undefined) return;

      setOjb((prev) => ({ ...prev, [name]: value }));
    } else {
      setOjb((prev) => ({ ...prev, ...name }));
    }
  };

  return [obj, handleObj];
};

export default function SektoralFormPage() {
  const notificationHook = useNotification();
  const router = useHistory();
  const { tahun, bulan } = useParams();
  const fetchWrapper = FetchHelper(router);
  const [data, setData] = useState([]);
  const [respond, setRespond] = useState([]);
  const [form, handleForm] = useObjects({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await FetchHelper(router).get(
          `${SEKTORAL_URL}/data-uraian/me/${tahun}/${bulan}`
        );

        setData(() => response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const aksiSimpan = async () => {
    try {
      const response = await FetchHelper(router).post(
        `${SEKTORAL_URL}/value-data-uraian/update/me/${tahun}/${bulan}`,
        {
          values: form,
        }
      )

      router.push('/admin/sektoral/dinas/list');
    } catch (error) {
      console.log(error);
    }
  };

  const textColor = useColorModeValue("secondaryGray.900", "white");
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {data &&
        data.map((kategori) => {
          return (
            <>
              <SimpleGrid columns={{ sm: 12, md: 12 }} marginBottom={4} gap={3}>
                <GridItem colSpan={12}>
                  <Card
                    direction="column"
                    w="100%"
                    overflowX={{ sm: "scroll", lg: "hidden" }}
                  >
                    <h1
                      style={{
                        fontWeight: "bold",
                        fontSize: "16px",
                      }}
                    >
                      {kategori.namaKategoriUraian}
                    </h1>
                    {kategori.subkategoris.map((sub) => {
                      return (
                        <>
                          <h2
                            style={{
                              fontWeight: "bold",
                              fontSize: "14px",
                            }}
                          >
                            {sub.name}
                          </h2>
                          <Table>
                            <Tbody>
                              {sub.datauraians.map((uraian) => {
                                const value = uraian.values[0] ?? {};
                                return (
                                  <Tr>
                                    <Td>{uraian.uraian}</Td>
                                    <Td>
                                      <input
                                        style={{
                                          backgroundColor: "#fff",
                                          border: "1px solid #aaa",
                                          width: "150px",
                                          height: "25px",
                                          padding: "20px",
                                          borderRadius: "20px",
                                        }}
                                        onChange={(e) => {
                                          console.log(value.id, e.target.value);
                                          handleForm(
                                            `${value.id}`,
                                            e.target.value
                                          );
                                        }}
                                        name="uraian"
                                        value={value.nilai}
                                      />
                                    </Td>
                                    <Td>{uraian.satuan.nama}</Td>
                                  </Tr>
                                );
                              })}
                            </Tbody>
                          </Table>
                        </>
                      );
                    })}
                  </Card>
                </GridItem>
              </SimpleGrid>
            </>
          );
        })}
      <Button onClick={() => aksiSimpan()} colorScheme="blue">
        Simpan
      </Button>
    </Box>
  );
}

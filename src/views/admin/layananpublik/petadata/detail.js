import {
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  Box,
  Button,
  CloseButton,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Image,
  Input,
  Menu,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
  Stack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import {
  useHistory,
  useLocation,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { useEffect, useRef, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import Select from "react-select";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { MdAdd, MdDelete } from "react-icons/md";
import StringHelper from "helpers/StringHelper";
import FetchHelper from "helpers/FetchHelper";
import { LAYANAN_PUBLIK_URL } from "constants/Url";
import { GOOGLE_API_KEY } from "constants/App";
import GoogleMapReact from "google-map-react";

// eslint-disable-next-line import/no-anonymous-default-export
const DetailPetaData = () => {
  let location = useLocation();
  const router = useHistory();
  const { id } = useParams();
  const fetchHelper = FetchHelper(router);

  //  * NOTIFICATION HANDLER
  const [notification, setNotification] = useState({
    title: "",
    message: "",
    type: "",
    active: false,
  });
  const setError = (message) => {
    let msg = "";
    if (typeof error == "string") msg = message;
    else msg = "Telah terjadi kesalahan saat menjalankan aksi";

    setNotification(() => ({
      message: msg,
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

  const [mapKey, setMapKey] = useState(0);
  const [data, setData] = useState({});
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    fetchInit();
  }, []);

  const fetchInit = async () => {
    try {
      let response = await fetchHelper.get(`${LAYANAN_PUBLIK_URL}/place/${id}`);
      console.log(response.data);
      setData(() => response.data);
      setMapKey(() => mapKey + 1);
    } catch (error) {
      setError(error);
    }
  };

  const removeImage = async (imageId) => {
    try {
      const response = await fetchHelper.delete(
        `${LAYANAN_PUBLIK_URL}/placeimage/${imageId}`
      );
      setSuccess(response.message);
      fetchInit();
    } catch (error) {
      setError(error);
    }
  };

  const addImage = async () => {
    try {
      let body = {
        placeId: parseInt(id),
        image: form.image,
      };
      let headers = {
        "Content-Type": "multipart/form-data",
      };

      const response = await fetchHelper.post(
        `${LAYANAN_PUBLIK_URL}/placeimage/${id}`,
        body,
        headers
      );
      setSuccess(response.message);
      fetchInit();
    } catch (error) {
      setError(error);
    }
  };

  const handleApiLoaded = async (map, maps) => {
    const marker = new maps.Marker({
      position: {
        lat: parseFloat(data.latitude),
        lng: parseFloat(data.longitude),
      },
      map,
    });

    marker.setMap(map);
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {notification.active && (
        <Flex marginBottom={4}>
          <Alert status={notification.type} justifyContent="space-between">
            <Box>
              <AlertTitle>{notification.title}</AlertTitle>
              <AlertDescription>{notification.message}</AlertDescription>
            </Box>
            <CloseButton
              alignSelf="flex-start"
              position="relative"
              right={-1}
              top={-1}
              onClick={dismissNotification}
            />
          </Alert>
        </Flex>
      )}

      <Modal onClose={() => setModal(false)} size={"md"} isOpen={modal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tambah Gambar</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Gambar</FormLabel>
              <Input
                type="file"
                name="image"
                accept="image/*"
                onChange={(event) => {
                  if (event.target.files.length > 0) {
                    setForm((prev) => ({
                      ...prev,
                      image: event.target.files[0],
                    }));
                  }
                }}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" onClick={addImage}>
              <MdAdd /> Tambah
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <SimpleGrid
        columns={{ sm: 12, md: 12 }}
        color={"white"}
        marginBottom={4}
        gap={3}
      >
        <GridItem colSpan={{ md: 12, sm: 12 }}>
          <Card>
            <div style={{ height: "50vh", width: "100%" }}>
              <GoogleMapReact
                key={mapKey}
                bootstrapURLKeys={{ key: GOOGLE_API_KEY }}
                defaultCenter={{
                  lat: -3.279246,
                  lng: 102.879691,
                }}
                defaultZoom={12}
                geo
                onGoogleApiLoaded={({ map, maps }) =>
                  handleApiLoaded(map, maps)
                }
                yesIWantToUseGoogleMapApiInternals
              ></GoogleMapReact>
            </div>
          </Card>
        </GridItem>
        <GridItem colSpan={{ md: 4, sm: 12 }}>
          <Card>
            <h2
              style={{
                color: "black",
                fontSize: "1.3rem",
                textAlign: "center",
              }}
            >
              Detail Peta Data
            </h2>

            <Table style={{ color: "black" }}>
              <Tbody>
                <Tr>
                  <Td style={{ fontWeight: "bold" }}>Nama</Td>
                  <Td>{data.name}</Td>
                </Tr>
                <Tr>
                  <Td style={{ fontWeight: "bold" }}>Alamat</Td>
                  <Td>{data.address}</Td>
                </Tr>
                <Tr>
                  <Td style={{ fontWeight: "bold" }}>Kontak</Td>
                  <Td>{data.phone ?? "-"}</Td>
                </Tr>
                <Tr>
                  <Td style={{ fontWeight: "bold" }}>Email</Td>
                  <Td>{data.email ?? "-"}</Td>
                </Tr>
                <Tr>
                  <Td style={{ fontWeight: "bold" }}>Kelurahan</Td>
                  <Td>{data.kelurahan ? data.kelurahan.name : "-"}</Td>
                </Tr>
                <Tr>
                  <Td style={{ fontWeight: "bold" }}>Jenis</Td>
                  <Td>{data.type ? data.type.name : "-"}</Td>
                </Tr>
                <Tr>
                  <Td style={{ fontWeight: "bold" }}>Sub Jenis</Td>
                  <Td>{data.subtype ? data.subtype.name : "-"}</Td>
                </Tr>
              </Tbody>
            </Table>
          </Card>
        </GridItem>
        <GridItem colSpan={{ md: 8, sm: 12 }}>
          <Card>
            <h2
              style={{
                color: "black",
                fontSize: "1.3rem",
                textAlign: "center",
              }}
            >
              Daftar Gambar
            </h2>

            <Button colorScheme="blue" onClick={() => setModal(true)}>
              <MdAdd /> <Text>Tambah Gambar</Text>
            </Button>
            <Table style={{ color: "black" }}>
              <Thead>
                <Tr>
                  <Th>Gambar</Th>
                  <Th>Aksi</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.images &&
                  data.images.map((item) => (
                    <Tr>
                      <Td>
                        <Image src={item.image} style={{ width: "75px" }} />
                      </Td>
                      <Td>
                        <Button
                          colorScheme="red"
                          onClick={() => removeImage(item.id)}
                        >
                          <MdDelete />
                        </Button>
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </Card>
        </GridItem>
      </SimpleGrid>
    </Box>
  );
};

export default DetailPetaData;

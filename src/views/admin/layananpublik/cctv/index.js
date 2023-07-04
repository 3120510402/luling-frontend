/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
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
  useToast,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { MdDelete, MdEdit, MdMap } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import useNotification, {
  AlertComponent,
} from "components/mycomponents/useNotification";
import FetchHelper from "helpers/FetchHelper";
import { WILAYAH_URL } from "constants/Url";
import CustomInput from "components/mycomponents/custom-input";
import { GOOGLE_API_KEY } from "constants/App";
import GoogleMapReact from "google-map-react";
import { DefaultUi, Hls, Player, usePlayerContext } from "@vime/react";
import { IoMdEye } from "react-icons/io";
// Default theme.
import "@vime/core/themes/default.css";
import TapSidesToSeek from "./tab-to-seek";

export default function CctvPage() {
  const router = useHistory();
  const player = useRef(null);
  const notificationHook = useNotification();
  const fetchHelper = FetchHelper(router);

  // ** STATE ** //
  const [listData, setListData] = useState({ data: [], meta: {} });
  const [select, setSelect] = useState({ kecamatan: [], kelurahan: {} });
  const [filter, setFilter] = useState({ page: 1, take: 10, search: "" });
  const defaulForm = {
    latitude: "",
    longitude: "",
    keterangan: "",
    api_url: "",
    isPrivate: 0,
    kelurahanId: null,
    kecamatanId: null,
  };
  const [form, setForm] = useState(defaulForm);
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
  const [modal, setModal] = useState({ action: false, show: false });

  // ** FUNCTION API ** //
  const onRefresh = async () => {
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

      const url = `${WILAYAH_URL}/cctv?${filters.join("&")}`;
      let response = await fetchHelper.get(url);
      delete response.statusCode;
      setListData(() => response);
    } catch (error) {
      notificationHook.error(error);
    }
  };

  const fetchKecamatan = async () => {
    try {
      const url2 = `${WILAYAH_URL}/kecamatan/select`;
      const response = await fetchHelper.get(url2);
      setSelect((prev) => ({
        ...prev,
        kecamatan: response.data.parent,
        kelurahan: response.data.child,
      }));
    } catch (error) {
      notificationHook.error(error);
    }
  };

  const fetchPolygon = async (kecamatanId, kelurahanId) => {
    if (!kecamatanId || !kelurahanId) {
      console.log("---FAILED FETCH POLYGON----");
      return [];
    }

    try {
      const url2 = `${WILAYAH_URL}/kecamatan/${kecamatanId}/geomap/${kelurahanId}`;
      const response2 = await fetchHelper.get(url2);

      const temp = [];
      if (response2.data.length > 0) {
        for (let i = 0; i < response2.data.length; i++) {
          let item = response2.data[i];
          temp.push({ lat: item.latitude, lng: item.longitude });
        }

        return temp;
      }
    } catch (error) {
      notificationHook.error(error);
    }
  };

  // ** ACTION / HANDLER ** //
  const actionModal = async (item = null) => {
    if (item !== null) {
      handleForm({
        ...item,
        kecamatanId: item.kecamatan.id,
        kelurahanId: item.kelurahan.id,
      });
      const polygon = await fetchPolygon(item.kecamatan.id, item.kelurahan.id);

      updateMap({ polygon });
      handleModal("action", true);
    } else {
      setForm(() => defaulForm);
      updateMap({ marker: null, coordinate: null });
      handleModal("action", true);
    }
  };
  const handleModal = (name, value) => {
    setModal((prev) => ({ ...prev, [name]: value }));
  };
  const actionModalSubmit = async () => {
    const body = {
      latitude: form.latitude,
      longitude: form.longitude,
      api_url: form.api_url,
      kecamatanId: form.kecamatanId,
      kelurahanId: form.kelurahanId,
      keterangan: form.keterangan,
      isPrivate: form.isPrivate,
    };

    try {
      let message = "Berhasil";
      if (form.id !== undefined) {
        const response = await fetchHelper.put(
          `${WILAYAH_URL}/cctv/${form.id}`,
          body
        );
        message = response.message;
      } else {
        const response = await fetchHelper.post(`${WILAYAH_URL}/cctv`, body);
        message = response.message;
      }
      notificationHook.success(message);
      await onRefresh();
      dismissModal("action");
    } catch (error) {
      notificationHook.error(error);
    }
  };

  const actionDelete = async (item) => {
    try {
      const response = await fetchHelper.delete(
        `${WILAYAH_URL}/cctv/${item.id}`
      );
      notificationHook.success(response.message);
      await onRefresh();
      dismissModal("action");
    } catch (error) {
      notificationHook.error(error);
    }
  };

  const handleFilter = (name, value) => {
    // skip not exist schema
    if (filter[name] === undefined) return;

    setFilter((prev) => ({ ...prev, [name]: value }));
  };
  const dismissModal = (name) => handleModal(name, false);
  const handleForm = (name, value = null) => {
    if (typeof name === "string") {
      // skip not exist schema
      if (form[name] === undefined) return;

      setForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setForm((prev) => ({ ...prev, ...name }));
    }
    setMap((prev) => ({ ...prev, prev }));
  };
  const updateMap = (name, value = null) => {
    let myObject = {};
    if (typeof name === "string") {
      // skip not exist schema
      if (form[name] === undefined) return;

      myObject = { [name]: value };
    } else {
      myObject = name || {};
    }

    setMap((prev) => ({ ...prev, key: map.key + 1, ...myObject }));
    console.log(map);
  };
  const AnyReactComponent = () => (
    <div>
      <MdMap size={20} />
    </div>
  );
  const onMapChange = (mapContainer, maps) => {
    console.log(window.PolyGeometry);
    if (map.coordinate !== null) {
      map.coordinate.setMap(null);
    }
    console.log("map", map.polygon);
    if (map.polygon.length > 0) {
      map.coordinate = new maps.Polygon({
        paths: map.polygon,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
      });
      var bounds = new maps.LatLngBounds();
      map.coordinate.getPath().forEach(function (path, index) {
        bounds.extend(path);
      });
      mapContainer.fitBounds(bounds);

      // maps.event.addListener(map, "click", (e) => {
      //   console.log(e);
      // });

      map.coordinate.addListener("click", function (e) {
        console.log(map.key);
        let lat = e.latLng.lat();
        let lng = e.latLng.lng();
        handleForm("latitude", lat.toString());
        handleForm("longitude", lng.toString());
      });

      // map.coordinate.addEventListener("click", (e) => {
      //   console.log(e);
      // });
      // .event.onClick(event => {
      //   console.log(event)
      // })

      map.coordinate.setMap(mapContainer);
    }
  };

  const onPlaybackReady = () => {
    // ...
  };

  // ** EFFECT ** /
  useEffect(() => {
    const firstLoad = async () => {
      await fetchKecamatan();
      await onRefresh();
    };

    firstLoad();
  }, []);

  useEffect(() => {
    const onFilterChange = async () => {
      await onRefresh();
    };

    onFilterChange();
  }, [filter]);

  // If you prefer hooks :)
  const [currentTime] = usePlayerContext(player, "currentTime", 0);

  useEffect(() => {
    console.log(currentTime);
  }, [currentTime]);

  const textColor = useColorModeValue("secondaryGray.900", "white");
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Modal
        onClose={() => dismissModal("show")}
        size={"xl"}
        isOpen={modal.show}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tambah Data Peta</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Player
              playsinline
              ref={player}
              onVmPlaybackReady={onPlaybackReady}
            >
              <Hls>
                <source
                  data-src={`${form.api_url}`}
                  type="application/x-mpegURL"
                />
              </Hls>
              {/* Provider component is placed here. */}
              <DefaultUi>
                <TapSidesToSeek />
              </DefaultUi>
              {/* <Ui>UI components are placed here.</Ui> */}
            </Player>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        onClose={() => dismissModal("action")}
        size={"xl"}
        isOpen={modal.action}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tambah Data Peta</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AlertComponent hook={notificationHook} />
            <CustomInput
              label="Keterangan"
              type="textarea"
              value={form.keterangan}
              onChange={(value) => handleForm("keterangan", value)}
            />
            <CustomInput
              label={"API URL"}
              value={form.api_url}
              onChange={(value) => handleForm("api_url", value)}
            />
            <CustomInput
              label={"Private"}
              type="radio"
              name="isprivate"
              value={form.isPrivate}
              options={{ 0: "Tidak", 1: "Ya" }}
              onChange={(value) => handleForm("isPrivate", value)}
            />
            <CustomInput
              label={"Kecamatan"}
              type="select"
              value={select.kecamatan.find(
                ({ value }) => value === form.kecamatanId
              )}
              onChange={(value) =>
                handleForm({ kelurahanId: "", kecamatanId: value })
              }
              options={select.kecamatan}
            />
            <CustomInput
              label={"Kelurahan"}
              type="select"
              value={
                form.kecamatanId
                  ? select.kelurahan[form.kecamatanId].find(
                      ({ value }) => value === form.kelurahanId
                    )
                  : null
              }
              onChange={async (value) => {
                if (value) {
                  handleForm({ kelurahanId: value });
                  const polygon = await fetchPolygon(form.kecamatanId, value);
                  console.log(polygon);
                  updateMap({ polygon });
                }
              }}
              options={
                form.kecamatanId ? select.kelurahan[form.kecamatanId] : []
              }
            />
            {/* <CustomInput
              label="Lokasi"
              type="map"
              onChange={onMapChange}
              options={{
                key: map.key,
                height: "500px",
              }}
            /> */}

            <FormControl>
              <FormLabel>Lokasi</FormLabel>
              <div style={{ height: "50vh", width: "100%" }}>
                <GoogleMapReact
                  key={map.key}
                  bootstrapURLKeys={{ key: GOOGLE_API_KEY }}
                  defaultCenter={map.center}
                  defaultZoom={map.zoom}
                  geo
                  libraries={["geometry"]}
                  yesIWantToUseGoogleMapApiInternals
                  onGoogleApiLoaded={({ map, maps }) => onMapChange(map, maps)}
                >
                  {form.latitude !== "" && form.longitude !== "" && (
                    <AnyReactComponent
                      lat={parseFloat(form.latitude)}
                      lng={parseFloat(form.longitude)}
                    />
                  )}
                </GoogleMapReact>
              </div>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={dismissModal}>Close</Button>
            <Button colorScheme="green" onClick={actionModalSubmit}>
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
              Data CCTV
            </Text>
            <Menu />
            <Button
              title="Tambah"
              colorScheme={"blue"}
              onClick={() => actionModal()}
            >
              Tambah
            </Button>
          </Flex>

          <Flex px="25px" justify="space-between" mb="20px" align="center">
            <Flex>
              <div style={{ marginRight: 8 }}>
                <Text marginBottom={2}>Page</Text>
                <NumberInput
                  size="sm"
                  maxW={20}
                  defaultValue={1}
                  min={1}
                  max={listData.meta.pageCount}
                  onChange={(val) => handleFilter("page", val)}
                  name="page"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </div>

              <div style={{ marginRight: 8 }}>
                <Text marginBottom={2}>Take</Text>
                <NumberInput
                  size="sm"
                  maxW={20}
                  defaultValue={10}
                  max={100}
                  min={5}
                  onChange={(val) => handleFilter("take", val)}
                  name="take"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </div>
            </Flex>
            <div style={{ marginRight: 8 }}>
              <Text marginBottom={2}>Search</Text>
              <Input
                name="search"
                onChange={(e) => handleFilter("search", e.target.value)}
              />
            </div>
          </Flex>
          <TableContainer>
            <Table variant="simple">
              <TableCaption>Data CCTV</TableCaption>
              <Thead>
                <Tr>
                  <Th>No</Th>
                  <Th>Kecamatan</Th>
                  <Th>Kelurahan</Th>
                  <Th>Keterangan</Th>
                  <Th>Aksi</Th>
                </Tr>
              </Thead>
              <Tbody>
                {listData.data.length > 0 &&
                  listData.data.map((item, index) => (
                    <Tr key={index}>
                      <Td>
                        {index + 1 + (filter.take * filter.page - filter.take)}
                      </Td>
                      <Td>{item.kecamatan.name}</Td>
                      <Td>{item.kelurahan.name}</Td>
                      <Td>{item.keterangan}</Td>
                      <Td>
                        <Button
                          colorScheme="blue"
                          marginEnd={2}
                          onClick={() => {
                            handleForm(item);
                            handleModal("show", true);
                          }}
                        >
                          <IoMdEye />
                        </Button>
                        <Button
                          colorScheme="yellow"
                          marginEnd={2}
                          onClick={() => actionModal(item)}
                        >
                          <MdEdit />
                        </Button>
                        <Button
                          colorScheme="red"
                          onClick={() => actionDelete(item)}
                        >
                          <MdDelete />
                        </Button>
                      </Td>
                    </Tr>
                  ))}
              </Tbody>

              <Tfoot>
                <Tr>
                  <Th>No</Th>
                  <Th>Tempat</Th>
                  <Th>Judul</Th>
                  <Th>Aksi</Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        </Card>
      </SimpleGrid>
    </Box>
  );
}

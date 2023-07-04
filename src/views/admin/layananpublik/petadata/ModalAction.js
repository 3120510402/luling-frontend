/* eslint-disable import/no-anonymous-default-export */
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
} from "@chakra-ui/react";
import Select from "react-select";
import { GOOGLE_API_KEY } from "constants/App";
import GoogleMapReact from "google-map-react";
import { useEffect, useState } from "react";

export default function ({
  onClose = () => {},
  size = "md",
  isOpen = false,
  handleForm = () => {},
  onSubmit = () => {},
  form = {},
  selectData = {},
  mapState = {},
  fetchPolygon = () => {},
  setMap = () => {},
}) {
  const [mapKey, setMapKey] = useState(0);
  const handleApiLoaded = (map, maps) => {
    console.log(window.PolyGeometry);
    if (mapState.coordinate !== null) {
      mapState.coordinate.setMap(null);
    }
    console.log("mapState", mapState.polygon);
    if (mapState.polygon.length > 0) {
      mapState.coordinate = new maps.Polygon({
        paths: mapState.polygon,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
      });

      // maps.event.addListener(mapState, "click", (e) => {
      //   console.log(e);
      // });

      mapState.coordinate.addListener("click", function (e) {
        let lat = e.latLng.lat();
        let lng = e.latLng.lng();
        handleForm("latitude", lat.toString());
        handleForm("longitude", lng.toString());
        if (mapState.marker != null) {
          mapState.marker.setMap(null);
        }

        mapState.marker = new maps.Marker({
          position: { lat, lng },
          map,
        });
      });

      // mapState.coordinate.addEventListener("click", (e) => {
      //   console.log(e);
      // });
      // .event.onClick(event => {
      //   console.log(event)
      // })

      mapState.coordinate.setMap(map);

      setMapKey(() => mapKey + 1);
    }
  };

  return (
    <Modal onClose={onClose} size={size} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Tambah Data Peta</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Nama</FormLabel>
            <Input
              type="text"
              onChange={(e) => handleForm("name", e.target.value)}
              value={form.name}
              name="name"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Alamat</FormLabel>
            <Input
              type="text"
              onChange={(e) => handleForm("address", e.target.value)}
              value={form.address}
              name="address"
            />
          </FormControl>
          <FormControl>
            <FormLabel>No HP</FormLabel>
            <Input
              type="text"
              onChange={(e) => handleForm("phone", e.target.value)}
              value={form.phone}
              name="phone"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              onChange={(e) => handleForm("email", e.target.value)}
              value={form.email}
              name="email"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Jenis</FormLabel>
            <Select
              defaultValue={selectData.type.find(
                ({ value }) => value === form.typeId
              )}
              onChange={(values) => handleForm("typeId", values.value)}
              name="typeId"
              options={selectData.type}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Sub Jenis</FormLabel>
            <Select
              defaultValue={
                form.typeId
                  ? selectData.typeChild[`${form.typeId}`].find(
                      ({ value }) => value === form.subtypeId
                    )
                  : null
              }
              onChange={(values) => handleForm("subtypeId", values.value)}
              name="subtypeId"
              options={
                form.typeId ? selectData.typeChild[`${form.typeId}`] : []
              }
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Kecamatan</FormLabel>
            <Select
              defaultValue={selectData.kecamatan.find(
                ({ value }) => value === form.kecamatanId
              )}
              onChange={(values) => {
                handleForm("kelurahanId", "");
                handleForm("kecamatanId", values.value);
              }}
              name="kecamatanId"
              options={selectData.kecamatan}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Kelurahan</FormLabel>
            <Select
              defaultValue={
                form.kecamatanId
                  ? selectData.kecamatanChild[`${form.kecamatanId}`].find(
                      ({ value }) => value === form.kelurahanId
                    )
                  : null
              }
              onChange={async (values) => {
                handleForm("kelurahanId", values.value);
                await fetchPolygon(values.value);
                setMapKey((prev) => prev + 1);
              }}
              name="kelurahanId"
              options={
                form.kecamatanId !== ""
                  ? selectData.kecamatanChild[`${form.kecamatanId}`]
                  : []
              }
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Lokasi</FormLabel>
            <div style={{ height: "100vh", width: "100%" }}>
              <GoogleMapReact
                key={mapState.key}
                bootstrapURLKeys={{ key: GOOGLE_API_KEY }}
                defaultCenter={mapState.center}
                defaultZoom={mapState.zoom}
                geo
                libraries={["geometry"]}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) =>
                  handleApiLoaded(map, maps)
                }
              ></GoogleMapReact>
            </div>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
          <Button colorScheme="green" onClick={onSubmit}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

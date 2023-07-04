/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Flex,
  Menu,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Td,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import { MdAdd, MdChat, MdDelete, MdEdit, MdMap } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
// Default theme.
import "@vime/core/themes/default.css";
import { AlertComponent } from "components/mycomponents/useNotification";
import UseDatatable, {
  DatatableComponent,
} from "components/mycomponents/my-datatable";
import useNotification from "components/mycomponents/useNotification";
import { SEKTORAL_URL } from "constants/Url";
import StringHelper from "helpers/StringHelper";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect, useState } from "react";
import CustomInput from "components/mycomponents/custom-input";
import FetchHelper from "helpers/FetchHelper";
import AuthHelper from "helpers/AuthHelper";
import { IoTrash } from "react-icons/io5";

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

export default function DinasSektoralPage() {
  const router = useHistory();
  const fetchHelper = FetchHelper(router);
  const notificationHook = useNotification();
  const [open, handleModal] = useObjects({
    modalCreate: false,
    modalEdit: false,
  });
  const [form, handleForm] = useObjects({
    id: null,
    tahun: null,
    bulan: null,
  });
  const [user, setUser] = useState(null);
  const [opd, setOpd] = useState(null);
  let datatable = UseDatatable({
    url: `${SEKTORAL_URL}/data-uraian/me`,
    handleError: (error) => {
      notificationHook.error(error);
    },
  });

  useEffect(() => {
    const init = async () => {
      const d = await AuthHelper().getUser();
      setUser(() => d);
    };

    init();
  }, []);

  const actionSimpanSektoral = async () => {
    try {
      if ((user != null && user.opdId !== null) == false) {
        notificationHook.error("Data user kosong");
        return;
      }
      console.log(form);
      if (form.tahun == null || form.bulan == null) {
        notificationHook.error("Tahun dan bulan tidak kosong");
        return;
      }

      await FetchHelper().post(
        `${SEKTORAL_URL}/data-uraian/${user.opdId}/${form.tahun}/${form.bulan}`
      );

      datatable.fetchData();
      handleModal("modalCreate", false);
    } catch (e) {
      console.log(e);
    }
  };
  const actionHapus = async (item) => {
    try {
      if (!window.confirm("Apakah anda yakin menghapus disposisi ini ?")) {
        return false;
      }
      await FetchHelper().delete(`${SEKTORAL_URL}/data-uraian/${item.tahun}/${item.bulan}`);

      datatable.fetchData();
    } catch (e) {
      console.log(e);
    }
  };

  const textColor = useColorModeValue("secondaryGray.900", "white");
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Modal
        onClose={() => handleModal("modalCreate", false)}
        size={"md"}
        isOpen={open.modalCreate}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ubah Status</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex>
              <CustomInput
                label={"Tahun"}
                type="select"
                name="tahun"
                value={form.tahun}
                options={[
                  { label: "2025", value: 2025 },
                  { label: "2024", value: 2024 },
                  { label: "2023", value: 2023 },
                  { label: "2022", value: 2022 },
                  { label: "2021", value: 2021 },
                ]}
                onChange={(value) => handleForm("tahun", value)}
              />
              <CustomInput
                label={"Bulan"}
                type="select"
                name="bulan"
                value={form.bulan}
                options={[
                  { label: "Januari", value: 1 },
                  { label: "Februari", value: 2 },
                  { label: "Maret", value: 3 },
                  { label: "April", value: 4 },
                  { label: "Mei", value: 5 },
                  { label: "Juni", value: 6 },
                  { label: "Juli", value: 7 },
                  { label: "Agustus", value: 8 },
                  { label: "September", value: 9 },
                  { label: "Oktober", value: 10 },
                  { label: "November", value: 11 },
                  { label: "Desember", value: 12 },
                ]}
                onChange={(value) => handleForm("bulan", value)}
              />
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={() => {
                actionSimpanSektoral();
              }}
              size="sm"
              variant="outline"
            >
              Simpan
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
              Data Disposisi
            </Text>
            <Button
              colorScheme="green"
              onClick={() => {
                handleModal("modalCreate", true);
              }}
            >
              <MdAdd />
              Tambah Data Sektoral
            </Button>
            <Menu />
          </Flex>

          <DatatableComponent
            datatable={datatable}
            filter={false}
            title="Data Pengaduan"
            header={["ID", "Tahun", "Bulan", "Aksi"]}
            content={({ item }) => {
              return (
                <>
                  <Td>{item.tahun}</Td>
                  <Td>{item.bulan}</Td>
                </>
              );
            }}
            action={({ item }) => (
              <>
                <Button
                  onClick={() => {
                    router.push(
                      `/admin/sektoral/dinas/detail/${item.tahun}/${item.bulan}`
                    );
                  }}
                  colorScheme="yellow"
                  style={{ margin: "2px" }}
                >
                  <MdEdit />
                </Button>
                <Button
                  onClick={() => {
                    console.log(item)
                    actionHapus(item);
                  }}
                  colorScheme="red"
                  style={{ margin: "2px" }}
                >
                  <IoTrash />
                </Button>
              </>
            )}
          />
        </Card>
      </SimpleGrid>
    </Box>
  );
}

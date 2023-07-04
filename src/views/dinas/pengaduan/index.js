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
import { MdChat, MdDelete, MdEdit, MdMap } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
// Default theme.
import "@vime/core/themes/default.css";
import { AlertComponent } from "components/mycomponents/useNotification";
import UseDatatable, {
  DatatableComponent,
} from "components/mycomponents/my-datatable";
import useNotification from "components/mycomponents/useNotification";
import { PENGADUAN_URL } from "constants/Url";
import StringHelper from "helpers/StringHelper";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useState } from "react";
import CustomInput from "components/mycomponents/custom-input";
import FetchHelper from "helpers/FetchHelper";

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

export default function DinasPengaduanPage() {
  const router = useHistory();
  const fetchHelper = FetchHelper(router);
  const notificationHook = useNotification();
  const [open, handleModal] = useObjects({
    modalEdit: false,
  });
  const [form, handleForm] = useObjects({
    id: null,
    status: null,
  });
  const datatable = UseDatatable({
    url: `${PENGADUAN_URL}/disposisi/to-me`,
    handleError: (error) => {
      notificationHook.error(error);
    },
  });

  const actionEditStatus = async () => {
    try {
      if (!form.id || !form.status) {
        notificationHook.error("Please provide a valid form");
        return;
      }

      const response = await fetchHelper.post(
        `${PENGADUAN_URL}/disposisi/${form.id}/change-status`,
        form
      );

      notificationHook.success(response.message);
      datatable.fetchData();
    } catch (error) {
      notificationHook.error(error);
    }
  };

  const textColor = useColorModeValue("secondaryGray.900", "white");
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Modal
        onClose={() => handleModal("modalEdit", false)}
        size={"md"}
        isOpen={open.modalEdit}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ubah Status</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex>
              <CustomInput
                label={"Status"}
                type="radio"
                name="status"
                value={form.status}
                options={{ 0: "Belum Ditanggapi", 1: "Proses", 2: "Selesai" }}
                onChange={(value) => handleForm("status", value)}
              />
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={() => {
                actionEditStatus();
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
            <Menu />
          </Flex>

          <DatatableComponent
            datatable={datatable}
            title="Data Pengaduan"
            header={[
              "ID",
              "Judul",
              "Private",
              "Anonymous",
              "Status",
              "Tgl Laporan",
              "Di Disposisi Oleh",
              "Aksi",
            ]}
            content={({ item }) => {
              return (
                <>
                  <Td>{item.complaint.title}</Td>
                  <Td>{item.complaint.show_public === 1 ? "Tidak" : "Ya"}</Td>
                  <Td>{item.complaint.is_anonymous === 0 ? "Tidak" : "Ya"}</Td>
                  <Td>
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
                  </Td>
                  <Td>{StringHelper.datetime(item.createdAt)}</Td>
                  <Td>{item._dispositionBy?.name}</Td>
                </>
              );
            }}
            action={({ item }) => (
              <>
                <Button
                  onClick={() => {
                    handleForm({ status: item.status, id: item.id });
                    handleModal("modalEdit", true);
                  }}
                  colorScheme="yellow"
                  style={{ margin: "2px" }}
                >
                  <MdEdit />
                </Button>

                <Button
                  onClick={() => {
                    router.push(`/admin/pengaduan/dinas/detail/${item.id}`);
                  }}
                  colorScheme="blue"
                  style={{ margin: "2px" }}
                >
                  <MdChat />
                </Button>
              </>
            )}
          />
        </Card>
      </SimpleGrid>
    </Box>
  );
}

/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Flex,
  Menu,
  SimpleGrid,
  Td,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import { MdDelete, MdEdit, MdMap } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
// Default theme.
import "@vime/core/themes/default.css";
import { AlertComponent } from "components/mycomponents/useNotification";
import UseDatatable, { DatatableComponent } from "components/mycomponents/my-datatable";
import useNotification from "components/mycomponents/useNotification";
import { PENGADUAN_URL } from "constants/Url";
import StringHelper from "helpers/StringHelper";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function PengaduanPage() {
  const router = useHistory();
  const notificationHook = useNotification();
  const datatable = UseDatatable({
    url: `${PENGADUAN_URL}/pengaduan`,
    order: 'model_id=DESC',
    handleError: (error) => {
      notificationHook.error(error);
    },
  });

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
          <AlertComponent hook={notificationHook} />
          <Flex px="25px" justify="space-between" mb="20px" align="center">
            <Text
              color={textColor}
              fontSize="22px"
              fontWeight="700"
              lineHeight="100%"
            >
              Data Pengaduan
            </Text>
            <Menu />
          </Flex>

          <DatatableComponent
            datatable={datatable}
            title="Data Pengaduan"
            header={["ID", "Judul", "Private", "Anonymous", "Total Disposisi", "Status", "Tgl Laporan", "Aksi"]}
            content={({ item }) => {
              return (
                <>
                  <Td>{item.title}</Td>
                  <Td>{item.show_public === 1 ? "Tidak" : "Ya"}</Td>
                  <Td>{item.is_anonymous === 0 ? "Tidak" : "Ya"}</Td>
                  <Td>{item.dispositionCount === 0 ? 'Belum Didisposisikan' : `${item.dispositionCount} kali`}</Td>
                  <Td>
                    <span
                      style={{
                        padding: "2px",
                        background: item._status.color,
                        display: "block",
                        color: "white",
                        textAlign: "center",
                        borderRadius: '5px',
                      }}
                    >
                      {item._status.msg}
                    </span>
                  </Td>
                  <Td>{StringHelper.datetime(item.createdAt)}</Td>
                </>
              );
            }}
            action={({ item }) => (
              <>
                <Button onClick={() => {
                  router.push(`/admin/pengaduan/admin/detail/${item.id}`);
                }} colorScheme="blue" style={{ margin: "2px" }}>
                  <IoMdEye />
                </Button>
              </>
            )}
          />
        </Card>
      </SimpleGrid>
    </Box>
  );
}

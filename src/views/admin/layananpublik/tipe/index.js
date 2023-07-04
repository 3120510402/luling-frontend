import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  CloseButton,
  Flex,
  Image,
  Input,
  Menu,
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
import useTipeLayananPublik from "./useTipeLayananPublik";
import Card from "components/card/Card";
import ModalAction from "./components/ModalAction";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { MdDelete, MdEdit, MdImage } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import ModalUploadImage from "./components/ModalUploadImage";

// eslint-disable-next-line import/no-anonymous-default-export
const TipeLayananPublik = () => {
  const router = useHistory();
  const toast = useToast();
  const agendaHook = useTipeLayananPublik(router, toast);
  const {
    filter,
    data,
    metaData,
    notification,
    isModalOpen,
    isModalOpenImage,
    form,
    handleFilter,
    onModalClose,
    onModalCloseImage,
    actionCreate,
    actionDelete,
    actionEdit,
    handleForm,
    handleSubmit,
    handleUploadImage,
    dismissNotification,
    actionEditImage
  } = agendaHook;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <ModalAction
        onClose={onModalClose}
        isOpen={isModalOpen}
        form={form}
        handleForm={handleForm}
        onSubmit={handleSubmit}
      />
      <ModalUploadImage
        onClose={onModalCloseImage}
        isOpen={isModalOpenImage}
        form={form}
        handleForm={handleForm}
        onSubmit={handleUploadImage}
      />
      <SimpleGrid mb="20px" spacing={{ base: "20px", xl: "20px" }}>
        <Card
          direction="column"
          w="100%"
          px="0px"
          overflowX={{ sm: "scroll", lg: "hidden" }}
        >
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
          <Flex px="25px" justify="space-between" mb="20px" align="center">
            <Text
              color={textColor}
              fontSize="22px"
              fontWeight="700"
              lineHeight="100%"
            >
              Jenis Layanan Publik
            </Text>
            <Menu />
            <Button title="Tambah" colorScheme={"blue"} onClick={actionCreate}>
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
                  max={metaData.pageCount}
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
              <TableCaption>Data Jenis Layanan Publik</TableCaption>
              <Thead>
                <Th>No</Th>
                <Th>Ikon</Th>
                <Th>Jenis</Th>
                <Th>Keterangan</Th>
                <Th>Aksi</Th>
              </Thead>
              <Tbody>
                {data.length > 0 &&
                  data.map((item, index) => (
                    <Tr>
                      <Td>
                        {index + 1 + (filter.take * filter.page - filter.take)}
                      </Td>
                      <Td>
                        <Image src={item.icon} maxWidth={"50px"} />
                      </Td>
                      <Td>{item.name}</Td>
                      <Td>{item.description}</Td>
                      <Td>
                        <Button
                          colorScheme="blue"
                          marginEnd={2}
                          onClick={() =>
                            router.push(`/admin/layanan-publik/jenis/${item.id}`)
                          }
                        >
                          <IoMdEye />
                        </Button>
                        <Button
                          colorScheme="pink"
                          marginEnd={2}
                          onClick={() => actionEditImage(item)}
                        >
                          <MdImage />
                        </Button>
                        <Button
                          colorScheme="yellow"
                          marginEnd={2}
                          onClick={() => actionEdit(item)}
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
                <Th>No</Th>
                <Th>Ikon</Th>
                <Th>Kategori</Th>
                <Th>Keterangan</Th>
                <Th>Aksi</Th>
              </Tfoot>
            </Table>
          </TableContainer>
        </Card>
      </SimpleGrid>
    </Box>
  );
};

export default TipeLayananPublik;

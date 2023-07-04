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
import usePetaData from "./usePetaData";
import Card from "components/card/Card";
import ModalAction from "./ModalAction";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { MdDelete, MdEdit, MdImage } from "react-icons/md";
import { IoMdEye } from "react-icons/io";

// eslint-disable-next-line import/no-anonymous-default-export
const PetaData = () => {
  const router = useHistory();
  const toast = useToast();
  const hook = usePetaData(router, toast);
  const {
    select,
    filter,
    data,
    metaData,
    notification,
    isModalOpen,
    form,
    handleFilter,
    onModalClose,
    actionCreate,
    actionDelete,
    actionEdit,
    handleForm,
    handleSubmit,
    dismissNotification,
    map,
    setMap,
    fetchPolygon,
  } = hook;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <ModalAction
        onClose={onModalClose}
        isOpen={isModalOpen}
        form={form}
        handleForm={handleForm}
        onSubmit={handleSubmit}
        selectData={select}
        mapState={map}
        fetchPolygon={fetchPolygon}
        setMap={setMap}
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
              <TableCaption>Peta Data</TableCaption>
              <Thead>
                <Tr>
                  <Th>No</Th>
                  <Th>Jenis</Th>
                  <Th>Sub Jenis</Th>
                  <Th>Nama Tempat</Th>
                  <Th>Alamat</Th>
                  <Th>Aksi</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.length > 0 &&
                  data.map((item, index) => (
                    <Tr key={index}>
                      <Td>
                        {index + 1 + (filter.take * filter.page - filter.take)}
                      </Td>
                      <Td>{item.type?.name}</Td>
                      <Td>{item.subtype?.name}</Td>
                      <Td>{item.name}</Td>
                      <Td>{item.address}</Td>
                      <Td>
                        <Button
                          colorScheme="blue"
                          marginEnd={2}
                          onClick={() =>
                            router.push(
                              `/admin/layanan-publik/peta-data-detail/${item.id}`
                            )
                          }
                        >
                          <IoMdEye />
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
            </Table>
          </TableContainer>
        </Card>
      </SimpleGrid>
    </Box>
  );
};

export default PetaData;

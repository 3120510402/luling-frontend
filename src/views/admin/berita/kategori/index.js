import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  CloseButton,
  Flex,
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
import useKategoriBerita from "./useKategoriBerita";
import Card from "components/card/Card";
import ModalAction from "./ModalAction";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { MdDelete, MdEdit } from "react-icons/md";

// eslint-disable-next-line import/no-anonymous-default-export
const KategoriBerita = () => {
  const router = useHistory();
  const toast = useToast();
  const agendaHook = useKategoriBerita(router, toast);
  const {
    filter,
    data,
    metaData,
    error,
    isModalOpen,
    form,
    handleFilter,
    onModalClose,
    actionCreate,
    actionDelete,
    actionEdit,
    handleForm,
    handleSubmit,
    dismissError,
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
      <SimpleGrid mb="20px" spacing={{ base: "20px", xl: "20px" }}>
        <Card
          direction="column"
          w="100%"
          px="0px"
          overflowX={{ sm: "scroll", lg: "hidden" }}
        >
          {error.hasError && (
            <Alert
              status="error"
              style={{ marginBottom: "1 rem" }}
              justifyContent="space-between"
            >
              <Box>
                <AlertTitle>Error !</AlertTitle>
                <AlertDescription>{error.error}</AlertDescription>
              </Box>
              <CloseButton
                alignSelf="flex-start"
                position="relative"
                right={-1}
                top={-1}
                onClick={dismissError}
              />
            </Alert>
          )}
          <Flex px="25px" justify="space-between" mb="20px" align="center">
            <Text
              color={textColor}
              fontSize="22px"
              fontWeight="700"
              lineHeight="100%"
            >
              Kategori Berita
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
              <TableCaption>Data Kategori Berita</TableCaption>
              <Thead>
                <Th>No</Th>
                <Th>Kategori</Th>
                <Th>Aksi</Th>
              </Thead>
              <Tbody>
                {data.length > 0 &&
                  data.map((item, index) => (
                    <Tr>
                      <Td>
                        {index + 1 + (filter.take * filter.page - filter.take)}
                      </Td>
                      <Td>{item.name}</Td>
                      <Td>
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
                <Th>Kategori</Th>
                <Th>Aksi</Th>
              </Tfoot>
            </Table>
          </TableContainer>
        </Card>
      </SimpleGrid>
    </Box>
  );
};

export default KategoriBerita;

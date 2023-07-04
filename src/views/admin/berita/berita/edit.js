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
import useBeritaDetail from "./useBeritaDetail";
import Card from "components/card/Card";
import {
  useHistory,
  useLocation,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { useRef } from "react";
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import Select from "react-select";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "assets/css/news.css";
import { MdDelete } from "react-icons/md";
import StringHelper from "helpers/StringHelper";
import { TagsInput } from "react-tag-input-component";

// eslint-disable-next-line import/no-anonymous-default-export
const BeritaEdit = () => {
  let location = useLocation();
  const router = useHistory();
  const { id } = useParams();
  const hook = useBeritaDetail(router, id, location);
  const {
    data,
    form,
    handleForm,
    notification,
    dismissNotification,
    handleRemoveKategori,
    editorState,
    setEditorState,
  } = hook;
  const imageRef = useRef();

  const textColor = useColorModeValue("secondaryGray.900", "secondaryGray.900");
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
      <SimpleGrid
        columns={{ sm: 2, md: 4 }}
        color={"white"}
        marginBottom={4}
        gap={3}
      >
        <GridItem colSpan={3}>
          <Card>
            <FormControl>
              <FormLabel color={textColor}>Judul</FormLabel>
              <Input
                type="text"
                onChange={(e) => handleForm("title", e.target.value)}
                value={form.title}
                name="title"
              />
            </FormControl>
            <FormControl>
              <FormLabel color={textColor}>Tags</FormLabel>

              <TagsInput
                value={form.tags}
                onChange={(e) => handleForm("tags", e)}
                style={{ color: "black" }}
                name="tags"
                placeHolder="enter tags"
              />
              <em>press enter or comma to add new tag</em>
            </FormControl>

            <FormControl>
              <FormLabel>Konten</FormLabel>
              <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                editorStyle={{
                  height: "450px",
                  color: "black",
                }}
                onEditorStateChange={(e) => {
                  setEditorState(e);
                  handleForm(
                    "content",
                    draftToHtml(convertToRaw(e.getCurrentContent()))
                  );
                }}
              />
            </FormControl>
            <Button
              marginTop={3}
              colorScheme={"purple"}
              onClick={() => hook.handleSubmit()}
            >
              <Text>Update</Text>
            </Button>
          </Card>
        </GridItem>

        <GridItem colSpan={{ md: 1, sm: 2 }}>
          <Box>
            <SimpleGrid
              columns={{ sm: 12, md: 12 }}
              color={"white"}
              marginBottom={4}
              gap={3}
            >
              <GridItem colSpan={{ md: 12, sm: 12 }}>
                <Card>
                  <Image ref={imageRef} src={data.image} margin={2} />
                  <Input
                    type="file"
                    accept="image/*"
                    name="image"
                    onChange={(e) => {
                      if (e.target.files.length > 0) {
                        const file = e.target.files[0];

                        const objectUrl = URL.createObjectURL(file);
                        imageRef.current.src = objectUrl;

                        handleForm("image", file);
                      }
                    }}
                  />
                  <Button
                    marginTop={3}
                    colorScheme={"purple"}
                    onClick={() => hook.handleSubmitImage()}
                  >
                    <Text>Upload Gambar</Text>
                  </Button>
                </Card>
              </GridItem>
              <GridItem colSpan={{ md: 12, sm: 12 }}>
                <Card>
                  <FormControl>
                    <FormLabel color={textColor}>Kategori</FormLabel>
                    <Select
                      onChange={(values) =>
                        handleForm("category", values.value)
                      }
                      name="categories"
                      options={form.listCategory}
                      className="basic-multi-select"
                      classNamePrefix="select"
                    />
                  </FormControl>
                  <Button
                    marginTop={3}
                    colorScheme={"purple"}
                    onClick={() => hook.handleSubmitKategori()}
                  >
                    <Text>Tambah Kategori</Text>
                  </Button>
                  <ul style={{ marginTop: "10px" }}>
                    {data &&
                      data.categories &&
                      data.categories.length > 0 &&
                      data.categories.map((item, i) => (
                        <li style={{ marginTop: "4px" }} key={i}>
                          <Text color={textColor}>
                            <Button
                              colorScheme="red"
                              onClick={() => hook.handleRemoveKategori(item.id)}
                            >
                              <MdDelete />
                            </Button>{" "}
                            {item.name}
                          </Text>
                        </li>
                      ))}
                  </ul>
                </Card>
              </GridItem>
            </SimpleGrid>
          </Box>
        </GridItem>
      </SimpleGrid>
      <SimpleGrid
        columns={{ sm: 12, md: 12 }}
        color={"white"}
        marginBottom={4}
        gap={3}
      >
        <GridItem colSpan={{ md: 9, sm: 12 }}>
          <Card>
            <h4
              style={{
                color: "black",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Komentar
            </h4>

            {form &&
              form.comments &&
              form.comments.length > 0 &&
              form.comments.map((item, i) => (
                <>
                  <Flex p="2">
                    <Avatar
                      _hover={{ cursor: "pointer" }}
                      color="white"
                      name={item._createdBy ? item._createdBy.name : "-"}
                      bg="#11047A"
                      size="sm"
                      w="40px"
                      h="40px"
                    />

                    <Stack>
                      <Box p="2">
                        <Heading color={textColor} size="md">
                          {item._createdBy ? item._createdBy.name : "-"}
                        </Heading>
                        <span style={{ color: "#aaa", fontSize: "14px" }}>
                          {StringHelper.datetime(item.createdAt)}
                        </span>
                        <Text color={textColor} py="2">
                          {item.text}
                        </Text>
                      </Box>
                    </Stack>
                  </Flex>
                  {i + 1 < form.comments.length ? <hr /> : null}
                </>
              ))}
          </Card>
        </GridItem>
        <GridItem colSpan={{ md: 3, sm: 12 }}>
          <Card>
            <h4
              style={{
                color: "black",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Rating Berita
            </h4>
            <Table>
              <Thead>
                <Tr>
                  <Th>Rating</Th>
                  <Th>Jumlah</Th>
                </Tr>
              </Thead>
              <Tbody color={textColor}>
                {form &&
                  form.reactions &&
                  Object.entries(form.reactions).map((item, id) => (
                    <Tr key={id}>
                      <Td>{item[0]}</Td>
                      <Td>{item[1]}</Td>
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

export default BeritaEdit;

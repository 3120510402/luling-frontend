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
import { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import Select from "react-select";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { TagsInput } from "react-tag-input-component";

export default function ({
  onClose = () => {},
  size = "lg",
  isOpen = false,
  handleForm = () => {},
  onSubmit = () => {},
  form = {},
}) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  return (
    <Modal onClose={onClose} size={size} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{form.id ? "Update Berita" : "Tambah Berita"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Judul</FormLabel>
            <Input
              type="text"
              onChange={(e) => handleForm("title", e.target.value)}
              value={form.title}
              name="title"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Gambar</FormLabel>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files.length > 0) {
                  console.log(e.target.files[0]);
                  handleForm("image", e.target.files[0]);
                }
              }}
              name="image"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Tags</FormLabel>
            <TagsInput
              value={form.tags}
              onChange={(e) => handleForm("tags", e)}
              name="tags"
              placeHolder="enter tags"
            />
            <em>press enter or comma to add new tag</em>
          </FormControl>
          <FormControl>
            <FormLabel>Kategori</FormLabel>
            <Select
              defaultValue={form.category}
              onChange={(values) => handleForm("categories", values)}
              isMulti
              name="colors"
              options={form.listCategory}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Konten</FormLabel>
            <Editor
              editorState={editorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              editorStyle={{
                background: "#efefef",
                height: "450px",
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

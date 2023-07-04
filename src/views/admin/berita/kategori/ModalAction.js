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

export default function ({
  onClose = () => {},
  size = "full",
  isOpen = false,
  handleForm = () => {},
  onSubmit = () => {},
  form = {},
}) {
  return (
    <Modal onClose={onClose} size={size} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{form.id ? "Update Kategori Berita" : "Tambah Kategori Berita"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Nama Kategori</FormLabel>
            <Input
              type="text"
              onChange={handleForm}
              value={form.name}
              name="name"
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

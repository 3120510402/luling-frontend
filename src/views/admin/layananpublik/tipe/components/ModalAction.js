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
        <ModalHeader>
          {form.id
            ? "Update Jenis Layanan Publik"
            : "Tambah Jenis Layanan Publik"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Jenis</FormLabel>
            <Input
              type="text"
              onChange={(e) => handleForm("name", e.target.value)}
              value={form.name}
              name="name"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Keterangan</FormLabel>
            <Input
              type="text"
              onChange={(e) => handleForm("description", e.target.value)}
              value={form.description}
              name="keterangan"
            />
          </FormControl>
          {!form.id && (
            <FormControl>
              <FormLabel>Icon</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files.length > 0) {
                    handleForm("icon", e.target.files[0]);
                  }
                }}
                name="icon"
              />
            </FormControl>
          )}
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

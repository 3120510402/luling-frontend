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
        <ModalHeader>{form.id ? "Update Agenda" : "Tambah Agenda"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Tempat / Lokasi</FormLabel>
            <Input
              type="text"
              onChange={handleForm}
              value={form.place}
              name="place"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Nama Agenda</FormLabel>
            <Input
              type="text"
              onChange={handleForm}
              value={form.name}
              name="name"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Tanggal Agenda</FormLabel>
            <Input
              type="date"
              onChange={handleForm}
              name="agenda_schedule"
              value={form.agenda_schedule}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Deskripsi</FormLabel>
            <Textarea
              onChange={handleForm}
              name="description"
              value={form.description}
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

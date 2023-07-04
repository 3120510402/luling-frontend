import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  CloseButton,
} from "@chakra-ui/react";
import { useState } from "react";

export const AlertComponent = ({ hook }) => {
  return (
    <>
      {hook.data.hasNotification && (
        <Alert status={hook.data.type} style={{ marginBottom: "1 rem" }}>
          <Box>
            <AlertTitle style={{ color: "#444" }}>{hook.data.title}</AlertTitle>
            <AlertDescription style={{ color: "#444" }}>{hook.data.message}</AlertDescription>
          </Box>
          <CloseButton
            alignSelf="flex-start"
            position="relative"
            right={-1}
            top={-1}
            onClick={hook.dismiss}
          />
        </Alert>
      )}
    </>
  );
};

export default function useNotification() {
  const defaultValue = {
    title: "",
    message: "",
    hasNotification: false,
    type: "",
  };
  const types = {
    error: "error",
    success: "success",
    warning: "warning",
  };

  const [data, setData] = useState(defaultValue);

  const show = (message, type = "success") => {
    let notificationType = types[type];

    if (notificationType === undefined) notificationType = types.success;

    if (typeof message !== "string") {
      // console.error(message);
      message = "Telah terjadi kesalahan";
    }

    let title = "Error !";
    if (notificationType === types.success) title = "Berhasil";
    else if (notificationType === types.warning) title = "Peringatan";

    let currentValue = {
      title,
      message,
      type: notificationType,
      hasNotification: true,
    };

    setData(() => currentValue);
  };

  const success = (message) => show(message, types.success);
  const warning = (message) => show(message, types.warning);
  const error = (message) => show(message, types.error);

  const dismiss = () => setData(() => defaultValue);
  return {
    success,
    warning,
    error,
    dismiss,
    data,
  };
}

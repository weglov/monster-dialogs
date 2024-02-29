import { Button } from "@radix-ui/themes";
import { useDialog } from "./manager/useDialog";
import { Modal } from "./manager/dialog-manager";
import { useCallback } from "react";

function App() {
  const { open } = useDialog();

  const onDelete = useCallback(async () => {
    const result = open<Modal, boolean>(Modal.ConfirmModal, {
      text: "Alert",
    });

    await result;

    console.log(result, "finish:promise");
    console.log("example: sendAnalytics");
  }, []);

  return (
    <div className="layout p-20">
      <Button onClick={() => onDelete()}>Alert!</Button>
    </div>
  );
}

export default App;

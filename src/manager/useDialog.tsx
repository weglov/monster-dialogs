import { useContext } from "react";
import { DialogContext } from "./provider";

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error("useDialog() called outside of DialogProvider");
  }

  return context;
};

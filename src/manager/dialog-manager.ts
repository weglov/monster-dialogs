import { lazy } from "react";

export enum Modal {
  ConfirmModal
}

export const dialogManager = {
  [Modal.ConfirmModal]: lazy(() => import('../ConfirmModal'))
}
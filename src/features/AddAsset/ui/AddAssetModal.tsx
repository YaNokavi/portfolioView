import { Modal } from "@/shared/ui/Modal";
import { ModalMode } from "../model/types";
import * as styles from "./AddAssetModal.module.scss";
import { X } from "lucide-react";
import { AddAssetForm } from "./AddAssetForm";

interface AddAssetModalProps {
  mode: ModalMode;
  onClose: () => void;
}

export const AddAssetModal = ({ mode, onClose }: AddAssetModalProps) => {
  const isEdit = mode?.type === "edit";

  return (
    <Modal isOpen={mode !== null} onClose={onClose}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>
            {isEdit ? "Edit asset" : "Add asset"}
          </h2>
          <p className={styles.subtitle}>
            {isEdit
              ? `Update your ${mode.symbol} position`
              : "Add a new position to your portfolio"}
          </p>
        </div>

        <button className={styles.closeButton} onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className={styles.form}>
        <AddAssetForm onSuccess={onClose} />
      </div>
    </Modal>
  );
};

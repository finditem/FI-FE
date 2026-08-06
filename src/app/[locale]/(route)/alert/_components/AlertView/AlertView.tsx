"use client";

import { useState } from "react";
import useNotificationDelete from "@/api/fetch/notification/api/useNotificationDelete";
import { AlertList, AlertDeleteSection, AlertDeleteModal } from "./_internal";
import { useNotificationDeleteAll } from "@/api/fetch/notification";
import { DeleteTarget } from "../../_types/DeleteTargetType";

interface AlertViewProps {
  isDeleteMode: boolean;
  setIsDeleteMode: (isDeleteMode: boolean) => void;
}

const AlertView = ({ isDeleteMode, setIsDeleteMode }: AlertViewProps) => {
  const { mutate: deleteNotifications, isPending: isDeletePending } = useNotificationDelete();
  const { mutate: deleteAllNotifications, isPending: isDeleteAllPending } =
    useNotificationDeleteAll();

  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>("selected");

  const isDisabled = isDeletePending || isDeleteAllPending;

  const handleDeleteNotifications = () => {
    if (deleteTarget === "selected") {
      deleteNotifications({ ids: selectedNotifications });
    } else {
      deleteAllNotifications(
        {},
        {
          onSuccess: () => {
            setDeleteTarget("selected");
          },
        }
      );
    }

    setSelectedNotifications([]);
    setIsDeleteMode(false);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <AlertList
        isDeleteMode={isDeleteMode}
        selectedNotifications={selectedNotifications}
        setSelectedNotifications={setSelectedNotifications}
      />

      <AlertDeleteSection
        isDeleteMode={isDeleteMode}
        disabled={selectedNotifications.length === 0}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        setDeleteTarget={setDeleteTarget}
      />

      <AlertDeleteModal
        isOpen={isDeleteModalOpen}
        disabled={isDisabled}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteNotifications}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
};

export default AlertView;

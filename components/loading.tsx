import React from "react";
import { Modal, Spinner } from "react-bootstrap";

import Translation from "components/translation";

import { useLoadersStore } from "x-hooks/stores/loaders/loaders.store";

export default function Loading() {
  const { loading } = useLoadersStore();

  return (
    <Modal
      show={loading?.isLoading}
      size="sm"
      backdrop="static"
      aria-labelledby="loading-modal"
      centered
    >
      <Modal.Body className="d-flex align-self-center">
        <Spinner className="align-self-center p-2 mt-1" animation="border" />
        <h4 className="align-self-stretch ms-3 mt-2">
          {loading?.text || <Translation label="please-wait" />}
        </h4>
      </Modal.Body>
    </Modal>
  );
}

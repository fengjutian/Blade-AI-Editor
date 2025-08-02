import React, { use, useEffect, useState } from 'react';
import { Modal } from 'antd';

const Setting: React.FC<{isOpen: boolean, closeOpen: () => void}> = (props) => {

  const { isOpen, closeOpen } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen])

  const handleOk = () => {
    setIsModalOpen(false);
    closeOpen()
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    closeOpen()
  };

  return (
    <>
      <Modal
        title="设置"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
};

export default Setting;
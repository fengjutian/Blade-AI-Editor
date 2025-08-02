import React, { use, useEffect, useState } from 'react';
import { Modal } from 'antd';
import { Command } from 'cmdk';

const Search: React.FC<{ isOpen: boolean, closeOpen: () => void }> = (props) => {
  const { isOpen, closeOpen } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen])

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        title="搜索"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >

      <Command.Dialog open={isModalOpen}>
        <Command.Input />
          <Command.List>
            {loading && <Command.Loading>Hang on…</Command.Loading>}

            <Command.Empty>No results found.</Command.Empty>

            <Command.Group heading="Fruits">
              <Command.Item>Apple</Command.Item>
              <Command.Item>Orange</Command.Item>
              <Command.Separator />
              <Command.Item>Pear</Command.Item>
              <Command.Item>Blueberry</Command.Item>
            </Command.Group>

            <Command.Item>Fish</Command.Item>
          </Command.List>
        </Command.Dialog>

      </Modal>
    </>
  );
};

export default Search;
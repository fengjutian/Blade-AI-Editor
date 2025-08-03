import React, { use, useEffect, useState } from 'react';
import type { FormProps, DescriptionsProps, CheckboxProps  } from 'antd';
import { Button, Checkbox, Form, Input, Descriptions, Modal  } from 'antd';

  type FieldType = {
    baseURL?: string;
    model?: string;
    apiKey?: string;
  };

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

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onChange: CheckboxProps['onChange'] = (e) => {
    console.log(`checked = ${e.target.checked}`);
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
        <Descriptions title="Chat 配置"></Descriptions>
          <Form
            name="basic"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 18 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              label="baseURL"
              name="baseURL"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item<FieldType>
              label="model"
              name="model"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item<FieldType>
              label="apiKey"
              name="apiKey"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>
          </Form>
          <Checkbox onChange={onChange}>是否保存到本地</Checkbox>

        <Descriptions title="字体配置"></Descriptions>




      </Modal>
    </>
  );
};

export default Setting;

"use client"

import React, { useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Flex, message, Upload } from 'antd';
import type { GetProp, UploadProps } from 'antd';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const UploadFile: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );


  const getUser = () => {
    fetch('/api/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(data => {
        console.log('User data:', data);
      //   message.success(`User fetched: ${data.name}`);
      })
      .catch(error => {
        console.error('Error fetching user:', error);
        message.error('Failed to fetch user');
      });
  };


  const createFile = () => {
    fetch('/api/files', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log('File created:', data);
        message.success('File created successfully');
      })
      .catch(error => {
        console.error('Error creating file:', error);
        message.error('Failed to create file');
      });
  };

  const readFileList = () => {
      fetch('/api/files', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        console.log('File list:', data);
        message.success('File list fetched successfully');
      })
      .catch(error => {
        console.error('Error fetching file list:', error);
        message.error('Failed to fetch file list');
      });
  }

  return (
    <Flex gap="middle" wrap>
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>

      <Button  type="primary" onClick={getUser}>接口测试</Button>
      <Button  type="primary" onClick={createFile}>创建文件</Button>
      <Button  type="primary" onClick={readFileList}>读取文件列表</Button>



    </Flex>
  );
};

export default UploadFile;

'use client';
import { useState, useEffect, useRef } from 'react';
import { List, Avatar, Input, Button, Space, message } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import styles from './conversation.module.css';

export default function ConversationPage() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      content: '你好！我是AI助手，有什么可以帮助你的吗？',
      timestamp: '10:00',
      sender: 'ai',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) {
      message.warning('请输入消息内容');
      return;
    }

    // 添加用户消息
    const userMessage = {
      id: Date.now().toString(),
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'user',
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');

    // 模拟AI回复
    setTimeout(() => {
      const aiReply = {
        id: Date.now().toString(),
        content: `你刚才说：${inputValue}`,

        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'ai'
      };

      setMessages([...newMessages, aiReply]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.messageList}>
        <List
          dataSource={messages}
          renderItem={(item) => (
            <List.Item className={styles.messageItem}>
              <div className={item.sender === 'user' ? styles.userMessage : styles.aiMessage}>
                <div className={styles.avatarContainer}>
                  <Avatar icon={item.sender === 'user' ? <UserOutlined /> : <RobotOutlined />} />
                </div>
                <div className={styles.messageContent}>
                  <div className={styles.messageText}>{item.content}</div>
                  <div className={styles.timestamp}>{item.timestamp}</div>
                </div>
              </div>
            </List.Item>
          )}
        />
        <div ref={messagesEndRef} /></div>
      <div className={styles.inputArea}>
        <Space.Compact style={{ width: '100%' }}>
          <Input
            placeholder="请输入消息..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPressEnter={handleKeyPress}
            className={styles.input}
          />
          <Button type="primary" icon={<SendOutlined />} onClick={handleSendMessage} className={styles.sendButton}>
            发送
          </Button>
        </Space.Compact>
      </div>
    </div>
  );
}

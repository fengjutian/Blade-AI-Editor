import { create } from 'zustand';

type ChatStore = {
  chatTabType: boolean;
  openChatTab: (open: boolean) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  chatTabType: false,
  openChatTab: (open: boolean) => set(() => ({ chatTabType: open })),
}))

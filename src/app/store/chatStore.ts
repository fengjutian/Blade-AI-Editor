import { create } from 'zustand'

export const useChatStore = create((set) => ({
  chatTabType: false,
  openChatTab: () => set((state: any) => ({ count: !state.chatTabType })),
}))

// function Counter() {
//   const { count, inc } = useStore()
//   return (
//     <div>
//       <span>{count}</span>
//       <button onClick={inc}>one up</button>
//     </div>
//   )
// }

import { create } from "zustand";

export type Message = {
  sender: string;
  receiver: string;
  message: string;
  createdAt?: string ;
  status?: "sent" | "delivered" | "seen";
};

type Conversation = {
  userId: string;
  username: string;
  profile_image?: string;
  lastMessage: string;
  createdAt: string;
  isOwn?: boolean;
};

type ChatUser = {
  _id: string;
  username: string;
  profile_image?: string | null;
};

type ChatStore = {
  activeChat: ChatUser | null;
  messages: Message[];
  conversations: Conversation[];

  setActiveChat: (user: ChatUser) => void;
 setMessages: (
  msgs: Message[] | ((prev: Message[]) => Message[])
) => void;
  addMessage: (msg: Message) => void;

  setConversations: (data: Conversation[]) => void;
  updateConversation: (msg: Message, currentUserId: string,metaUser:any) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  activeChat: null,
  messages: [],
  conversations: [],

  setActiveChat: (user) =>
    set(() => ({
      activeChat: user,
      //   messages: [], // reset messages on chat switch
    })),

 setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) =>
  set((state) => ({
    messages:
      typeof messages === "function"
        ? messages(state.messages)
        : messages,
  })),

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
    })),

  setConversations: (data) =>
    set({
      conversations: Array.isArray(data) ? data : [],
    }),

  updateConversation: (msg, currentUserId,metaUser?) =>
    set((state) => {
      const otherUserId =
        msg.sender === currentUserId ? msg.receiver : msg.sender;

      const existing = state.conversations.find(
        (c) => c.userId === otherUserId,
      );

      const updated = {
        userId: otherUserId,
        username: existing?.username || metaUser?.username || "Unknown",
        profile_image: existing?.profile_image || metaUser?.profile_image || null,
        lastMessage: msg.message,
        createdAt: new Date().toISOString(),
        isOwn: msg.sender === currentUserId,
      };

      console.log(updated);

      const filtered = state.conversations.filter(
        (c) => c.userId !== otherUserId,
      );

      return {
        conversations: [updated, ...filtered],
      };
    }),
}));

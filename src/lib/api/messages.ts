import { api } from "./client";

/**
 * Direct messages between any two accounts.
 *
 * The API returns the *other* participant as `participant`, so a thread
 * never has to work out whose name to show.
 */
export type Conversation = {
  id: string;
  subject: string;
  participant: { id: string; name: string; avatar: string } | null;
  property?: { id: string; title: string; slug: string } | null;
  lastMessage?: {
    body: string;
    senderId: string;
    createdAt: string;
  } | null;
  unreadCount: number;
  updatedAt: string;
};

export type Message = {
  id: string;
  body: string;
  attachment: string | null;
  sender?: { id: string; name: string; avatar: string };
  isOwn: boolean;
  createdAt: string;
};

export type ConversationList = {
  data: Conversation[];
  meta?: { currentPage: number; lastPage: number; total: number };
};

/**
 * `messages` comes back as a plain array, not `{ data: [...] }`: the API
 * nests the resource collection inside its own JSON response, and Laravel
 * only adds the `data` wrapper when a collection is the top-level return.
 */
export type Thread = {
  conversation: Conversation;
  messages: Message[];
};

export async function listConversations(page = 1): Promise<ConversationList> {
  return api(`/my/conversations?page=${page}`);
}

export async function getThread(id: string): Promise<Thread> {
  const res = await api<{
    conversation: Conversation;
    messages: Message[] | { data: Message[] };
  }>(`/my/conversations/${id}`);

  /*
   * Tolerate both shapes. It is a plain array today, but it would become
   * `{ data: [...] }` the moment the endpoint returns the collection
   * directly -- and getting that wrong empties the thread rather than
   * failing loudly, so normalise it here instead of at the call site.
   */
  const messages = Array.isArray(res.messages)
    ? res.messages
    : (res.messages?.data ?? []);

  return { conversation: res.conversation, messages };
}

export async function unreadMessageCount(): Promise<{
  data: { count: number };
}> {
  return api("/my/conversations/unread-count");
}

/** Starts a thread, or appends to the existing one with the same person. */
export async function startConversation(input: {
  recipientId: string;
  message: string;
  propertyId?: string;
}): Promise<{ data: Conversation }> {
  return api("/my/conversations", {
    method: "POST",
    body: {
      recipientId: input.recipientId,
      message: input.message,
      ...(input.propertyId ? { propertyId: input.propertyId } : {}),
    },
  });
}

/**
 * FormData throughout, so a reply can carry an attachment; the API client
 * passes it through and lets the browser set the boundary.
 */
export async function sendMessage(
  conversationId: string,
  input: { message: string; attachment?: File | null },
): Promise<{ data: Message }> {
  const form = new FormData();
  form.append("message", input.message);
  if (input.attachment) form.append("attachment", input.attachment);

  return api(`/my/conversations/${conversationId}/messages`, {
    method: "POST",
    body: form,
  });
}

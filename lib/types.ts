import type { ReactNode } from "react";

export type Role = "user" | "assistant" | "system";

export type Message = {
  id: string;
  role: Role;
  content: string;
  timestamp: string;
};

export type Session = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
};

export type DocumentEntry = {
  id: string;
  title: string;
  content: string;
  uploadedAt: string;
  tags: string[];
};

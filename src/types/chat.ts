export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  timestamp: Date;
  status?: "success" | "out_of_domain" | "error";
}

export interface RAGResponse {
  answer: string;
  source: string | string[];
  results_count: number;
  status: "success" | "out_of_domain";
}

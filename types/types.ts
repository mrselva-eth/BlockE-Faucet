export type ClaimStatus = "idle" | "loading" | "success" | "error"

export interface Transaction {
  hash: string
  timestamp: string
}


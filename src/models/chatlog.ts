import Lession from "./lession"
import user from "./user"

export interface chatlog{
    user: user,
    messages: [
        {
            role: 'user'| 'ai',
            content: String,
            timestamp: Date
        }
    ],
  lession: Lession,
  createdAt: Date
}
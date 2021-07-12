export interface UsersCollection {
  cards: Card[]
}

type StringDate = string

export interface Card {
  front: string
  id: string
  answer: string | null
  answer2: string | null
  createdAt: number
  tags: string[] | null
  lastReview: StringDate | null
  difficulty: number
  repetitions: number
  wrongReviews: number
  draft: boolean
}

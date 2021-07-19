export interface UsersCollection {
  cards: FBCard[]
}

type StringDate = string

export interface FBCard {
  front: string
  answer: string | null
  answer2: string | null
  createdAt: number
  tags: string[] | null
  lastReview: StringDate | null
  difficulty: number
  reviews: number
  wrongReviews: number
  draft: boolean
}

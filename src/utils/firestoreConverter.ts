import { QueryDocumentSnapshot } from 'firebase/firestore'

export const converterWithId = <
  T extends { id: string; [k: string]: any },
>() => ({
  toFirestore: ({ id, ...data }: T) => data,
  fromFirestore: (snap: QueryDocumentSnapshot): T => ({
    ...(snap.data() as any),
    id: snap.id,
  }),
})

export const converter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: QueryDocumentSnapshot): T => snap.data() as T,
})

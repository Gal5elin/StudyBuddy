enum Visibility {
    "public",
    "private"
}

export interface INote {
    title: string,
    description: string,
    user_id: number,
    subject_id: number,
    visibility: Visibility,
    secret_key: string
}
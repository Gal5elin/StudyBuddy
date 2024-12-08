export enum Visibility {
  public = "public",
  hidden = "hidden",
}

export interface INote {
  id?: number;
  title: string;
  description: string;
  user_id: number;
  subject_id: number;
  visibility: Visibility;
  secret_key: string;
}

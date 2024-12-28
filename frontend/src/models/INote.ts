export enum Visibility {
  public = "public",
  hidden = "hidden",
}

export interface INoteFile {
  id: number;
  file_id?: number;
  file_name: string;
  file_path: string;
  uploaded_at: string;
}

export interface INote {
  id: number;
  title: string;
  description: string;
  user_id: number;
  subject_id: number;
  visibility: string;
  secret_key: string | null;
  created_at: string;
  files: INoteFile[];
}

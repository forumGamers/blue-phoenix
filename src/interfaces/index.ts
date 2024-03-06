export interface FileInput {
  contentType: string;
  size: number;
  content: Buffer;
  filename: string;
  header: string;
}

export interface BasePaginationInput {
  page: number;
  limit: number;
}

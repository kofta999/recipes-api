interface CustomError extends Error {
  statusCode: number;
}

interface CustomResponse {
  success: boolean;
  status_message: string;
  data: object | null;
}

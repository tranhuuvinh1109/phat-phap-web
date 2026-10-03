import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

import { uploadFile } from "./file.api";
import { UploadFileResult } from "./file.type";

export interface UploadFileVariables {
  file: File;
  onProgress?: (percent: number) => void;
}

export type UseUploadFileOptions = Omit<
  UseMutationOptions<UploadFileResult, AxiosError, UploadFileVariables>,
  "mutationFn"
>;

/**
 * Mutation hook for requesting presigned URL and uploading file to S3
 */
export const useUploadFile = (
  options?: UseUploadFileOptions
): UseMutationResult<UploadFileResult, AxiosError, UploadFileVariables> => {
  return useMutation({
    mutationFn: ({ file, onProgress }) => uploadFile(file, onProgress),
    ...options,
  });
};

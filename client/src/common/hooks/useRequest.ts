import { useState } from "react";
import { Methods } from "../enums/methods.enum";
import { Error } from "../types/error.type";
import axios from "axios";
import { on } from "events";

const BASE_URL = "https://ticketing.dev/api/";

export function useRequest(
  endpoint: string,
  method: Methods,
  onSuccess?: (res: any) => void | Promise<void>
) {
  const [errors, setErrors] = useState<Error[] | null>(null);
  const url = `${BASE_URL}${endpoint}`;

  const doRequest = async (body: any) => {
    try {
      setErrors(null);
      const response = await axios[method](url, body);
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err: any) {
      setErrors(err.response.data.errors as Error[]);
    }
  };

  return [doRequest, errors] as const;
}

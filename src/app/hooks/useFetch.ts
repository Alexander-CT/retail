// import { type } from "os";
import 'dotenv/config';
type UseFetchProps =
    | {
          search?: string;
          query?: string;
          per_page?: number;
      }
    | undefined;

type UseFetch = (props: UseFetchProps) => Promise<ApiResult>;
export const useFetch: UseFetch = async ({
    search = 'photos',
    query = 'clothing',
    per_page = 30,
} = {}) => {
    const API_KEY = process.env.API_KEY;
    const response = fetch(
        `https://api.unsplash.com/search/${search}/?query=${query}&page=1&per_page=${per_page}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Client-ID ${API_KEY}`,
                'Content-Type': 'application/json',
                'Accept-Version': 'v1',
                // Accept: 'application/json',
            },
        }
    );
    return (await response).json() as Promise<ApiResult>;
};

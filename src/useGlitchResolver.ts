import axios from "axios";
import { useSWRConfig } from "swr";
import Lexeme from "./models/Lexeme";

export default function useGlitchResolver(languageId: string): GlitchResolver {
  const { mutate } = useSWRConfig();
  return {
    async addLexeme(lexeme: Lexeme): Promise<Lexeme> {
      const postUrl = "/api/lexemes";
      const getUrl = `/api/lexemes?language=${languageId}`;
      const postedValue = (await axios.post<Lexeme>(postUrl, lexeme)).data;
      mutate(getUrl);
      return postedValue;
    },
  };
}

export interface GlitchResolver {
  addLexeme(lexeme: Lexeme): Promise<Lexeme>;
}

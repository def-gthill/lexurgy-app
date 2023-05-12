import axios from "axios";
import { useSWRConfig } from "swr";
import Lexeme from "./models/Lexeme";

export default function useGlitchResolver(languageId: string): GlitchResolver {
  const { mutate } = useSWRConfig();
  return {
    async addLexeme(glitchId: string, lexeme: Lexeme): Promise<Lexeme> {
      await deleteGlitch(glitchId);
      const postUrl = "/api/lexemes";
      const getUrl = `/api/lexemes?language=${languageId}`;
      const postedValue = (await axios.post<Lexeme>(postUrl, lexeme)).data;
      mutate(getUrl);
      return postedValue;
    },
    async deleteTranslation(glitchId: string, id: string): Promise<void> {
      await deleteGlitch(glitchId);
      const deleteUrl = `/api/translations/${id}`;
      const getUrl = `/api/translations?language=${languageId}`;
      await axios.delete(deleteUrl);
      mutate(getUrl);
    },
  };

  async function deleteGlitch(id: string) {
    await axios.delete(`/api/glitches/${id}`);
    mutate(`/api/glitches?language=${languageId}`);
  }
}

export interface GlitchResolver {
  addLexeme(glitchId: string, lexeme: Lexeme): Promise<Lexeme>;
  deleteTranslation(glitchId: string, id: string): Promise<void>;
}

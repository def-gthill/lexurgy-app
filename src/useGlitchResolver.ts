import axios from "axios";
import { useSWRConfig } from "swr";
import Glitch from "./models/Glitch";
import Lexeme from "./models/Lexeme";
import Translation from "./models/Translation";

export default function useGlitchResolver(languageId: string): GlitchResolver {
  const { mutate } = useSWRConfig();
  return {
    async deleteGlitch(id: string): Promise<Glitch> {
      const deletedValue = (await axios.delete(`/api/glitches/${id}`)).data;
      mutate(`/api/glitches?language=${languageId}`);
      return deletedValue;
    },
    async addLexeme(lexeme: Lexeme): Promise<Lexeme> {
      const postUrl = "/api/lexemes";
      const getUrl = `/api/lexemes?language=${languageId}`;
      const postedValue = (await axios.post<Lexeme>(postUrl, lexeme)).data;
      mutate(getUrl);
      return postedValue;
    },
    async addTranslation(translation: Translation): Promise<Translation> {
      const postUrl = "/api/translations";
      const getUrl = `/api/translations?language=${languageId}`;
      const postedValue = (await axios.post<Translation>(postUrl, translation))
        .data;
      mutate(getUrl);
      return postedValue;
    },
    async deleteTranslation(id: string): Promise<Translation> {
      const deleteUrl = `/api/translations/${id}`;
      const getUrl = `/api/translations?language=${languageId}`;
      const deletedValue = (await axios.delete(deleteUrl)).data;
      mutate(getUrl);
      return deletedValue;
    },
  };
}

export interface GlitchResolver {
  deleteGlitch(id: string): Promise<Glitch>;
  addLexeme(lexeme: Lexeme): Promise<Lexeme>;
  addTranslation(translation: Translation): Promise<Translation>;
  deleteTranslation(id: string): Promise<Translation>;
}
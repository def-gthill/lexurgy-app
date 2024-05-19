import Scv1Request from "@/sc/Scv1Request";
import Scv1Response from "@/sc/Scv1Response";
import axios from "axios";

export async function getRuleNames(changes: string): Promise<string[]> {
  const response = await axios.post<{ ruleNames: string[] }>(
    "/api/services",
    { changes },
    { params: { endpoint: "scv1/validate" } }
  );
  return response.data.ruleNames;
}

export async function runSoundChanges(
  inputs: Scv1Request
): Promise<Scv1Response> {
  const response = await axios.post<Scv1Response>("/api/services", inputs, {
    params: { endpoint: "scv1" },
  });
  return response.data;
}

import { Scv1PollResponse } from "@/sc/Scv1PollResponse";
import Scv1Request from "@/sc/Scv1Request";
import Scv1Response from "@/sc/Scv1Response";
import Scv1RunningInBackgroundResponse from "@/sc/Scv1RunningInBackgroundResponse";
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
  inputs: Scv1Request,
  onStatusUpdate: (message: string) => void
): Promise<Scv1Response> {
  const startTime = window.performance.now();
  const response = await axios.post<
    Scv1Response | Scv1RunningInBackgroundResponse
  >("/api/services", inputs, {
    params: { endpoint: "scv1" },
  });
  if ("url" in response.data) {
    return await pollSoundChanger(
      response.data.url,
      response.data.affinityHeaders,
      startTime,
      onStatusUpdate
    );
  } else {
    return response.data;
  }
}

async function pollSoundChanger(
  url: string,
  affinityHeaders: Record<string, string>,
  startTime: number,
  onStatusUpdate: (message: string) => void
): Promise<Scv1Response> {
  return new Promise((resolve, reject) => {
    const timer = setInterval(async () => {
      try {
        const response = await axios.get<Scv1PollResponse>("/api/services", {
          params: { endpoint: url },
          headers: {
            "lexurgy-affinity-headers": JSON.stringify(affinityHeaders),
          },
        });
        const elapsedSeconds = Math.round(
          (window.performance.now() - startTime) / 1000
        );

        onStatusUpdate(`\nStill running... (${elapsedSeconds} seconds passed)`);
        if (response.data.status === "done") {
          clearInterval(timer);
          resolve(response.data.result);
        }
      } catch (e) {
        clearInterval(timer);
        reject(e);
      }
    }, 2500);
  });
}

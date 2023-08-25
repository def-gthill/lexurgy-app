import { set } from "@/array";
import Header from "@/components/Header";
import PageInfo from "@/components/PageInfo";
import SplitPane from "@/components/SplitPane";
import InflectRequest from "@/inflect/InflectRequest";
import InflectResponse from "@/inflect/InflectResponse";
import { emptyMorph } from "@/inflect/Morph";
import * as Label from "@radix-ui/react-label";
import axios from "axios";
import { useState } from "react";

export default function InflectPublic() {
  const [rules, setRules] = useState("");
  const [morphs, setMorphs] = useState([emptyMorph()]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("Ready");
  return (
    <>
      <PageInfo
        title="Lexurgy Inflector"
        description="A high-powered morphology engine"
      />
      <Header />
      <main>
        <div className="card">
          <SplitPane>
            <div>
              <Label.Root htmlFor="rules" style={{ fontWeight: "bold" }}>
                Inflection Rules
              </Label.Root>
              <input
                id="rules"
                type="text"
                style={{ display: "block" }}
                value={rules}
                onChange={(event) => setRules(event.target.value)}
              />
              <div id="status">{error ?? status}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div>
                <table>
                  <thead>
                    <tr>
                      <th>Stem</th>
                      <th>Inflected Form</th>
                    </tr>
                  </thead>
                  <tbody>
                    {morphs.map((morph, i) => (
                      <tr key={i}>
                        <td>
                          <input
                            type="text"
                            value={morph.stem}
                            onChange={(event) => setStem(i, event.target.value)}
                          />
                        </td>
                        <td>{morph.inflectedForm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {morphs.at(-1)?.stem && (
                <div className="buttons">
                  <button onClick={addForm}>Add Form</button>
                </div>
              )}
            </div>
          </SplitPane>
          <button
            onClick={runInflect}
            style={{
              fontSize: "2em",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            Apply
          </button>
        </div>
      </main>
    </>
  );

  function addForm() {
    setMorphs([...morphs, emptyMorph()]);
  }

  function setStem(i: number, stem: string) {
    setMorphs(set(morphs, i, { ...morphs[i], stem }));
  }

  async function runInflect() {
    setStatus("Running...");
    const request: InflectRequest = {
      rules: {
        type: "form",
        form: rules,
      },
      stemsAndCategories: morphs
        .filter((morph) => morph.stem)
        .map((morph) => ({
          stem: morph.stem,
          categories: [],
        })),
    };
    try {
      const response = await axios.post<InflectResponse>(
        "/api/services",
        request,
        {
          params: { endpoint: "inflectv1" },
        }
      );
      setMorphs(
        morphs.map((morph, i) => ({
          ...morph,
          inflectedForm: response.data.inflectedForms[i],
        }))
      );
    } catch (error: any) {
      if (error.response) {
        setError(error.response.data);
      }
    } finally {
      setStatus("Ready");
    }
  }
}

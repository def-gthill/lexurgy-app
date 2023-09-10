import { set } from "@/array";
import EditorPane from "@/components/EditorPane";
import Header from "@/components/Header";
import PageInfo from "@/components/PageInfo";
import Select from "@/components/Select";
import SplitPane from "@/components/SplitPane";
import { emptyDimension } from "@/inflect/Dimension";
import InflectRequest, { fromRules } from "@/inflect/InflectRequest";
import InflectResponse from "@/inflect/InflectResponse";
import { InflectRules } from "@/inflect/InflectRules";
import { InflectRulesEditor_NEW } from "@/inflect/InflectRulesEditor";
import { Morph, emptyMorph } from "@/inflect/Morph";
import axios from "axios";
import { useState } from "react";

export default function InflectPublic() {
  const [dimensions, setDimensions] = useState([emptyDimension()]);
  const [rules, setRules] = useState<InflectRules>("");
  const [morphs, setMorphs] = useState([newMorph()]);
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
              <table id="dimensions">
                <thead>
                  <tr>
                    <th>Dimension</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {dimensions.map(({ name, categories }, i) => (
                    <tr key={i}>
                      <td>
                        <input
                          type="text"
                          size={10}
                          value={name}
                          onChange={(event) =>
                            setDimension(i, event.target.value)
                          }
                        />
                      </td>
                      {name &&
                        categories.map((category, j) => (
                          <td key={j}>
                            <input
                              type="text"
                              size={10}
                              value={category}
                              onChange={(event) =>
                                setCategory(i, j, event.target.value)
                              }
                            />
                          </td>
                        ))}
                      {!!categories.at(-1) && (
                        <td>
                          <button onClick={() => addCategory(i)}>Add</button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* <EditorPane id="rules">
                <h4>Inflection Rules</h4>
                <InflectRulesEditor rules={rules} saveRules={setRules} />
              </EditorPane> */}
              <EditorPane>
                <h4>Inflection Rules (New)</h4>
                <InflectRulesEditor_NEW rules={rules} saveRules={setRules} />
              </EditorPane>
              {/* <EditorPane>
                <h4>Inflection Rules (New)</h4>
                <InflectRulesEditor_NEW rules={rules} saveRules={setRules} />
              </EditorPane> */}
              <div id="status">{error ?? status}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div id="morphs">
                <table>
                  <thead>
                    <tr>
                      <th>Stem</th>
                      {dimensions.map(({ name }, i) => (
                        <th key={i}>{toNiceName(name)}</th>
                      ))}
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
                        {dimensions.map(({ name, categories }, j) => (
                          <td key={j}>
                            <Select
                              options={[
                                { name: "None", value: "" },
                                ...categories.map((category) => ({
                                  name: toNiceName(category),
                                  value: category,
                                })),
                              ]}
                              onChange={(value) =>
                                setMorphCategory(i, name, value)
                              }
                            />
                          </td>
                        ))}
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

  function newMorph(): Morph {
    return emptyMorph();
  }

  function addForm() {
    setMorphs([...morphs, newMorph()]);
  }

  function setStem(i: number, stem: string) {
    setMorphs(set(morphs, i, { ...morphs[i], stem }));
  }

  function setMorphCategory(i: number, dimension: string, category: string) {
    setMorphs(set(morphs, i, { ...morphs[i], categories: [category] }));
  }

  function setDimension(i: number, dimension: string) {
    setDimensions(set(dimensions, i, { ...dimensions[i], name: dimension }));
  }

  function addCategory(i: number) {
    setDimensions(
      set(dimensions, i, {
        ...dimensions[i],
        categories: [...dimensions[i].categories, ""],
      })
    );
  }

  function setCategory(i: number, j: number, category: string) {
    setDimensions(
      set(dimensions, i, {
        ...dimensions[i],
        categories: set(dimensions[i].categories, j, category),
      })
    );
  }

  function toNiceName(name: string) {
    return name
      .split("-")
      .map((word) => word.slice(0, 1).toLocaleUpperCase() + word.slice(1))
      .join(" ");
  }

  async function runInflect() {
    setStatus("Running...");
    const request: InflectRequest = {
      rules: fromRules(rules),
      stemsAndCategories: morphs
        .filter((morph) => morph.stem)
        .map((morph) => ({
          stem: morph.stem,
          categories: morph.categories,
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
        setError(error.response.data.message);
      }
    } finally {
      setStatus("Ready");
    }
  }
}

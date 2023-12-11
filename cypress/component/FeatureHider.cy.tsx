import FeatureHider from "@/components/FeatureHider";

describe("FeatureHider", () => {
  it("displays its first child if the feature check fails", () => {
    async function cantCheckFeature(): Promise<number> {
      throw new Error("Can't check feature");
    }
    cy.mount(
      <FeatureHider getVisibleChild={cantCheckFeature}>
        <div>Hello</div>
        <div>Goodbye</div>
      </FeatureHider>
    );
    cy.contains("Hello");
  });

  it("displays its first child if the feature check returns 0", () => {
    async function checkFeature(): Promise<number> {
      return 0;
    }
    cy.mount(
      <FeatureHider getVisibleChild={checkFeature}>
        <div>Hello</div>
        <div>Goodbye</div>
      </FeatureHider>
    );
    cy.contains("Hello");
  });

  it("displays its second child if the feature check returns 1", () => {
    async function checkFeature(): Promise<number> {
      return 1;
    }
    cy.mount(
      <FeatureHider getVisibleChild={checkFeature}>
        <div>Hello</div>
        <div>Goodbye</div>
      </FeatureHider>
    );
    cy.contains("Goodbye");
  });
});

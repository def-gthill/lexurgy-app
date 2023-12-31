import axios from "axios";

describe("the user endpoint", () => {
  beforeEach(() => {
    cy.resetDb();
    cy.login("default");
  });

  it("rejects creation of duplicate users", () => {
    const sendRequest = (id: string, username: string) => {
      return axios.post("/api/users", {
        id: id,
        username: username,
      });
    };

    const id1 = crypto.randomUUID();
    const id2 = crypto.randomUUID();

    const request1 = sendRequest(id1, "someuser");
    const request2 = sendRequest(id2, "someuser");

    Promise.all([request1, request2]).then(() => {
      cy.request({
        url: "/api/users?username=someuser",
        method: "GET",
      }).then((response) => {
        expect(response.body).to.have.length(1);
      });
    });
  });
});

export {};

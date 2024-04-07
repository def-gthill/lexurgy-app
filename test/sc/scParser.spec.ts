import { parser } from "@/sc/scParser";
import { fileTests, testTree } from "@lezer/generator/dist/test";
import { readFileSync } from "fs";

describe("the SC syntax highlighting parser", () => {
  let tests = fileTests(
    readFileSync("test/sc/scParser.spec.grammar", "utf8"),
    "scParser.spec.grammar"
  );
  for (let { name, run } of tests) it(name, () => run(parser));

  it("Leading comment", () => {
    let tree = parser.parse(`
    # Comment
    foo:
      a => b
    `);
    let spec = `
    file(
      Comment,
      ChangeRule(
        RuleName(Name),
        Block(
          BlockElement(
            ExpressionList(
              StandardExpression(
                RuleElement(Text(Name)),
                Text(Name)
              )
            )
          )
        )
      )
    )
    `;
    testTree(tree, spec);
  });

  it("Then and multiple rules with extra newlines", () => {
    let tree = parser.parse(`
    foo:
      a => b
      then:
      c => *
    
    bar:
      unchanged
    `);
    let spec = `
    file(
      ChangeRule(
        RuleName(Name),
        Block(
          BlockElement(
            ExpressionList(
              StandardExpression(
                RuleElement(Text(Name)),
                Text(Name)
              )
            )
          ),
          BlockType(BlockTypeKw),
          BlockElement(
            ExpressionList(
              StandardExpression(
                RuleElement(Text(Name)),
                Empty
              )
            )
          )
        )
      ),
      ChangeRule(
        RuleName(Name),
        Block(BlockElement(ExpressionList(KeywordExpression)))
      )
    )
    `;
    testTree(tree, spec);
  });

  it("Comments between rules", () => {
    let tree = parser.parse(`
    foofoo:
      a => b
    
    # Comment
    barbar:
      c => d
    `);
    let spec = `
    file(
      ChangeRule(
        RuleName(Name),
        Block(
          BlockElement(
            ExpressionList(
              StandardExpression(
                RuleElement(Text(Name)),
                Text(Name)
              )
            )
          )
        )
      ),
      Comment,
      ChangeRule(
        RuleName(Name),
        Block(
          BlockElement(
            ExpressionList(
              StandardExpression(
                RuleElement(Text(Name)),
                Text(Name)
              )
            )
          )
        )
      ),
    )
    `;
    testTree(tree, spec);
  });
});

// Generated from sdks/typescript/src/definitions/compiler/literals.ts. Do not edit; run the Octonode SDK sync.
import * as ts from "typescript";

/** Configuration is data: never evaluate a config or its imported application. */
export function literal(expression: ts.Expression): unknown {
  if (ts.isAsExpression(expression) || ts.isSatisfiesExpression(expression) || ts.isParenthesizedExpression(expression))
    return literal(expression.expression);
  if (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression)) return expression.text;
  if (ts.isNumericLiteral(expression)) return Number(expression.text);
  if (expression.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (expression.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (expression.kind === ts.SyntaxKind.NullKeyword) return null;
  if (
    ts.isPrefixUnaryExpression(expression) &&
    expression.operator === ts.SyntaxKind.MinusToken &&
    ts.isNumericLiteral(expression.operand)
  )
    return -Number(expression.operand.text);
  if (ts.isArrayLiteralExpression(expression)) return expression.elements.map((item) => literal(item));
  if (ts.isObjectLiteralExpression(expression))
    return Object.fromEntries(properties(expression).map(([key, value]) => [key, literal(value)]));
  throw new Error(
    "Octonode definition metadata must use literals; calls, spreads and computed values are not supported",
  );
}

export function properties(expression: ts.Expression): [string, ts.Expression][] {
  if (!ts.isObjectLiteralExpression(expression)) throw new Error("Expected an inline definition object");
  const seen = new Set<string>();
  return expression.properties.map((property) => {
    if (!ts.isPropertyAssignment(property) || (!ts.isIdentifier(property.name) && !ts.isStringLiteral(property.name)))
      throw new Error("Definition properties must be explicit; spreads, methods and computed keys are not supported");
    const key = property.name.text;
    if (seen.has(key) || ["__proto__", "constructor", "prototype"].includes(key))
      throw new Error(`Duplicate or reserved definition key: ${key}`);
    seen.add(key);
    return [key, property.initializer];
  });
}

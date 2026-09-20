// Generated from packages/plugin-runtime/src/definitions/compiler/schemas.ts. Do not edit; run the Octonode SDK sync.
import * as ts from "typescript";

/** Public plugin contracts must be finite JSON values, never silently widened to unknown. */
export function schemaFor(
  checker: ts.TypeChecker,
  type: ts.Type,
  seen = new Set<ts.Type>(),
  optional = false,
): Record<string, unknown> {
  const fail = (): never => {
    throw new Error(
      `Cannot infer a JSON contract for ${checker.typeToString(type)}; use a concrete JSON-compatible function signature`,
    );
  };
  if (seen.has(type)) return fail();
  const next = new Set(seen).add(type);
  if (type.isUnion()) {
    const members = type.types.filter((item) => !optional || !(item.flags & ts.TypeFlags.Undefined));
    if (members.length === 1) return schemaFor(checker, members[0], seen);
    if (members.every((item) => item.flags & ts.TypeFlags.BooleanLiteral)) return { type: "boolean" };
    if (members.every((item) => item.isStringLiteral() || item.isNumberLiteral())) {
      const values = members.map((item) => (item as ts.LiteralType).value);
      if (values.every((value) => typeof value === typeof values[0])) return { type: typeof values[0], enum: values };
    }
    return fail();
  }
  if (type.isStringLiteral() || type.isNumberLiteral()) return { type: typeof type.value, enum: [type.value] };
  if (type.flags & ts.TypeFlags.String) return { type: "string" };
  if (type.flags & ts.TypeFlags.Number) return { type: "number" };
  if (type.flags & ts.TypeFlags.BooleanLike) return { type: "boolean" };
  if (type.flags & ts.TypeFlags.Null) return { type: "null" };
  if (checker.isArrayType(type))
    return { type: "array", items: schemaFor(checker, checker.getTypeArguments(type as ts.TypeReference)[0], next) };
  if (
    !(
      type.flags & ts.TypeFlags.Object ||
      (type.isIntersection() && type.types.every((member) => member.flags & ts.TypeFlags.Object))
    ) ||
    checker.isTupleType(type) ||
    type.getCallSignatures().length ||
    type.getConstructSignatures().length ||
    checker.getIndexInfosOfType(type).length
  )
    return fail();
  if (
    (type.isIntersection() ? type.types : [type]).some((member) =>
      member.getSymbol()?.declarations?.some((declaration) => ts.isClassDeclaration(declaration)),
    )
  )
    return fail();
  const properties: Record<string, unknown> = Object.create(null);
  const required: string[] = [];
  for (const property of type.getProperties()) {
    const declaration = property.valueDeclaration ?? property.declarations?.[0];
    if (!declaration) return fail();
    const value = checker.getTypeOfSymbolAtLocation(property, declaration);
    const optional = !!(property.flags & ts.SymbolFlags.Optional);
    properties[property.name] = schemaFor(checker, value, next, optional);
    if (!optional) required.push(property.name);
  }
  return { type: "object", properties, required };
}

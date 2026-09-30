import type { Client } from "../gen/client";
import type {
  DataTableScope,
  DataTable,
  DataTableRow,
  DataTableRows,
  ListRowsOptions,
  UpdateTableInput,
  UpdateRowInput,
  DataTableSqlResult,
} from "./types";

function segment(value: string): string {
  if (!value?.trim() || value === "." || value === "..") throw new Error("A non-empty resource ID is required");
  return encodeURIComponent(value);
}

/** Bind a table once; all requests reuse the client's authentication and transport. */
export function dataTable(client: Client, tableId: string, scope: DataTableScope) {
  if (scope.workspace && !["org", "team", "user"].includes(scope.workspace.kind)) {
    throw new Error("Workspace kind must be org, team, or user");
  }
  const collection = scope.workspace
    ? `/workspaces/${scope.workspace.kind}/${segment(scope.workspace.id)}/data-tables`
    : `/api/projects/${segment(scope.projectId)}/data-tables`;
  const url = `${collection}/${segment(tableId)}`;
  const options = { responseStyle: "data", throwOnError: true } as const;
  const json = { ...options, headers: { "Content-Type": "application/json" } };
  return {
    get: () => client.get<{ 200: DataTable }, unknown, true, "data">({ ...options, url }),
    update: (body: UpdateTableInput) => client.patch<{ 200: DataTable }, unknown, true, "data">({ ...json, url, body }),
    delete: () => client.delete<{ 200: { ok: boolean } }, unknown, true, "data">({ ...options, url }),
    rows: {
      list: (query?: ListRowsOptions) =>
        client.get<{ 200: DataTableRows }, unknown, true, "data">({ ...options, url: `${url}/rows`, query }),
      insert: (data: DataTableRow["data"]) =>
        client.post<{ 201: DataTableRow }, unknown, true, "data">({ ...json, url: `${url}/rows`, body: { data } }),
      update: (rowId: string, body: UpdateRowInput) =>
        client.patch<{ 200: DataTableRow }, unknown, true, "data">({
          ...json,
          url: `${url}/rows/${segment(rowId)}`,
          body,
        }),
      delete: (rowId: string) =>
        client.delete<{ 200: { ok: boolean } }, unknown, true, "data">({
          ...options,
          url: `${url}/rows/${segment(rowId)}`,
        }),
    },
    sql: (sql: string) =>
      client.post<{ 200: DataTableSqlResult }, unknown, true, "data">({
        ...json,
        url: scope.workspace ? `${url}/sql` : `${collection}/sql`,
        body: { sql },
      }),
  };
}

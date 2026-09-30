import type {
  GetApiProjectsByProjectIdDataTablesByTableIdResponse,
  GetApiProjectsByProjectIdDataTablesByTableIdRowsData,
  GetApiProjectsByProjectIdDataTablesByTableIdRowsResponse,
  PatchApiProjectsByProjectIdDataTablesByTableIdData,
  PatchApiProjectsByProjectIdDataTablesByTableIdRowsByRowIdData,
  PostApiProjectsByProjectIdDataTablesByTableIdRowsResponse,
} from "../gen/types.gen";

export type DataTableScope =
  | { workspace: { kind: "org" | "team" | "user"; id: string }; projectId?: never }
  | { projectId: string; workspace?: never };
export type DataTable = GetApiProjectsByProjectIdDataTablesByTableIdResponse;
export type DataTableRow = PostApiProjectsByProjectIdDataTablesByTableIdRowsResponse;
export type DataTableRows = GetApiProjectsByProjectIdDataTablesByTableIdRowsResponse;
export type ListRowsOptions = GetApiProjectsByProjectIdDataTablesByTableIdRowsData["query"];
export type UpdateTableInput = PatchApiProjectsByProjectIdDataTablesByTableIdData["body"];
export type UpdateRowInput = PatchApiProjectsByProjectIdDataTablesByTableIdRowsByRowIdData["body"];
export interface DataTableSqlResult {
  columns: string[];
  rows: unknown[][];
  rowCount: number;
  durationMs: number;
}

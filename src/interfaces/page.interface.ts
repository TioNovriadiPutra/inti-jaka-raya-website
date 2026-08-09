import { MetaType } from "./res.interface";

export interface TableActionType {
  label: string;
  onClick: () => void;
}

export interface TableDataType {
  row: string[];
  actions?: TableActionType[];
}

export interface TableType {
  data: TableDataType[];
  metaData: Omit<MetaType, "limit">;
}

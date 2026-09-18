import { MetaType } from "./res.interface";

export interface TableActionType {
  label: string;
  onClick: () => void;
  isLoading?: boolean;
}

export interface TableDataType {
  row: string[];
  actions?: TableActionType[];
}

export interface TableType {
  data: TableDataType[];
  metaData: Omit<MetaType, "limit">;
}

export interface CatalogCardType {
  image: string;
  tag: string;
  title: string;
  width: number;
  height: number;
}

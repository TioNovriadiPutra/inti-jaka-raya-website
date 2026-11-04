import { MetaType } from "./res.interface";

interface TableActionType {
  label: string;
  onClick: () => void;
  isLoading?: boolean;
}

interface TableDataType {
  row: string[];
  actions?: TableActionType[];
}

export interface TableType {
  data: TableDataType[];
  metaData: Omit<MetaType, "limit">;
}

export interface CatalogCardType {
  id: number;
  image: string;
  tag: string;
  title: string;
  width: number;
  height: number;
}

export interface CaseStudyCarouselCardType {
  id: number;
  subTitle: string;
  title: string;
  description: string;
  image: string;
  width: number;
  height: number;
}

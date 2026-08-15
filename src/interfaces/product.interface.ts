import { DropdownType } from "./form.interface";

export interface ProductSectionInput {
  title: string;
  description: string;
}

export interface ProductInput {
  code: string;
  itemName: string;
  division?: DropdownType;
  industry?: DropdownType;
  category?: DropdownType;
  application?: DropdownType;
  galleries: File[];
  documents: File[];
  descriptions: ProductSectionInput[];
}

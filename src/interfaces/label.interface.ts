import { DropdownType } from "./form.interface";

export interface LabelInput {
  labelName: string;
  labelType?: DropdownType;
}

export interface LabelDTO {
  id: number;
  created_at: string;
}

export interface CategoryDTO extends LabelDTO {
  category_name: string;
}

export interface IndustryDTO extends LabelDTO {
  industry_name: string;
}

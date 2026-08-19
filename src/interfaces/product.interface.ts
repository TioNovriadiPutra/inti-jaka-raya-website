import { DropdownType } from "./form.interface";

export interface ProductSectionInput {
  title: string;
  description: string;
  id?: number;
}

export interface ProductInput {
  code: string;
  itemName: string;
  division?: DropdownType;
  industry?: DropdownType;
  category?: DropdownType;
  application?: DropdownType;
  thumbnail?: File | string;
  galleries: (File | string)[];
  documents: (File | string)[];
  descriptions: ProductSectionInput[];
}

export interface ProductDTO {
  id: number;
  product_code: string;
  product_name: string;
  is_showing: boolean;
}

export interface ProductCategoryDTO {
  id: number;
  category_name: string;
}

export interface ProductIndustryDTO {
  id: number;
  industry_name: string;
}

export interface ProductApplicationDTO {
  id: number;
  application_name: string;
}

export interface ProductDivisionDTO {
  id: number;
  division_name: string;
}

export interface ProductGalleryDTO {
  id: number;
  image_url: string;
  ori_width: number;
  ori_height: number;
  is_thumbnail: boolean;
}

export interface ProductDocumentDTO {
  id: number;
  doc_url: string;
  doc_name: string;
}

export interface ProductDescriptionDTO {
  id: number;
  title: string;
  description: string;
}

export interface ProductDetailDTO {
  id: number;
  product_code: string;
  product_name: string;
  categories: ProductCategoryDTO;
  industries: ProductIndustryDTO;
  applications: ProductApplicationDTO;
  divisions: ProductDivisionDTO;
  galleries: ProductGalleryDTO[];
  documents: ProductDocumentDTO[];
  descriptions: ProductDescriptionDTO[];
}

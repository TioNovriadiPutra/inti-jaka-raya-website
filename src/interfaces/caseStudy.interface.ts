import { DropdownType } from "./form.interface";
import {
  ProductApplicationDTO,
  ProductCategoryDTO,
  ProductDescriptionDTO,
  ProductDivisionDTO,
  ProductDocumentDTO,
  ProductGalleryDTO,
  ProductIndustryDTO,
  ProductSectionInput,
} from "./product.interface";

export interface CaseStudyInput {
  title: string;
  product?: DropdownType;
  division?: DropdownType;
  industry?: DropdownType;
  category?: DropdownType;
  application?: DropdownType;
  problem: string;
  thumbnail?: File | string;
  galleries: (File | string)[];
  documents: (File | string)[];
  descriptions: ProductSectionInput[];
}

interface CaseStudyIndustryDTO {
  id: number;
  industry_name: string;
}

export interface CaseStudyDTO {
  id: number;
  title: string;
  industry: CaseStudyIndustryDTO;
  is_showing: boolean;
}

interface CaseStudyProductDTO {
  id: number;
  product_name: string;
}

export interface CaseStudyCarouselDTO {
  id: number;
  title: string;
  problem: string;
  category: ProductCategoryDTO | null;
  thumbnail: Pick<
    ProductGalleryDTO,
    "image_url" | "ori_width" | "ori_height"
  >[];
}

export interface CaseStudyDetailDTO {
  id: number;
  title: string;
  problem: string;
  product: CaseStudyProductDTO;
  category: ProductCategoryDTO;
  industry: ProductIndustryDTO;
  application: ProductApplicationDTO;
  division: ProductDivisionDTO;
  galleries: ProductGalleryDTO[];
  documents: ProductDocumentDTO[];
  descriptions: ProductDescriptionDTO[];
}

export interface CaseStudyPublicDetailDTO {
  id: number;
  title: string;
  problem: string;
  product: { id: number; product_code: string; product_name: string; is_showing: boolean } | null;
  category: ProductCategoryDTO | null;
  industry: ProductIndustryDTO | null;
  application: ProductApplicationDTO | null;
  division: ProductDivisionDTO | null;
  galleries: ProductGalleryDTO[];
  documents: ProductDocumentDTO[];
  descriptions: ProductDescriptionDTO[];
}

export interface CaseStudyDetailPageType {
  id: number;
  title: string;
  problem: string;
  product: CaseStudyPublicDetailDTO["product"];
  labels: { name: string; value: string }[];
  thumbnail?: ProductGalleryDTO;
  galleries: ProductGalleryDTO[];
  documents: ProductDocumentDTO[];
  descriptions: ProductDescriptionDTO[];
}

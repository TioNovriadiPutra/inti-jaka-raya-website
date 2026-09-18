export interface CatalogThumbnailDTO {
  image_url: string;
  ori_width: number;
  ori_height: number;
}

export interface CatalogDTO {
  id: number;
  title: string;
  product_code?: string;
  thumbnail: CatalogThumbnailDTO[];
}

import { SupabaseClient } from "@supabase/supabase-js";
import sharp from "sharp";
import fs from "fs/promises";
import type { File as FormidableFile } from "formidable";

export const getImageDimensions = async (file: FormidableFile) => {
  const buffer = await fs.readFile(file.filepath);

  const metadata = await sharp(buffer).metadata();

  return {
    width: metadata.width ?? 0,
    height: metadata.height ?? 0,
  };
};

export const getFilePath = (url: string) => {
  const splitUrl = url.split("/");
  const splitUrlLength = splitUrl.length;
  const filePath = `${splitUrl[splitUrlLength - 2]}/${splitUrl[splitUrlLength - 1]}`;

  return filePath;
};

export const uploadImage = async (
  file: FormidableFile,
  supabase: SupabaseClient<any, "public", "public", any, any>,
) => {
  const { width, height } = await getImageDimensions(file);

  const buffer = await fs.readFile(file.filepath);

  const extension = file.originalFilename?.split(".").pop() ?? "jpg";

  const fileName = `${crypto.randomUUID()}.${extension}`;

  const filePath = `galleries/${fileName}`;

  const { data, error } = await supabase.storage
    .from("products")
    .upload(filePath, buffer, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.mimetype ?? "image/jpeg",
    });

  if (error) {
    throw error;
  }

  const { data: urlData } = supabase.storage
    .from("products")
    .getPublicUrl(data.path);

  return {
    image_url: urlData.publicUrl,
    ori_width: width,
    ori_height: height,
  };
};

export const uploadFile = async (
  file: FormidableFile,
  supabase: SupabaseClient<any, "public", "public", any, any>,
) => {
  const buffer = await fs.readFile(file.filepath);

  const extension = file.originalFilename?.split(".").pop() ?? "pdf";

  const fileName = `${crypto.randomUUID()}.${extension}`;

  const filePath = `documents/${fileName}`;

  const { data, error } = await supabase.storage
    .from("products")
    .upload(filePath, buffer, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.mimetype ?? "application/pdf",
    });

  if (error) {
    throw error;
  }

  const { data: urlData } = supabase.storage
    .from("products")
    .getPublicUrl(data.path);

  return {
    doc_url: urlData.publicUrl,
    doc_name: fileName,
  };
};

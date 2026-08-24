import { uploadFile, uploadImage } from "@/utils/helperServer";
import { createSupabaseClient } from "@/utils/supabase";
import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import type { File as FormidableFile } from "formidable";
import { ProductSectionInput } from "@/interfaces/product.interface";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
      data: {},
    });
  }

  try {
    const form = formidable({
      multiples: true,
    });

    const [fields, files] = await form.parse(req);

    const code = fields.code?.[0] ?? "";
    const itemName = fields.itemName?.[0] ?? "";
    const division = Number(fields.division?.[0] ?? 0);
    const industry = Number(fields.industry?.[0] ?? 0);
    const category = Number(fields.category?.[0] ?? 0);
    const application = Number(fields.application?.[0] ?? 0);

    const thumbnail = files.thumbnail![0] as FormidableFile;
    const galleries = (files.galleries ?? []) as FormidableFile[];
    const documents = (files.documents ?? []) as FormidableFile[];
    const descriptions = JSON.parse(fields.descriptions?.[0] ?? "[]");

    const supabase = createSupabaseClient(req, res);

    // Add Case Study
    const { data, error } = await supabase
      .from("products")
      .insert({
        product_code: code,
        product_name: itemName,
        category_id: category,
        industry_id: industry,
        application_id: application,
        division_id: division,
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
        data: {},
      });
    }

    // Add Thumbnail
    try {
      const image = await uploadImage(thumbnail, supabase, "products");

      const { error: productGalleryError } = await supabase
        .from("product_galleries")
        .insert({
          ...image,
          is_thumbnail: true,
          product_id: data.id,
        });

      if (error) {
        throw productGalleryError;
      }
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
        data: {},
      });
    }

    // Add Gallery
    try {
      const images = await Promise.all(
        galleries.map(async (gallery: FormidableFile) => {
          const image = await uploadImage(gallery, supabase, "products");

          return {
            ...image,
            is_thumbnail: false,
            product_id: data.id,
          };
        }),
      );

      const { error } = await supabase
        .from("product_galleries")
        .insert(images)
        .select();

      if (error) {
        throw error;
      }
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
        data: {},
      });
    }

    // Add Document
    try {
      const docs = await Promise.all(
        documents.map(async (document: FormidableFile) => {
          const doc = await uploadFile(document, supabase, "products");

          return {
            ...doc,
            product_id: data.id,
          };
        }),
      );

      const { error } = await supabase
        .from("product_documents")
        .insert(docs)
        .select();

      if (error) {
        throw error;
      }
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
        data: {},
      });
    }

    // Add Description
    descriptions.forEach(async (desc: ProductSectionInput) => {
      const { error } = await supabase.from("product_descriptions").insert({
        title: desc.title,
        description: desc.description,
        product_id: data.id,
      });

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
          data: {},
        });
      }
    });

    return res.status(201).json({
      success: true,
      message: "Product created!",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      data: JSON.stringify(error),
    });
  }
}

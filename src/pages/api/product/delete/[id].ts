import {
  ProductDocumentDTO,
  ProductGalleryDTO,
} from "@/interfaces/product.interface";
import { getFilePath } from "@/utils/helperServer";
import { createSupabaseClient } from "@/utils/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
      data: {},
    });
  }

  const { id } = req.query;

  const supabase = createSupabaseClient(req, res);

  const { data, error } = await supabase
    .from("products")
    .select(
      `*,
      galleries:product_galleries(*),
      documents:product_documents(*)`,
    )
    .eq("id", id)
    .single();

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
      data: {},
    });
  }

  try {
    const deletedPaths = data.galleries.map((gallery: ProductGalleryDTO) =>
      getFilePath(gallery.image_url),
    );

    const { error: removeGalleryError } = await supabase.storage
      .from("products")
      .remove(deletedPaths);

    if (removeGalleryError) {
      throw removeGalleryError;
    }
  } catch (e: any) {
    return res.status(400).json({
      success: false,
      message: e.message,
      data: {},
    });
  }

  try {
    const deletedPaths = data.documents.map((document: ProductDocumentDTO) =>
      getFilePath(document.doc_url),
    );

    const { error: removeDocumentError } = await supabase.storage
      .from("products")
      .remove(deletedPaths);

    if (removeDocumentError) {
      throw removeDocumentError;
    }
  } catch (e: any) {
    return res.status(400).json({
      success: false,
      message: e.message,
      data: {},
    });
  }

  const { data: deleteData, error: deleteError } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (deleteError) {
    return res.status(400).json({
      success: false,
      message: deleteError.message,
      data: {},
    });
  }

  return res.status(200).json({
    success: true,
    message: "Product deleted!",
    data: deleteData,
  });
}

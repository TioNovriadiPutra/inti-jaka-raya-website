import {
  ProductDocumentDTO,
  ProductGalleryDTO,
} from "@/interfaces/product.interface";
import {
  errorHandler,
  getFilePath,
  initiateLogger,
  methodNotAllowedError,
} from "@/utils/helperServer";
import { createSupabaseClient } from "@/utils/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const log = initiateLogger(req);

  if (req.method !== "DELETE") {
    return methodNotAllowedError(res, log.log);
  }

  const { id } = req.query;

  const supabase = createSupabaseClient(req, res);

  const { data, error } = await supabase
    .from("case_studies")
    .select(
      `*,
      galleries:case_study_galleries(*),
      documents:case_study_documents(*)`,
    )
    .eq("id", id)
    .single();

  if (error) {
    return errorHandler(res, log.log, error, error.code);
  }

  try {
    const deletedPaths = data.galleries.map((gallery: ProductGalleryDTO) =>
      getFilePath(gallery.image_url),
    );

    const { error: removeGalleryError } = await supabase.storage
      .from("case-studies")
      .remove(deletedPaths);

    if (removeGalleryError) {
      throw removeGalleryError;
    }
  } catch (e: any) {
    return errorHandler(res, log.log, e, e.code ?? undefined);
  }

  try {
    const deletedPaths = data.documents.map((document: ProductDocumentDTO) =>
      getFilePath(document.doc_url),
    );

    const { error: removeDocumentError } = await supabase.storage
      .from("case-studies")
      .remove(deletedPaths);

    if (removeDocumentError) {
      throw removeDocumentError;
    }
  } catch (e: any) {
    return errorHandler(res, log.log, e, e.code ?? undefined);
  }

  const { data: deleteData, error: deleteError } = await supabase
    .from("case_studies")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (deleteError) {
    return errorHandler(res, log.log, deleteError, deleteError.code);
  }

  return res.status(200).json({
    success: true,
    message: "Case study deleted!",
    data: deleteData,
  });
}

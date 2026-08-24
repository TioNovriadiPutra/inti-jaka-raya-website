import {
  errorHandler,
  getFilePath,
  initiateLogger,
  methodNotAllowedError,
  uploadImage,
} from "@/utils/helperServer";
import { createSupabaseClient } from "@/utils/supabase";
import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
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
  const log = initiateLogger(req);

  if (req.method !== "PUT") {
    return methodNotAllowedError(res, log.log);
  }

  try {
    const form = formidable({
      multiples: true,
    });

    const [fields, files] = await form.parse(req);

    const title = fields.title?.[0] ?? "";
    const product = Number(fields.product?.[0] ?? 0);
    const category = Number(fields.category?.[0] ?? 0);
    const industry = Number(fields.industry?.[0] ?? 0);
    const application = Number(fields.application?.[0] ?? 0);
    const division = Number(fields.division?.[0] ?? 0);
    const problem = fields.problem?.[0] ?? "";

    const newThumbnail = files.thumbnail?.[0] ?? undefined;

    const newGalleries = (files.galleries ?? []) as FormidableFile[];
    const existingGalleryIds = (fields.galleries ?? []).map(
      (item) => item.split("|")[0],
    );

    const newDocuments = (files.documents ?? []) as FormidableFile[];
    const existingDocumentIds = (fields.documents ?? []).map(
      (item) => item.split("|")[0],
    );

    const descriptions = JSON.parse(fields.descriptions?.[0] ?? "[]");
    const newDescription = descriptions.filter(
      (desc: ProductSectionInput) => !desc.id,
    );
    const oldDescription = descriptions.filter(
      (desc: ProductSectionInput) => desc.id,
    );

    const { id } = req.query;

    const supabase = createSupabaseClient(req, res);

    // Case Study Update
    const { data: caseStudyData, error: caseStudyError } = await supabase
      .from("case_studies")
      .update({
        title,
        problem,
        product_id: product,
        category_id: category,
        industry_id: industry,
        application_id: application,
        division_id: division,
      })
      .eq("id", id)
      .select()
      .single();

    if (caseStudyError) {
      return errorHandler(res, log.log, caseStudyError, caseStudyError.code);
    }

    // Case Study Gallery Get
    const { data: oldCSGalleryData, error: oldCSGalleryError } = await supabase
      .from("case_study_galleries")
      .select()
      .eq("case_study_id", id);

    if (oldCSGalleryError) {
      return errorHandler(
        res,
        log.log,
        oldCSGalleryError,
        oldCSGalleryError.code,
      );
    }

    // Case Study Thumbnail Update
    if (newThumbnail) {
      const thumbnailData = oldCSGalleryData.find((item) => item.is_thumbnail);

      const thumbnailPath = getFilePath(thumbnailData.image_url);

      const { error: thumbnailStorageError } = await supabase.storage
        .from("case-studies")
        .remove([thumbnailPath]);

      if (thumbnailStorageError) {
        return errorHandler(res, log.log, thumbnailStorageError);
      }

      const { error: deletedThumbnailError } = await supabase
        .from("case_study_galleries")
        .delete()
        .eq("id", thumbnailData.id);

      if (deletedThumbnailError) {
        return errorHandler(
          res,
          log.log,
          deletedThumbnailError,
          deletedThumbnailError.code,
        );
      }

      try {
        const image = await uploadImage(newThumbnail, supabase, "case-studies");

        const { error: createThumbnailError } = await supabase
          .from("case_study_galleries")
          .insert({
            ...image,
            is_thumbnail: true,
            case_study_id: id,
          });

        if (createThumbnailError) {
          throw createThumbnailError;
        }
      } catch (error: any) {
        return errorHandler(res, log.log, error, error.code ?? undefined);
      }
    }
  } catch (error) {}
}

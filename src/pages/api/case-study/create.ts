import { ProductSectionInput } from "@/interfaces/product.interface";
import {
  errorHandler,
  initiateLogger,
  methodNotAllowedError,
  uploadFile,
  uploadImage,
} from "@/utils/helperServer";
import { createSupabaseClient } from "@/utils/supabase";
import formidable from "formidable";
import type { File as FormidableFile } from "formidable";
import { NextApiRequest, NextApiResponse } from "next";

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

  if (req.method !== "POST") {
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

    const thumbnail = files.thumbnail![0] as FormidableFile;
    const galleries = (files.galleries ?? []) as FormidableFile[];
    const documents = (files.documents ?? []) as FormidableFile[];
    const descriptions = JSON.parse(fields.descriptions?.[0] ?? "[]");

    const supabase = createSupabaseClient(req, res);
    const { data, error } = await supabase
      .from("case_studies")
      .insert({
        title,
        problem,
        product_id: product,
        category_id: category,
        industry_id: industry,
        application_id: application,
        division_id: division,
      })
      .select()
      .single();

    if (error) {
      return errorHandler(res, log.log, error, error.code);
    }
    try {
      const image = await uploadImage(thumbnail, supabase, "case-studies");

      const { error: caseStudyThumbnailError } = await supabase
        .from("case_study_galleries")
        .insert({
          ...image,
          is_thumbnail: true,
          case_study_id: data.id,
        });

      if (caseStudyThumbnailError) {
        throw caseStudyThumbnailError;
      }
    } catch (error: any) {
      return errorHandler(res, log.log, error, error.code ?? undefined);
    }
    try {
      const images = await Promise.all(
        galleries.map(async (gallery: FormidableFile) => {
          const image = await uploadImage(gallery, supabase, "case-studies");

          return {
            ...image,
            is_thumbnail: false,
            case_study_id: data.id,
          };
        }),
      );

      const { error: caseStudyGalleryError } = await supabase
        .from("case_study_galleries")
        .insert(images)
        .select();

      if (caseStudyGalleryError) {
        throw caseStudyGalleryError;
      }
    } catch (error: any) {
      return errorHandler(res, log.log, error, error.code ?? undefined);
    }
    try {
      const docs = await Promise.all(
        documents.map(async (document: FormidableFile) => {
          const doc = await uploadFile(document, supabase, "case-studies");

          return {
            ...doc,
            case_study_id: data.id,
          };
        }),
      );

      const { error: caseStudyDocumentError } = await supabase
        .from("case_study_documents")
        .insert(docs)
        .select();

      if (caseStudyDocumentError) {
        throw caseStudyDocumentError;
      }
    } catch (error: any) {
      return errorHandler(res, log.log, error, error.code ?? undefined);
    }
    descriptions.forEach(async (desc: ProductSectionInput) => {
      const { error: caseStudyDescriptionError } = await supabase
        .from("case_study_descriptions")
        .insert({
          title: desc.title,
          description: desc.description,
          case_study_id: data.id,
        });

      if (caseStudyDescriptionError) {
        return errorHandler(
          res,
          log.log,
          caseStudyDescriptionError,
          caseStudyDescriptionError.code,
        );
      }
    });

    return res.status(201).json({
      success: true,
      message: "Case study created!",
      data,
    });
  } catch (error) {
    return errorHandler(res, log.log, error);
  }
}

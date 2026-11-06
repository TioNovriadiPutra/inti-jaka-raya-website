import {
  errorHandler,
  getFilePath,
  initiateLogger,
  methodNotAllowedError,
  uploadFile,
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

    const deletedGalleries = oldCSGalleryData.filter(
      (gallery) =>
        !existingGalleryIds.includes(String(gallery.id)) &&
        !gallery.is_thumbnail,
    );
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
    if (deletedGalleries.length > 0) {
      const deletedPaths = deletedGalleries.map((gallery) =>
        getFilePath(gallery.image_url),
      );

      const { error: galleryStorageError } = await supabase.storage
        .from("case-studies")
        .remove(deletedPaths);

      if (galleryStorageError) {
        return errorHandler(res, log.log, galleryStorageError);
      }

      const { error: deletedGalleriesError } = await supabase
        .from("case_study_galleries")
        .delete()
        .in(
          "id",
          deletedGalleries.map((item) => item.id),
        );

      if (deletedGalleriesError) {
        return errorHandler(
          res,
          log.log,
          deletedGalleriesError,
          deletedGalleriesError.code,
        );
      }
    }
    try {
      const images = await Promise.all(
        newGalleries.map(async (gallery: FormidableFile) => {
          const image = await uploadImage(gallery, supabase, "case-studies");

          return {
            ...image,
            is_thumbnail: false,
            case_study_id: id,
          };
        }),
      );

      const { error } = await supabase
        .from("case_study_galleries")
        .insert(images)
        .select();

      if (error) {
        throw error;
      }
    } catch (error: any) {
      return errorHandler(res, log.log, error, error.code ?? undefined);
    }
    const { data: oldCSDocumentData, error: oldCSDocumentError } =
      await supabase
        .from("case_study_documents")
        .select()
        .eq("case_study_id", id);

    if (oldCSDocumentError) {
      return errorHandler(
        res,
        log.log,
        oldCSDocumentError,
        oldCSDocumentError.code,
      );
    }

    const deletedDocuments = oldCSDocumentData.filter(
      (document) => !existingDocumentIds.includes(String(document.id)),
    );
    if (deletedDocuments.length > 0) {
      const deletedPaths = deletedDocuments.map((document) =>
        getFilePath(document.doc_url),
      );

      const { error: documentStorageError } = await supabase.storage
        .from("case-studies")
        .remove(deletedPaths);

      if (documentStorageError) {
        return errorHandler(res, log.log, documentStorageError);
      }

      const { error: deletedDocumentsError } = await supabase
        .from("case_study_documents")
        .delete()
        .in(
          "id",
          deletedDocuments.map((item) => item.id),
        );

      if (deletedDocumentsError) {
        return errorHandler(
          res,
          log.log,
          deletedDocumentsError,
          deletedDocumentsError.code,
        );
      }
    }
    try {
      const documents = await Promise.all(
        newDocuments.map(async (document: FormidableFile) => {
          const doc = await uploadFile(document, supabase, "case-studies");

          return {
            ...doc,
            case_study_id: id,
          };
        }),
      );

      const { error } = await supabase
        .from("case_study_documents")
        .insert(documents)
        .select();

      if (error) {
        throw error;
      }
    } catch (error: any) {
      return errorHandler(res, log.log, error, error.code ?? undefined);
    }
    const { data: oldCSDescriptionData, error: oldCSDescriptionError } =
      await supabase
        .from("case_study_descriptions")
        .select()
        .eq("case_study_id", id);

    if (oldCSDescriptionError) {
      return errorHandler(
        res,
        log.log,
        oldCSDescriptionError,
        oldCSDescriptionError.code,
      );
    }

    const deletedDescriptions = oldCSDescriptionData.filter(
      (desc) =>
        !oldDescription
          .map((desc2: ProductSectionInput) => desc2.id)
          .includes(desc.id),
    );
    if (deletedDescriptions.length > 0) {
      const deletedIds = deletedDescriptions.map((del) => del.id);

      const { error: deletedDescError } = await supabase
        .from("case_study_descriptions")
        .delete()
        .in("id", deletedIds);

      if (deletedDescError) {
        return errorHandler(
          res,
          log.log,
          deletedDescError,
          deletedDescError.code,
        );
      }
    }
    oldDescription.forEach(async (item: ProductSectionInput) => {
      const { error } = await supabase
        .from("case_study_descriptions")
        .update({
          title: item.title,
          description: item.description,
        })
        .eq("id", item.id!);

      if (error) {
        return errorHandler(res, log.log, error, error.code);
      }
    });
    newDescription.forEach(async (item: ProductSectionInput) => {
      const { error } = await supabase.from("case_study_descriptions").insert({
        title: item.title,
        description: item.description,
        case_study_id: id,
      });

      if (error) {
        return errorHandler(res, log.log, error, error.code);
      }
    });

    return res.status(200).json({
      success: true,
      message: "Case study updated!",
      data: caseStudyData,
    });
  } catch (error: any) {
    return errorHandler(res, log.log, error, error.code ?? undefined);
  }
}

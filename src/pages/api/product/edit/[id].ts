import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import type { File as FormidableFile } from "formidable";
import { createSupabaseClient } from "@/utils/supabase";
import {
  getFilePath,
  initiateLogger,
  methodNotAllowedError,
  uploadFile,
  uploadImage,
} from "@/utils/helperServer";
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

    const code = fields.code?.[0] ?? "";
    const itemName = fields.itemName?.[0] ?? "";
    const division = Number(fields.division?.[0] ?? 0);
    const industry = Number(fields.industry?.[0] ?? 0);
    const category = Number(fields.category?.[0] ?? 0);
    const application = Number(fields.application?.[0] ?? 0);

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

    // Product Update
    const { data: productData, error: updateProductError } = await supabase
      .from("products")
      .update({
        product_code: code,
        product_name: itemName,
        category_id: category,
        industry_id: industry,
        application_id: application,
        division_id: division,
      })
      .eq("id", id)
      .select()
      .single();

    if (updateProductError) {
      return res.status(400).json({
        success: false,
        message: updateProductError.message,
        data: {},
      });
    }

    // Gallery Get
    const { data: oldGalleries, error: oldGalleriesError } = await supabase
      .from("product_galleries")
      .select()
      .eq("product_id", id);

    if (oldGalleriesError) {
      return res.status(400).json({
        success: false,
        message: oldGalleriesError.message,
        data: {},
      });
    }

    // Thumbnail Update
    if (newThumbnail) {
      const thumbnailData = oldGalleries.find((item) => item.is_thumbnail);

      const thumbnailPath = getFilePath(thumbnailData.image_url);

      const { error: thumbnailStorageError } = await supabase.storage
        .from("products")
        .remove([thumbnailPath]);

      if (thumbnailStorageError) {
        return res.status(400).json({
          success: false,
          message: thumbnailStorageError.message,
          data: {},
        });
      }

      const { error: deletedThumbnailError } = await supabase
        .from("product_galleries")
        .delete()
        .eq("id", thumbnailData.id);

      if (deletedThumbnailError) {
        return res.status(400).json({
          success: false,
          message: deletedThumbnailError.message,
          data: {},
        });
      }

      try {
        const image = await uploadImage(newThumbnail, supabase, "products");

        const { error: thumbnailError } = await supabase
          .from("product_galleries")
          .insert({
            ...image,
            is_thumbnail: true,
            product_id: id,
          });

        if (thumbnailError) {
          throw thumbnailError;
        }
      } catch (error: any) {
        return res.status(400).json({
          success: false,
          message: error.message,
          data: {},
        });
      }
    }

    // Gallery Update
    const deletedGalleries = oldGalleries?.filter(
      (gallery) =>
        !existingGalleryIds.includes(String(gallery.id)) &&
        !gallery.is_thumbnail,
    );

    if (deletedGalleries.length > 0) {
      const deletedPaths = deletedGalleries.map((gallery) =>
        getFilePath(gallery.image_url),
      );

      const { error: storageError } = await supabase.storage
        .from("products")
        .remove(deletedPaths);

      if (storageError) {
        return res.status(400).json({
          success: false,
          message: storageError.message,
          data: {},
        });
      }

      const { error: deletedGalleriesError } = await supabase
        .from("product_galleries")
        .delete()
        .in(
          "id",
          deletedGalleries.map((item) => item.id),
        );

      if (deletedGalleriesError) {
        return res.status(400).json({
          success: false,
          message: deletedGalleriesError.message,
          data: {},
        });
      }
    }

    // Gallery Insert
    try {
      const images = await Promise.all(
        newGalleries.map(async (gallery: FormidableFile) => {
          const image = await uploadImage(gallery, supabase, "products");

          return {
            ...image,
            is_thumbnail: false,
            product_id: id,
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

    // Document Get
    const { data: oldDocuments, error: oldDocumentsError } = await supabase
      .from("product_documents")
      .select()
      .eq("product_id", id);

    if (oldDocumentsError) {
      return res.status(400).json({
        success: false,
        message: oldDocumentsError.message,
        data: {},
      });
    }

    // Document Update
    const deletedDocuments = oldDocuments?.filter(
      (document) => !existingDocumentIds.includes(String(document.id)),
    );

    if (deletedDocuments.length > 0) {
      const deletedPaths = deletedDocuments.map((document) =>
        getFilePath(document.doc_url),
      );

      const { error: storageError } = await supabase.storage
        .from("products")
        .remove(deletedPaths);

      if (storageError) {
        return res.status(400).json({
          success: false,
          message: storageError.message,
          data: {},
        });
      }

      const { error: deletedDocumentsError } = await supabase
        .from("product_documents")
        .delete()
        .in(
          "id",
          deletedDocuments.map((item) => item.id),
        );

      if (deletedDocumentsError) {
        return res.status(400).json({
          success: false,
          message: deletedDocumentsError.message,
          data: {},
        });
      }
    }

    // Document Insert
    try {
      const documents = await Promise.all(
        newDocuments.map(async (document: FormidableFile) => {
          const doc = await uploadFile(document, supabase, "products");

          return {
            ...doc,
            product_id: id,
          };
        }),
      );

      const { error } = await supabase
        .from("product_documents")
        .insert(documents)
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

    // Description Get
    const { data: descriptionData, error: descriptionError } = await supabase
      .from("product_descriptions")
      .select()
      .eq("product_id", id);

    if (descriptionError) {
      return res.status(400).json({
        success: false,
        message: descriptionError.message,
        data: {},
      });
    }

    const deletedDescriptions = descriptionData.filter(
      (desc) =>
        !oldDescription
          .map((desc2: ProductSectionInput) => desc2.id)
          .includes(desc.id),
    );

    if (deletedDescriptions.length > 0) {
      const deletedIds = deletedDescriptions.map((del) => del.id);

      const { error: deletedDescError } = await supabase
        .from("product_descriptions")
        .delete()
        .in("id", deletedIds);

      if (deletedDescError) {
        return res.status(400).json({
          success: false,
          message: deletedDescError.message,
          data: {},
        });
      }
    }

    oldDescription.forEach(async (item: ProductSectionInput) => {
      const { error } = await supabase
        .from("product_descriptions")
        .update({
          title: item.title,
          description: item.description,
        })
        .eq("id", item.id!);

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
          data: {},
        });
      }
    });

    newDescription.forEach(async (item: ProductSectionInput) => {
      const { error } = await supabase.from("product_descriptions").insert({
        title: item.title,
        description: item.description,
        product_id: id,
      });

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
          data: {},
        });
      }
    });

    return res.status(200).json({
      success: true,
      message: "Product updated!",
      data: productData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      data: JSON.stringify(error),
    });
  }
}

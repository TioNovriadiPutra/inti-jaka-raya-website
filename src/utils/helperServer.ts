import { NextApiRequest, NextApiResponse } from "next";
import { SupabaseClient } from "@supabase/supabase-js";
import sharp from "sharp";
import fs from "fs/promises";
import type { File as FormidableFile } from "formidable";
import { randomUUID } from "crypto";
import logger from "./logger";
import pino from "pino";

const getImageDimensions = async (file: FormidableFile) => {
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
  storage: string,
) => {
  const { width, height } = await getImageDimensions(file);

  const buffer = await fs.readFile(file.filepath);

  const extension = file.originalFilename?.split(".").pop() ?? "jpg";

  const fileName = `${crypto.randomUUID()}.${extension}`;

  const filePath = `galleries/${fileName}`;

  const { data, error } = await supabase.storage
    .from(storage)
    .upload(filePath, buffer, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.mimetype ?? "image/jpeg",
    });

  if (error) {
    throw error;
  }

  const { data: urlData } = supabase.storage
    .from(storage)
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
  storage: string,
) => {
  const buffer = await fs.readFile(file.filepath);

  const extension = file.originalFilename?.split(".").pop() ?? "pdf";

  const fileName = `${crypto.randomUUID()}.${extension}`;

  const filePath = `documents/${fileName}`;

  const { data, error } = await supabase.storage
    .from(storage)
    .upload(filePath, buffer, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.mimetype ?? "application/pdf",
    });

  if (error) {
    throw error;
  }

  const { data: urlData } = supabase.storage
    .from(storage)
    .getPublicUrl(data.path);

  return {
    doc_url: urlData.publicUrl,
    doc_name: fileName,
  };
};

export const initiateLogger = (req: NextApiRequest) => {
  const requestId = randomUUID();

  const log = logger.child({
    requestId,
    method: req.method,
    path: req.url,
  });

  log.info("Request started");

  return {
    log,
  };
};

export const methodNotAllowedError = (
  res: NextApiResponse,
  log: pino.Logger<never, boolean>,
) => {
  const json = {
    success: false,
    message: "Method not allowed",
    data: {},
  };

  log.warn({
    status: 405,
    message: "Method not allowed",
    data: json,
  });

  return res.status(405).json(json);
};

export const errorHandler = (
  res: NextApiResponse,
  log: pino.Logger<never, boolean>,
  error: any,
  code?: string,
) => {
  const json = {
    success: false,
    data: error,
  };

  if (code === "42501") {
    const finalJson = {
      ...json,
      message: "You don't have access!",
    };

    log.warn({
      status: 403,
      message: error.message,
      response: finalJson,
    });

    return res.status(403).json(finalJson);
  }

  const finalJson = {
    ...json,
    message: "Something went wrong!",
    data: {},
  };

  log.warn({
    status: 500,
    message: JSON.stringify(error),
    response: finalJson,
  });

  return res.status(500).json(finalJson);
};

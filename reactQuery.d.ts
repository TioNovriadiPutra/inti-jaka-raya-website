import { ResType } from "@/interfaces/res.interface";
import "@tanstack/react-query";

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: ResType;
  }
}

import {
  AuthState,
  LoadingState,
  ModalState,
  ToastState,
} from "@/interfaces/state.interface";
import { create } from "zustand";

export const useLoading = create<LoadingState>((set) => ({
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));

export const useAuth = create<AuthState>((set) => ({
  isLoggedIn: false,
  setLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),
}));

export const useToast = create<ToastState>((set) => ({
  isShowing: false,
  type: "error",
  message: "",
  showToast: (type, message) => set({ isShowing: true, type, message }),
  hideToast: () => set({ isShowing: false, type: "error", message: "" }),
}));

export const useLoginModal = create<ModalState>((set) => ({
  showModal: false,
  setShowModal: (show) => set({ showModal: show }),
}));

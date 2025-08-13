"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface CreatePostContextType {
  isFormValid: boolean;
  setIsFormValid: (valid: boolean) => void;
  isSubmitting: boolean;
  setIsSubmitting: (submitting: boolean) => void;
  submitForm: () => void;
  setSubmitForm: (submitFn: () => void) => void;
}

const CreatePostContext = createContext<CreatePostContextType | undefined>(undefined);

export function CreatePostProvider({ children }: { children: ReactNode }) {
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitForm, setSubmitForm] = useState<() => void>(() => {});

  return (
    <CreatePostContext.Provider
      value={{
        isFormValid,
        setIsFormValid,
        isSubmitting,
        setIsSubmitting,
        submitForm,
        setSubmitForm,
      }}
    >
      {children}
    </CreatePostContext.Provider>
  );
}

export function useCreatePost() {
  const context = useContext(CreatePostContext);
  if (context === undefined) {
    throw new Error("useCreatePost must be used within a CreatePostProvider");
  }
  return context;
}

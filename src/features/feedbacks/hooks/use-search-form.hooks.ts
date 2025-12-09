import { useForm } from "react-hook-form";

interface SearchFormData {
  search: string;
}

export const useSearchForm = (initialValue: string = "") => {
  const { control, watch, setValue, handleSubmit } = useForm<SearchFormData>({
    defaultValues: {
      search: initialValue,
    },
  });

  const searchValue = watch("search");

  const onSubmit = (callback: (search: string) => void) => {
    return handleSubmit((data) => {
      callback(data.search);
    });
  };

  const clearSearch = () => {
    setValue("search", "");
  };

  return {
    control,
    searchValue,
    onSubmit,
    clearSearch,
    setValue,
  };
};

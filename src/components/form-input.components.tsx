import { Controller } from "react-hook-form";
import type { Control, RegisterOptions } from "react-hook-form";
import TextField from "@mui/material/TextField";
import type { TextFieldProps } from "@mui/material/TextField";

type FormInputProps = TextFieldProps & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  rule?: RegisterOptions;
};

function FormInput({ control, name, rule, ...inputProps }: FormInputProps) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rule}
      defaultValue=""
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          {...inputProps}
          variant="outlined"
          fullWidth
          error={!!fieldState.error}
          helperText={fieldState.error?.message || ""}
        />
      )}
    />
  );
}

export default FormInput;

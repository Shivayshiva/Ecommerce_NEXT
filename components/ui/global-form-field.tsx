import * as React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import ImageUploadImageKit from "@/components/publicGroupedComponents/imagekitUpload";
import { cn } from "@/lib/utils";

interface BaseFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

interface InputFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFieldProps<TFieldValues, TName> {
  type: "input";
  inputType?: string;
  step?: string | number;
  min?: string | number;
  max?: string | number;
  onChange?: (value: string) => void;
}

interface SelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFieldProps<TFieldValues, TName> {
  type: "select";
  options: Array<{ value: string; label: string }>;
}

interface SwitchFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFieldProps<TFieldValues, TName> {
  type: "switch";
  switchLabel?: string;
}

interface TextareaFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFieldProps<TFieldValues, TName> {
  type: "textarea";
  rows?: number;
}

interface ImageFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFieldProps<TFieldValues, TName> {
  type: "image" | "video";
  accept?: string;
}

type GlobalFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = (
  | InputFieldProps<TFieldValues, TName>
  | SelectFieldProps<TFieldValues, TName>
  | SwitchFieldProps<TFieldValues, TName>
  | TextareaFieldProps<TFieldValues, TName>
  | ImageFieldProps<TFieldValues, TName>
) & {
  control: Control<TFieldValues>;
};

export function GlobalFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: GlobalFormFieldProps<TFieldValues, TName>) {
  const {
    name,
    label,
    description,
    required = false,
    className,
    control,
    type,
    ...fieldProps
  } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(type === "switch" ? "flex flex-row items-center justify-between rounded-lg border p-4" : "", className)}>
          {type === "switch" ? (
            <>
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  {(fieldProps as SwitchFieldProps).switchLabel || label} {required && "*"}
                </FormLabel>
                {description && (
                  <div className="text-sm text-muted-foreground">
                    {description}
                  </div>
                )}
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={(fieldProps as SwitchFieldProps).disabled}
                />
              </FormControl>
            </>
          ) : (
            <>
              <FormLabel>
                {label} {required && "*"}
              </FormLabel>
              {type === "select" ? (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={(fieldProps as SelectFieldProps).disabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={(fieldProps as SelectFieldProps).placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {(fieldProps as SelectFieldProps).options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : type === "textarea" ? (
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={(fieldProps as TextareaFieldProps).placeholder}
                    rows={(fieldProps as TextareaFieldProps).rows || 3}
                    disabled={(fieldProps as TextareaFieldProps).disabled}
                    readOnly={(fieldProps as TextareaFieldProps).readOnly}
                  />
                </FormControl>
              ) : (type === "image" || type === "video") ? (
                <FormControl>
                  <ImageUploadImageKit
                    value={field.value || []}
                    onChange={field.onChange}
                  />
                </FormControl>
              ) : (
                <FormControl>
                  <Input
                    {...field}
                    type={(fieldProps as InputFieldProps).inputType || "text"}
                    step={(fieldProps as InputFieldProps).step}
                    min={(fieldProps as InputFieldProps).min}
                    max={(fieldProps as InputFieldProps).max}
                    placeholder={(fieldProps as InputFieldProps).placeholder}
                    disabled={(fieldProps as InputFieldProps).disabled}
                    readOnly={(fieldProps as InputFieldProps).readOnly}
                    onChange={(e) => {
                      field.onChange(e);
                      (fieldProps as InputFieldProps).onChange?.(e.target.value);
                    }}
                  />
                </FormControl>
              )}
              {description && (
                <FormDescription>{description}</FormDescription>
              )}
              <FormMessage />
            </>
          )}
        </FormItem>
      )}    
    />
  );
}
"use client";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { startTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import dynamic from "next/dynamic";

const Editor = dynamic(
  () =>
    import("@tinymce/tinymce-react").then((mod) => mod.Editor) as Promise<
      React.ComponentType<any>
    >,
  { ssr: false }
);

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileInput } from "../file-input/file-input";
import { ImageInput } from "../file-input/image-input";
import { MultiImageInput } from "../file-input/multi-image-input";
import { VideoInput } from "../file-input/video-input";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "email"
  | "password"
  | "select"
  | "multiselect"
  | "checkbox"
  | "file"
  | "image"
  | "multi-image"
  | "wysiwyg"
  | "json"
  | "radio"
  | "range"
  | "datetime"
  | "daterange"
  | "video";

interface Option {
  label: string;
  value: string | number;
}

export interface FieldConfig {
  section?: string;
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: Option[];
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean | string;
    acceptedFiles?: string; // For file inputs
    maxFileSize?: number; // For file inputs
    maxFiles?: number; // For multi-image inputs
  };
  defaultValue?: any;
  required?: boolean;
}

interface DynamicFormProps {
  fields: FieldConfig[];
  onSubmit: (data: FormData | any) => void;
  onCancel?: () => void;
  submitText?: string;
  cancelText?: string;
  defaultValues?: any;
  isPending?: boolean;
}

export function DynamicForm({
  fields,
  onSubmit,
  onCancel,
  submitText = "Submit",
  cancelText = "Cancel",
  defaultValues,
  isPending = false,
}: DynamicFormProps) {
  // Generate Zod schema based on field configurations
  const generateSchema = () => {
    const schemaFields: { [key: string]: any } = {};

    fields.forEach((field) => {
      let fieldSchema: any;
      const isRequired = field.validation?.required === true;

      switch (field.type) {
        case "number":
          fieldSchema = z.number();
          if (field.validation?.min !== undefined) {
            fieldSchema = fieldSchema.min(field.validation.min);
          }
          break;
        case "daterange":
          fieldSchema = z.object({
            start: z.string(),
            end: z.string(),
          });
          break;
        case "datetime":
          fieldSchema = z.string().nullable();
          if (!field.validation?.required) {
            fieldSchema = fieldSchema.optional();
          } else {
            fieldSchema = fieldSchema.refine(
              (val: string | null): val is string => val !== null,
              {
                message: `${field.label} is required`,
              }
            );
          }
          break;
        case "password":
          fieldSchema = z.string();
          if (field.validation?.required) {
            fieldSchema = fieldSchema.min(1, `${field.label} is required`);
          }
          if (field.validation?.minLength) {
            fieldSchema = fieldSchema.min(
              field.validation.minLength,
              `Password must be at least ${field.validation.minLength} characters`
            );
          }
          break;
        case "multiselect":
          fieldSchema = z.array(z.string());
          if (field.validation?.required) {
            fieldSchema = fieldSchema.min(
              1,
              "At least one option must be selected"
            );
          }
          break;
        case "checkbox":
          fieldSchema = z.coerce.boolean();
          if (field.validation?.required) {
            fieldSchema = fieldSchema;
          }
          break;
        case "file":
          fieldSchema = z.instanceof(File).nullable();
          if (field.validation?.required) {
            fieldSchema = fieldSchema.refine(
              (file: File | null) => file !== null,
              "File is required"
            );
          }
          if (field.validation?.maxFileSize) {
            fieldSchema = fieldSchema.refine(
              (file: File | null) =>
                !file || file!.size <= field.validation!.maxFileSize!,
              "File size is too large"
            );
          }
          break;
        case "image":
          fieldSchema = z
            .union([
              z.string(),
              typeof window !== "undefined" ? z.instanceof(File) : z.unknown(),
            ])
            .nullable();

          if (field.validation?.required) {
            fieldSchema = fieldSchema.refine(
              (value: any) => value !== null && value !== undefined,
              "Image is required"
            );
          }

          if (field.validation?.maxFileSize) {
            fieldSchema = fieldSchema.refine((value: any) => {
              if (typeof window !== "undefined" && value instanceof File) {
                return value.size <= field.validation?.maxFileSize!;
              }
              return true; // Skip file size check if it's a URL
            }, "Image size is too large");
          }
          break;

        case "multi-image":
          fieldSchema = z.array(z.instanceof(File)).nullable();
          if (field.validation?.required) {
            fieldSchema = fieldSchema.refine(
              (files: File[] | null) => files !== null && files.length > 0,
              "At least one image is required"
            );
          }
          if (field.validation?.maxFileSize) {
            fieldSchema = fieldSchema.refine(
              (files: File[] | null) =>
                !files ||
                files.every(
                  (file) => file.size <= field.validation!.maxFileSize!
                ),
              "One or more images are too large"
            );
          }
          break;
        default:
          fieldSchema = z.string().trim();
          if (isRequired) {
            fieldSchema = fieldSchema.min(1, `${field.label} is required`);
          } else {
            fieldSchema = fieldSchema.optional();
          }
      }

      schemaFields[field.name] = fieldSchema;
    });

    if (
      fields.some((f) => f.name === "password") &&
      fields.some((f) => f.name === "confirmPassword")
    ) {
      return z.object(schemaFields).refine(
        (data) => {
          if (data.password && data.confirmPassword) {
            return data.password === data.confirmPassword;
          }
          return true;
        },
        {
          message: "Passwords don't match",
          path: ["confirmPassword"],
        }
      );
    }

    return z.object(schemaFields);
  };

  const schema = generateSchema();
  const form = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || {},
  });

  const handleSubmit = async (data: any) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== null && value !== undefined) {
        if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    startTransition(() => {
      onSubmit(formData);
    });
  };
  useEffect(() => {
    if (defaultValues) {
      Object.keys(defaultValues).forEach((key) => {
        form.setValue(key, defaultValues[key]);
      });
    }
  }, [defaultValues, form]);

  const renderField = (fieldConfig: FieldConfig, field: any) => {
    const error = form.formState.errors[fieldConfig.name]?.message as string;

    switch (fieldConfig.type) {
      case "text":
      case "email":
      case "password":
        return (
          <Controller
            name={fieldConfig.name}
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <Input
                type={fieldConfig.type}
                placeholder={fieldConfig.placeholder}
                value={value || ""}
                onChange={onChange}
                className={`px-3 ${error ? "border-red-500" : ""}`}
              />
            )}
          />
        );

      case "number":
        return (
          <Controller
            name={fieldConfig.name}
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <Input
                type="number"
                placeholder={fieldConfig.placeholder}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className={`px-3 ${error ? "border-red-500" : ""}`}
              />
            )}
          />
        );

      case "textarea":
        return (
          <Controller
            name={fieldConfig.name}
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <Textarea
                placeholder={fieldConfig.placeholder}
                value={value || ""}
                onChange={onChange}
                className={`px-3 ${error ? "border-red-500" : ""}`}
              />
            )}
          />
        );

      case "wysiwyg":
        return (
          <Controller
            name={fieldConfig.name}
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <Editor
                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                value={value}
                onEditorChange={onChange}
                init={{
                  height: 300,
                  menubar: false,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "code",
                    "help",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo | blocks | " +
                    "bold italic forecolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help",
                }}
              />
            )}
          />
        );

      case "json":
        return (
          <Controller
            name={fieldConfig.name}
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <Textarea
                placeholder="Enter JSON object..."
                value={value || ""}
                onChange={(e) => {
                  onChange(e);
                  try {
                    JSON.parse(e.target.value);
                  } catch (err) {
                    form.setError(fieldConfig.name, {
                      type: "manual",
                      message: "Invalid JSON format",
                    });
                  }
                }}
                className={`px-3 ${error ? "border-red-500" : ""}`}
                rows={10}
              />
            )}
          />
        );

      case "select":
        return (
          <Controller
            name={fieldConfig.name}
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <Select onValueChange={onChange} defaultValue={value}>
                <SelectTrigger
                  className={`w-full bg-background ${
                    error ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder={fieldConfig.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {fieldConfig.options?.map((option) => (
                      <SelectItem
                        key={option.value.toString()}
                        value={option.value.toString()}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        );

      case "multiselect":
        return (
          <Controller
            name={fieldConfig.name}
            control={form.control}
            render={({ field: { onChange, value = [] } }) => (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {value.map((selectedValue: string) => (
                    <Badge
                      key={selectedValue}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {
                        fieldConfig.options?.find(
                          (opt) => opt.value === selectedValue
                        )?.label
                      }
                      <button
                        type="button"
                        onClick={() => {
                          onChange(
                            value.filter((v: string) => v !== selectedValue)
                          );
                        }}
                        className="ml-1 rounded-full hover:bg-destructive/20"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <Select
                  onValueChange={(newValue) => {
                    if (!value.includes(newValue)) {
                      onChange([...value, newValue]);
                    }
                  }}
                >
                  <SelectTrigger
                    className={`w-full bg-background ${
                      error ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue
                      placeholder={
                        fieldConfig.placeholder || "Select options..."
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldConfig.options?.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={String(option.value)}
                        disabled={value.includes(option.value)}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
            )}
          />
        );

      case "checkbox":
        return (
          <Controller
            name={fieldConfig.name}
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <div className="flex w-fit items-center justify-between rounded-lg border p-3 shadow-sm">
                {/* <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {fieldConfig.label}
                </Label> */}
                <Switch
                  checked={value}
                  onCheckedChange={onChange}
                  className={error ? "border-red-500" : ""}
                />
              </div>
            )}
          />
        );

      case "radio":
        return (
          <Controller
            name={fieldConfig.name}
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <RadioGroup
                onValueChange={onChange}
                defaultValue={value}
                className="flex flex-col space-y-1"
              >
                {fieldConfig.options?.map((option) => (
                  <div
                    key={option.value.toString()}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      value={option.value.toString()}
                      id={option.value.toString()}
                    />
                    <Label htmlFor={option.value.toString()}>
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        );

      case "range":
        return (
          <Controller
            name={fieldConfig.name}
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <Input
                type="range"
                min={fieldConfig.validation?.min}
                max={fieldConfig.validation?.max}
                value={value || ""}
                onChange={onChange}
                className={`px-3 ${error ? "border-red-500" : ""}`}
              />
            )}
          />
        );

      case "datetime":
        return (
          <Controller
            name={fieldConfig.name}
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <DatePicker
                selected={value ? new Date(value) : new Date()}
                onChange={(date) => onChange(date?.toISOString())}
                showTimeSelect
                dateFormat="Pp"
                className={`flex  h-10 w-full rounded-md border ${
                  error ? "border-red-500" : "border-input"
                } bg-background px-3 py-2`}
                placeholderText={fieldConfig.placeholder}
              />
            )}
          />
        );

      case "daterange":
        return (
          <Controller
            name={fieldConfig.name}
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <div className="flex gap-4">
                <DatePicker
                  selected={value?.start ? new Date(value.start) : null}
                  onChange={(date) =>
                    onChange({
                      ...value,
                      start: date?.toISOString(),
                    })
                  }
                  selectsStart
                  startDate={value?.start ? new Date(value.start) : null}
                  endDate={value?.end ? new Date(value.end) : null}
                  className={`flex h-10 w-full rounded-md border ${
                    error ? "border-red-500" : "border-input"
                  } bg-background px-3 py-2`}
                  placeholderText="Start date"
                />
                <DatePicker
                  selected={value?.end ? new Date(value.end) : null}
                  onChange={(date) =>
                    onChange({
                      ...value,
                      end: date?.toISOString(),
                    })
                  }
                  selectsEnd
                  startDate={value?.start ? new Date(value.start) : null}
                  endDate={value?.end ? new Date(value.end) : null}
                  minDate={value?.start ? new Date(value.start) : undefined}
                  className={`flex h-10 w-full rounded-md border ${
                    error ? "border-red-500" : "border-input"
                  } bg-background px-3 py-2`}
                  placeholderText="End date"
                />
              </div>
            )}
          />
        );

      case "file":
        return (
          <FileInput
            value={field}
            onChange={(file) => form.setValue(fieldConfig.name, file)}
            accept={fieldConfig.validation?.acceptedFiles}
            maxSize={fieldConfig.validation?.maxFileSize}
            error={form.formState.errors[fieldConfig.name]?.message as string}
          />
        );

      case "image":
        return (
          <ImageInput
            value={field}
            onChange={(file) => {
              form.setValue(fieldConfig.name, file);
              form.trigger(fieldConfig.name);
            }}
            maxSize={fieldConfig.validation?.maxFileSize}
            error={form.formState.errors[fieldConfig.name]?.message as string}
          />
        );

      case "video":
        return (
          <VideoInput
            value={field}
            onChange={(file) => {
              form.setValue(fieldConfig.name, file);
              form.trigger(fieldConfig.name);
            }}
            maxSize={fieldConfig.validation?.maxFileSize}
            error={form.formState.errors[fieldConfig.name]?.message as string}
          />
        );

      case "multi-image":
        return (
          <MultiImageInput
            value={field}
            onChange={(files) => {
              form.setValue(fieldConfig.name, files);
              form.trigger(fieldConfig.name);
            }}
            maxSize={fieldConfig.validation?.maxFileSize}
            maxFiles={fieldConfig.validation?.maxFiles || 5}
            error={form.formState.errors[fieldConfig.name]?.message as string}
          />
        );
      default:
        return null;
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-6"
      encType="multipart/form-data"
    >
      {fields.map((fieldConfig) => {
        return (
          <div key={fieldConfig.name} >  
             {fieldConfig.section&& 
              <h1 className="font-extrabold text-xl">{fieldConfig.section}</h1>
             }
            <div  className="space-y-2">
              <Label
                htmlFor={fieldConfig.name}
                className="text-sm font-medium leading-none text-foreground"
              >
                {fieldConfig.label}
                {fieldConfig.validation?.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </Label>
              {renderField(fieldConfig, form.getValues(fieldConfig.name))}
            </div>
          </div>
        );
      })}
      <div className="flex justify-end space-x-4 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            {cancelText}
          </Button>
        )}

        <Button disabled={isPending} type="submit">
          {isPending ? submitText + "..." : submitText}
        </Button>
      </div>
    </form>
  );
}

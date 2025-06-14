"use client";

import React, { useEffect, useState } from "react";
import { FormProvider, useForm, useFieldArray } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "../ui/command";
import { Check, ChevronsUpDown, X, Plus, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";


type ContactValues = z.infer<typeof contactSchema>;

const customFieldSchema = z
  .array(
    z.object({
      key: z.string().optional(),
      value: z.string().optional(),
    })
  )
  .superRefine((fields, ctx) => {
    fields.forEach((field, index) => {
      const hasKey = field.key && field.key.trim().length > 0;
      const hasValue = field.value && field.value.trim().length > 0;

      // If one field is filled, both must be filled
      if (hasKey && !hasValue) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Value is required when key is provided",
          path: [index, "value"],
        });
      }

      if (hasValue && !hasKey) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Key is required when value is provided",
          path: [index, "key"],
        });
      }
    });
  });

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  // Make tags optional
  tags: z.array(z.string()).optional().default([]),
  notes: z.string().optional(),
  // Make custom fields optional
  custom_fields: customFieldSchema.optional().default([])
});

const ContactForm = ({
  onSubmit,
  defaultValue,
  buttonText,
  isLoading,
}: {
  onSubmit: (data: any) => void;
  defaultValue: ContactValues;
  buttonText: string;
  isLoading: boolean;
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      ...defaultValue,
      custom_fields:
        defaultValue.custom_fields?.length > 0
          ? defaultValue.custom_fields
          : [{ key: "", value: "" }],
    },
    mode: "onTouched", // Only validate after user has interacted with field
  });

  // Use useFieldArray for custom fields
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "custom_fields",
  });

  // Add custom field
  const addCustomField = () => {
    append({ key: "", value: "" });
  };

  // Remove custom field
  const removeCustomField = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    } else {
      
      form.setValue(`custom_fields.${index}.key`, "");
      form.setValue(`custom_fields.${index}.value`, "");
    }
  };

  // Handle form submission
  const handleSubmit = (data: ContactValues) => {
    // Filter out empty custom fields
    const filteredCustomFields = data.custom_fields?.filter(
      field => field.key?.trim() && field.value?.trim()
    ) || [];

    // Convert custom fields to object format
    const objectifiedCustomFields = filteredCustomFields.reduce((acc, field) => {
      if (field.key && field.value) {
        try {
          // Try to parse JSON if the value is a stringified object
          const parsedValue = JSON.parse(field.value);
          acc[field.key.trim()] = parsedValue;
        } catch {
          // If not JSON, use the string value as is
          acc[field.key.trim()] = field.value.trim();
        }
      }
      return acc;
    }, {} as Record<string, any>);

    const finalData = {
      ...data,
      tags: data.tags || [],
      custom_fields: Object.keys(objectifiedCustomFields).length > 0 
        ? objectifiedCustomFields 
        : undefined
    };

    onSubmit(finalData);
  };

  useEffect(() => {
    let initialCustomFields = [{ key: "", value: "" }];
    
    if (defaultValue.custom_fields) {
      if (typeof defaultValue.custom_fields === 'object' && !Array.isArray(defaultValue.custom_fields)) {
        // Convert object to array of key-value pairs
        initialCustomFields = Object.entries(defaultValue.custom_fields).map(([key, value]) => ({
          key,
          value: typeof value === 'object' ? JSON.stringify(value) : String(value) // Handle object values
        }));
      }
    }

    // Reset form with properly formatted data
    form.reset({
      ...defaultValue,
      tags: defaultValue.tags || [],
      custom_fields: initialCustomFields
    });
  }, [defaultValue, form]);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter full name"
                    {...field}
                    className={cn(
                      "transition-colors",
                      form.formState.errors.name &&
                        "border-red-500 focus:border-red-500"
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    {...field}
                    className={cn(
                      "transition-colors",
                      form.formState.errors.email &&
                        "border-red-500 focus:border-red-500"
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="Enter phone number"
                    {...field}
                    className={cn(
                      "transition-colors",
                      form.formState.errors.phone &&
                        "border-red-500 focus:border-red-500"
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Company */}
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter company name"
                    {...field}
                    className={cn(
                      "transition-colors",
                      form.formState.errors.company &&
                        "border-red-500 focus:border-red-500"
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Address */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter full address"
                  {...field}
                  className={cn(
                    "transition-colors",
                    form.formState.errors.address &&
                      "border-red-500 focus:border-red-500"
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tags */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-between text-left font-normal transition-colors",
                        !field.value?.length && "text-muted-foreground",
                        form.formState.errors.tags && "border-red-500"
                      )}
                      type="button"
                    >
                      <span className="truncate">
                        {field.value?.length > 0
                          ? `${field.value.length} tag${
                              field.value.length > 1 ? "s" : ""
                            } selected`
                          : "Select tags"}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search tags..." />
                    <CommandList>
                      <CommandEmpty>No tags found.</CommandEmpty>
                      <CommandGroup>
                        {[
                          "VIP",
                          "Lead",
                          "Prospect",
                          "Returning",
                          "Important",
                        ].map((tag) => (
                          <CommandItem
                            key={tag}
                            value={tag}
                            onSelect={() => {
                              const currentTags = field.value || [];
                              const newTags = currentTags.includes(tag)
                                ? currentTags.filter((t: string) => t !== tag)
                                : [...currentTags, tag];

                              form.setValue("tags", newTags, {
                                shouldValidate: form.formState.isSubmitted,
                              });
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value?.includes(tag)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {tag}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Show selected tags */}
              {field.value && field.value.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {field.value.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => {
                          const newTags = field.value.filter(
                            (t: string) => t !== tag
                          );
                          form.setValue("tags", newTags, {
                            shouldValidate: form.formState.isSubmitted,
                          });
                        }}
                        className="hover:text-blue-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <FormMessage />
            </FormItem>
          )}
        />



        {/* Custom Fields */}
        <div>
          <FormLabel className="text-sm font-medium">Custom Fields</FormLabel>
          <p className="text-xs text-muted-foreground mb-4">
            Add custom key-value pairs to store additional information
          </p>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-3 items-start">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name={`custom_fields.${index}.key`}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Field name (e.g., Department)"
                            {...formField}
                            className={cn(
                              "transition-colors",
                              form.formState.errors.custom_fields?.[index]
                                ?.key && "border-red-500 focus:border-red-500"
                            )}
                          />
                        </FormControl>
                        <FormMessage>
                          {
                            form.formState.errors.custom_fields?.[index]?.key
                              ?.message
                          }
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name={`custom_fields.${index}.value`}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Field value (e.g., Marketing)"
                            {...formField}
                            className={cn(
                              "transition-colors",
                              form.formState.errors.custom_fields?.[index]
                                ?.value && "border-red-500 focus:border-red-500"
                            )}
                          />
                        </FormControl>
                        <FormMessage>
                          {
                            form.formState.errors.custom_fields?.[index]?.value
                              ?.message
                          }
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeCustomField(index)}
                  className="text-gray-500 hover:text-red-600 px-2 "
                  title="Remove field"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addCustomField}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 mt-2"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Custom Field
            </Button>
          </div>
        </div>

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any additional notes about this contact..."
                  rows={4}
                  {...field}
                  className={cn(
                    "resize-none transition-colors",
                    form.formState.errors.notes &&
                      "border-red-500 focus:border-red-500"
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex justify-end gap-2 pt-6">
          <Button asChild type="button" variant="outline">
            <Link href="/admin/contacts"> Cancel </Link>
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {buttonText}...
              </span>
            ) : (
              buttonText
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ContactForm;

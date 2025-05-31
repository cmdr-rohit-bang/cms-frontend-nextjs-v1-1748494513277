import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const convertToCSV = (data: any[]) => {
  const headers = [
    "ID",
    "Name",
    "Email",
    "Phone",
    "Company",
    "Address",
    "Notes",
    "Tags",
    "Created At",
    "Updated At",
  ];

  const rows = data.map((item) => [
    item.id,
    item.name,
    item.email,
    item.phone,
    item.company,
    item.address,
    item.notes,
    item.tags,
    item.createdAt,
    item.updatedAt,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row
        .map((field) =>
          `"${(field ?? "").toString().replace(/"/g, '""')}"`
        )
        .join(",")
    ),
  ].join("\n");

  return csvContent;
};

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

export default function CustomFields( {setCustomFields, customFields}: { setCustomFields: React.Dispatch<React.SetStateAction<any[]>>, customFields: any[] }) {


  const handleChange = (index: number, field: "key" | "value", value: string) => {
    setCustomFields((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const addCustomField = () => {
    setCustomFields((prev) => [...prev, { key: "", value: "" }]);
  };

  const removeCustomField = (index: number) => {
    setCustomFields((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {customFields.map((field, index) => (
        <div key={index} className="flex gap-3 items-start">
          <div className="flex-1">
            <Input
              placeholder="Field name (e.g., Department)"
              value={field.key}
              onChange={(e) => handleChange(index, "key", e.target.value)}
              className="transition-colors"
            />
          </div>

          <div className="flex-1">
            <Input
              placeholder="Field value (e.g., Marketing)"
              value={field.value}
              onChange={(e) => handleChange(index, "value", e.target.value)}
              className="transition-colors"
            />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => removeCustomField(index)}
            className="text-gray-500 hover:text-red-600 px-2"
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
  );
}

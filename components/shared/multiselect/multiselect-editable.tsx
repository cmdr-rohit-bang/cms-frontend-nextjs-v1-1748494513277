import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface EditableMultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const EditableMultiSelect = ({ value = [], onChange }: EditableMultiSelectProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddValue = () => {
    if (inputValue.trim() && !value.includes(inputValue.trim())) {
      onChange([...value, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddValue();
    }
  };

  const handleRemoveValue = (valueToRemove: string) => {
    onChange(value.filter(v => v !== valueToRemove));
  };

  return (
    <div className="space-y-2">
      {/* Selected values display */}
      <div className="flex flex-wrap gap-2">
        {value.map((val, index) => (
          <Badge
            key={`${val}-${index}`}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {val}
            <button
              type="button"
              onClick={() => handleRemoveValue(val)}
              className="ml-1 rounded-full hover:bg-destructive/20 p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      {/* Input field */}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type and press Enter or Add"
          className="flex-1 px-3"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddValue}
          disabled={!inputValue.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default EditableMultiSelect;
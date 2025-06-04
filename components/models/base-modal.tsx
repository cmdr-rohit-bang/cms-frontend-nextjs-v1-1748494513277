// import { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
// } from "@/components/ui/command";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Check, ChevronsUpDown } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface Option {
//   value: string;
//   label: string;
// }

// interface BaseModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onConfirm: (value: string) => void;
//   title: string;
//   options?: Option[];
//   isTextarea?: boolean;
//   useCombobox?: boolean;
//   placeholder?: string;
//   selectedCount?: number;
//   isLoading?: boolean;
//   description?: string;
//   onSearch?: (searchTerm: string) => void;
// }

// export function BaseModal({
//   isOpen,
//   onClose,
//   onConfirm,
//   title,
//   options = [],
//   isTextarea = false,
//   useCombobox = false,
//   placeholder = "",
//   selectedCount = 0,
//   isLoading = false,
//   description,
//   onSearch,
// }: BaseModalProps) {
//   const [value, setValue] = useState("");
//   const [open, setOpen] = useState(false);
//   const [searchValue, setSearchValue] = useState("");
//   const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

//   // Reset value when modal opens/closes
//   useEffect(() => {
//     if (!isOpen) {
//       setValue("");
//       setSearchValue("");
//       setOpen(false);
//       // Clear any pending debounce timeout
//       if (debounceTimeout) {
//         clearTimeout(debounceTimeout);
//         setDebounceTimeout(null);
//       }
//     }
//   }, [isOpen, debounceTimeout]);

//   // Debounced search effect
//   useEffect(() => {
//     if (onSearch && searchValue !== "" && useCombobox) {
//       // Clear previous timeout
//       if (debounceTimeout) {
//         clearTimeout(debounceTimeout);
//       }

//       // Set new timeout
//       const timeout = setTimeout(() => {
//         onSearch(searchValue);
//       }, 300); // 300ms debounce

//       setDebounceTimeout(timeout);

//       // Cleanup function
//       return () => {
//         clearTimeout(timeout);
//       };
//     }
//   }, [searchValue, onSearch, useCombobox]);

//   const handleConfirm = () => {
//     if (!value.trim()) return;
//     onConfirm(value);
//   };

//   const handleClose = () => {
//     setValue("");
//     setSearchValue("");
//     setOpen(false);
//     // Clear any pending debounce timeout
//     if (debounceTimeout) {
//       clearTimeout(debounceTimeout);
//       setDebounceTimeout(null);
//     }
//     onClose();
//   };

//   const isFormValid = value.trim().length > 0;

//   // Filter options based on search value (for local filtering when no onSearch provided)
//   const filteredOptions = onSearch ? options : options.filter(option =>
//     option.label.toLowerCase().includes(searchValue.toLowerCase())
//   );

//   // Get selected option label
//   const selectedOption = options.find(option => option.value === value);

//   // Handle search input change
//   const handleSearchChange = (newSearchValue: string) => {
//     setSearchValue(newSearchValue);
//   };

//   // Combobox component
//   const ComboboxField = () => (
//     <div className="space-y-2">
//       <label htmlFor="combobox-input" className="text-sm font-medium">
//         {title}
//       </label>
//       <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger asChild>
//           <Button
//             variant="outline"
//             role="combobox"
//             aria-expanded={open}
//             className="w-full justify-between"
//             disabled={isLoading}
//           >
//             {selectedOption ? selectedOption.label : placeholder}
//             <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-full p-0" align="start">
//           <Command>
//             <CommandInput
//               placeholder="Search contacts..."
//               value={searchValue}
//               onValueChange={handleSearchChange}
//             />
//             <CommandEmpty>
//               {isLoading ? "Loading contacts..." : "No contacts found."}
//             </CommandEmpty>
//             <CommandGroup className="max-h-64 overflow-auto">
//               {isLoading ? (
//                 <CommandItem disabled>
//                   <div className="flex items-center space-x-2">
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
//                     <span>Loading...</span>
//                   </div>
//                 </CommandItem>
//               ) : (
//                 filteredOptions.map((option) => (
//                   <CommandItem
//                     key={option.value}
//                     value={option.value}
//                     onSelect={(currentValue) => {
//                       setValue(currentValue === value ? "" : currentValue);
//                       setOpen(false);
//                     }}
//                   >
//                     <Check
//                       className={cn(
//                         "mr-2 h-4 w-4",
//                         value === option.value ? "opacity-100" : "opacity-0"
//                       )}
//                     />
//                     {option.label}
//                   </CommandItem>
//                 ))
//               )}
//             </CommandGroup>
//           </Command>
//         </PopoverContent>
//       </Popover>
//     </div>
//   );

//   // Select component
//   const SelectField = () => (
//     <div className="space-y-2">
//       <label htmlFor="select-input" className="text-sm font-medium">
//         {title}
//       </label>
//       <Select value={value} onValueChange={setValue} disabled={isLoading}>
//         <SelectTrigger>
//           <SelectValue placeholder={placeholder} />
//         </SelectTrigger>
//         <SelectContent>
//           {options.map((option) => (
//             <SelectItem key={option.value} value={option.value}>
//               {option.label}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//     </div>
//   );

//   return (
//     <Dialog open={isOpen} onOpenChange={handleClose}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>{title}</DialogTitle>
//           <DialogDescription>
//             {description || 
//               `${title.toLowerCase()} for ${selectedCount} selected ticket${
//                 selectedCount === 1 ? "" : "s"
//               }.`
//             }
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-4 py-4">
//           {isTextarea ? (
//             <div className="space-y-2">
//               <label htmlFor="textarea-input" className="text-sm font-medium">
//                 {title}
//               </label>
//               <Textarea
//                 id="textarea-input"
//                 value={value}
//                 onChange={(e) => setValue(e.target.value)}
//                 placeholder={placeholder}
//                 className="min-h-[100px]"
//                 disabled={isLoading}
//               />
//             </div>
//           ) : useCombobox ? (
//             <ComboboxField />
//           ) : (
//             <SelectField />
//           )}
//         </div>

//         <DialogFooter className="space-x-2">
//           <Button
//             type="button"
//             variant="outline"
//             onClick={handleClose}
//             disabled={isLoading}
//           >
//             Cancel
//           </Button>
//           <Button
//             type="button"
//             onClick={handleConfirm}
//             disabled={!isFormValid || isLoading}
//           >
//             {isLoading ? "Updating..." : "Update"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
  title: string;
  options: { label: string; value: string }[];
  isTextarea?: boolean;
  useCombobox?: boolean;
  placeholder?: string;
  selectedCount?: number;
  isLoading?: boolean;
  onSearch?: (search: string) => void;
}

export const BaseModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  options,
  isTextarea = false,
  useCombobox = false,
  placeholder = "",
  selectedCount = 0,
  isLoading = false,
  onSearch,
}: BaseModalProps) => {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm(value);
    setValue("");
  };

  const handleClose = () => {
    onClose();
    setValue("");
    setOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {title} {selectedCount > 0 && `(${selectedCount} selected)`}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {isTextarea && (
            <Textarea
              placeholder={placeholder}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="min-h-[100px]"
            />
          )}

          {!isTextarea && !useCombobox && (
            <Select onValueChange={setValue} value={value}>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {useCombobox && (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {value ? 
                    options.find((option) => option.value === value)?.label 
                    : placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput 
                    placeholder={`Search ${title.toLowerCase()}...`}
                    onValueChange={onSearch}
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      {options.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.label}
                          onSelect={() => {
                            setValue(option.value);
                            setOpen(false);
                          }}
                        >
                          {option.label}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              value === option.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!value || isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
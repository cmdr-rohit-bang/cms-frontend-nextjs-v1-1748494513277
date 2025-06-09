"use client";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FormField } from "../ui/form";
import { FormLabel } from "../ui/form";
import { FormControl } from "../ui/form";
import { FormMessage } from "../ui/form";
import { FormItem } from "../ui/form";
import { PopoverContent } from "../ui/popover";
import { Popover } from "../ui/popover";
import { PopoverTrigger } from "../ui/popover";
import { Command } from "../ui/command";
import { CommandInput } from "../ui/command";
import { CommandList } from "../ui/command";
import { CommandEmpty } from "../ui/command";
import { CommandGroup } from "../ui/command";
import { CommandItem } from "../ui/command";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SelectItem } from "../ui/select";
import { SelectTrigger } from "../ui/select";
import { SelectValue } from "../ui/select";
import { SelectContent } from "../ui/select";
import { Textarea } from "../ui/textarea";
import Link from "next/link";
import { fetchData } from "@/app/actions";
import { Pagination, ticketSchema, TicketValues } from "@/types/types";
import { Contact as ContactType } from "@/types/types";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";



const TicketForm = ({
  onSubmit,
  defaultValue,
  buttonText,
  isLoading,
}: {
  onSubmit: (data: TicketValues) => void;
  defaultValue: TicketValues & {
    status: string;
    category: string;
    priority: string;
  };
  buttonText: string;
  isLoading: boolean;
}) => {
  const form = useForm<TicketValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: defaultValue,
  });

  const [contacts, setContacts] = useState<{ label: string; value: string }[]>(
    []
  );

  const [users, setUsers] = useState<{ label: string; value: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchContactData = async () => {
      const res = (await fetchData(`/api/contacts?search=${searchQuery}`)) as {
        data: ContactType[];
        pagination: Pagination;
      };
      const resData = res?.data;
      const formattedContacts = resData.map((contact: any) => ({
        label: contact.name,
        value: contact.id,
      }));
      setContacts(formattedContacts);
    };
    fetchContactData();
  }, [searchQuery]);

  useEffect(() => {
    const fetchUserData = async () => {
      const res = (await fetchData(`/auth/tenant/all`)) as {
        data: ContactType[];
      };
      const resData = res?.data;
      const formattedContacts = resData.map((contact: any) => ({
        label: contact.first_name + " " + contact.last_name,
        value: contact.id,
      }));
      setUsers(formattedContacts);
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    console.log("defaultValue", defaultValue);
    // Reset the form with all values including status, category, and priority
    if (defaultValue) {
      form.reset({
        ...defaultValue,
        status: defaultValue.status || undefined,
        category: defaultValue.category || undefined,
        priority: defaultValue.priority || undefined,
      });
    }
  }, [defaultValue, form, isLoading]);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
          {/* Subject */}
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Brief description of the issue"
                    {...field}
                    className="transition-all"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contact_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? contacts.find((c) => c.value === field.value)?.label
                          : "Select a person"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search team member..."
                        onValueChange={setSearchQuery}
                      />
                      <CommandList>
                        <CommandEmpty>No match found.</CommandEmpty>
                        <CommandGroup>
                          {contacts.map((contact) => (
                            <CommandItem
                              key={contact.value}
                              value={contact.label}
                              onSelect={() =>
                                form.setValue("contact_id", contact.value)
                              }
                            >
                              {contact.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  contact.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="due_date"
            render={({ field }) => (
              <FormItem className="flex gap-1 flex-col mt-[6px]">
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field?.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assigned_to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned To</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? users.find((c) => c.value === field.value)?.label
                          : "Select a person"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandList>
                        <CommandEmpty>No match found.</CommandEmpty>
                        <CommandGroup>
                          {users.map((user) => (
                            <CommandItem
                              key={user.value}
                              value={user.label}
                              onSelect={() =>
                                form.setValue("assigned_to", user.value)
                              }
                            >
                              {user.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  user.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the issue in detail..."
                  rows={4}
                  {...field}
                  className="transition-all"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 ">
          {/* Priority */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="accounting">Accounting</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-6 flex justify-end gap-2">
          <Button asChild type="button" variant="outline">
            <Link href="/admin/tickets"> Cancel </Link>
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white transition"
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

export default TicketForm;

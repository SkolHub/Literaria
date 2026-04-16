'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export type ComboboxOptions = {
  value: string;
  label: string;
  description?: string;
  keywords?: string[];
};

type Mode = 'single' | 'multiple';

function normalizeValue(value: string) {
  return value.trim().toLowerCase();
}

function getOptionSearchText(option: ComboboxOptions) {
  return [option.label, option.description, option.keywords?.join(' ')]
    .filter(Boolean)
    .join(' ');
}

interface ComboboxProps {
  mode?: Mode;
  options: ComboboxOptions[];
  selected: string | string[];
  className?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  onChange?: (event: string | string[]) => void;
  onCreate?: (value: string) => void;
}

export function Combobox({
  options,
  selected,
  className,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  mode = 'single',
  onChange,
  onCreate
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState<string>('');
  const normalizedQuery = normalizeValue(query);

  const filteredOptions = options.filter((option) => {
    if (!normalizedQuery) {
      return true;
    }

    return normalizeValue(getOptionSearchText(option)).includes(
      normalizedQuery
    );
  });

  const selectedLabels =
    mode === 'multiple' && Array.isArray(selected)
      ? selected
          .map(
            (selectedValue) =>
              options.find((item) => item.value === selectedValue)?.label ??
              selectedValue
          )
          .join(', ')
      : typeof selected === 'string'
        ? (options.find((item) => item.value === selected)?.label ?? selected)
        : '';

  const canCreate =
    Boolean(onCreate) &&
    normalizedQuery.length > 0 &&
    !options.some(
      (option) =>
        normalizeValue(option.label) === normalizedQuery ||
        normalizeValue(option.value) === normalizedQuery
    );

  React.useEffect(() => {
    if (!open) {
      setQuery('');
    }
  }, [open]);

  return (
    <div className={cn('block', className)}>
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild>
          <Button
            key={'combobox-trigger'}
            type='button'
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='h-auto min-h-11 w-full justify-between px-3 py-2'
          >
            {selectedLabels.length > 0 ? (
              <div className='relative mr-auto flex flex-grow flex-wrap items-center overflow-hidden'>
                <span className='line-clamp-2 text-left'>{selectedLabels}</span>
              </div>
            ) : (
              <span className='mr-auto text-neutral-500'>
                {placeholder ?? 'Select Item...'}
              </span>
            )}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align='start'
          className='w-[var(--radix-popover-trigger-width)] min-w-[18rem] p-0'
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={searchPlaceholder ?? placeholder ?? ''}
              value={query}
              onValueChange={(value: string) => setQuery(value)}
            />
            <CommandList className='max-h-80 overflow-y-auto overscroll-contain'>
              {canCreate && (
                <CommandGroup heading='Nou'>
                  <CommandItem
                    value={query}
                    onSelect={() => {
                      const createdValue = query.trim();

                      if (!createdValue || !onCreate) {
                        return;
                      }

                      onCreate(createdValue);
                      onChange?.(createdValue);
                      setOpen(false);
                    }}
                  >
                    <Check className='mr-2 h-4 w-4 opacity-0' />
                    <div className='flex flex-col'>
                      <span className='font-medium'>
                        Creează “{query.trim()}”
                      </span>
                      <span className='text-xs text-neutral-500'>
                        Folosește această valoare nouă.
                      </span>
                    </div>
                  </CommandItem>
                </CommandGroup>
              )}
              {filteredOptions.length > 0 ? (
                <CommandGroup>
                  {filteredOptions.map((option) => {
                    const isSelected =
                      mode === 'multiple' && Array.isArray(selected)
                        ? selected.includes(option.value)
                        : selected === option.value;

                    return (
                      <CommandItem
                        key={option.value}
                        value={getOptionSearchText(option)}
                        onSelect={() => {
                          if (onChange) {
                            if (
                              mode === 'multiple' &&
                              Array.isArray(selected)
                            ) {
                              onChange(
                                selected.includes(option.value)
                                  ? selected.filter(
                                      (item) => item !== option.value
                                    )
                                  : [...selected, option.value]
                              );
                            } else {
                              onChange(option.value);
                              setOpen(false);
                            }
                          }
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            isSelected ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <div className='flex min-w-0 flex-col'>
                          <span className='truncate'>{option.label}</span>
                          {option.description ? (
                            <span className='truncate text-xs text-neutral-500'>
                              {option.description}
                            </span>
                          ) : null}
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ) : null}
              {!canCreate && filteredOptions.length === 0 ? (
                <CommandEmpty className='py-6 text-center text-sm text-neutral-500'>
                  {emptyMessage ?? 'Nu am găsit nimic.'}
                </CommandEmpty>
              ) : null}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

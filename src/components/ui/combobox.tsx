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
import { ScrollArea } from './scroll-area';

export type ComboboxOptions = {
  value: string;
  label: string;
};

type Mode = 'single' | 'multiple';

function matchScore(item: string, search: string): number {
  const itemLower = item.toLowerCase();
  const searchLower = search.toLowerCase();

  if (itemLower === searchLower) return 1;

  const searchLen = searchLower.length;
  let maxMatchLength = 0;

  for (let i = 0; i < itemLower.length - searchLen + 1; i++) {
    let matchLength = 0;
    for (let j = 0; j < searchLen; j++) {
      if (itemLower[i + j] !== searchLower[j]) break;
      matchLength++;
    }
    maxMatchLength = Math.max(maxMatchLength, matchLength);
  }

  return maxMatchLength / searchLen;
}

interface ComboboxProps {
  mode?: Mode;
  options: ComboboxOptions[];
  selected: string | string[];
  className?: string;
  placeholder?: string;
  onChange?: (event: string | string[]) => void;
  onCreate?: (value: string) => void;
}

export function Combobox({
  options,
  selected,
  className,
  placeholder,
  mode = 'single',
  onChange,
  onCreate
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState<string>('');

  return (
    <div className={cn('block', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            key={'combobox-trigger'}
            type='button'
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-full justify-between'
          >
            {selected && selected.length > 0 ? (
              <div className='relative mr-auto flex flex-grow flex-wrap items-center overflow-hidden'>
                <span>
                  {mode === 'multiple' && Array.isArray(selected)
                    ? selected
                        .map(
                          (selectedValue: string) =>
                            options.find((item) => item.value === selectedValue)
                              ?.label
                        )
                        .join(', ')
                    : mode === 'single' &&
                      options.find((item) => item.value === selected)?.label}
                </span>
              </div>
            ) : (
              (placeholder ?? 'Select Item...')
            )}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-72 max-w-sm p-0'>
          <Command
            filter={(value, search) => {
              const score = matchScore(value, search);
              return score > 0.5 ? score : 0;
            }}
            shouldFilter={true}
          >
            <CommandInput
              placeholder={placeholder ?? ''}
              value={query}
              onValueChange={(value: string) => setQuery(value)}
            />
            {onCreate && (
              <CommandEmpty
                onClick={() => {
                  onCreate(query);
                  setQuery('');
                }}
                className='flex cursor-pointer items-center justify-center px-2 py-1.5'
              >
                <label className='break-all'>Create: {query}</label>
              </CommandEmpty>
            )}
            <ScrollArea>
              <div className='max-h-80'>
                <CommandList>
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={option.label}
                        value={option.label}
                        onSelect={(currentValue) => {
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
                            }
                          }
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            selected === option.value
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </div>
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

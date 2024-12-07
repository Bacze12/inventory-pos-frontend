import React from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  FormErrorMessage,
} from '@chakra-ui/react';

/**
 * InputField Component
 * Un campo de entrada reutilizable.
 */
export const InputField = ({
  label,
  value,
  onChange,
  placeholder = '',
  isInvalid = false,
  errorMessage = '',
  type = 'text',
}) => (
  <FormControl isInvalid={isInvalid} mb={4}>
    <FormLabel>{label}</FormLabel>
    <Input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
    />
    <FormErrorMessage>{errorMessage}</FormErrorMessage>
  </FormControl>
);

/**
 * SelectField Component
 * Un selector reutilizable.
 */
export const SelectField = ({
  label,
  value,
  onChange,
  options = [],
  isInvalid = false,
  errorMessage = '',
}) => (
  <FormControl isInvalid={isInvalid} mb={4}>
    <FormLabel>{label}</FormLabel>
    <Select value={value} onChange={onChange}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
    <FormErrorMessage>{errorMessage}</FormErrorMessage>
  </FormControl>
);

/**
 * TextAreaField Component
 * Un área de texto reutilizable.
 */
export const TextAreaField = ({
  label,
  value,
  onChange,
  placeholder = '',
  isInvalid = false,
  errorMessage = '',
}) => (
  <FormControl isInvalid={isInvalid} mb={4}>
    <FormLabel>{label}</FormLabel>
    <Textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
    <FormErrorMessage>{errorMessage}</FormErrorMessage>
  </FormControl>
);

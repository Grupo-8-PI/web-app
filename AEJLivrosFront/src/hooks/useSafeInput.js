import { useState, useCallback } from 'react';
import { sanitizeText, validateInput } from '../utils/securityUtils';

export const useSafeInput = (initialValue = '', validationType = 'text') => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');
  const [isTouched, setIsTouched] = useState(false);

  const handleChange = useCallback((e) => {
    const rawValue = e.target.value;
    const sanitized = sanitizeText(rawValue);
    setValue(sanitized);
    
    if (isTouched) {
      const validation = validateInput(sanitized, validationType);
      setError(validation.valid ? '' : validation.error);
    }
  }, [isTouched, validationType]);

  const handleBlur = useCallback(() => {
    setIsTouched(true);
    const validation = validateInput(value, validationType);
    setError(validation.valid ? '' : validation.error);
  }, [value, validationType]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError('');
    setIsTouched(false);
  }, [initialValue]);

  const validate = useCallback(() => {
    const validation = validateInput(value, validationType);
    setError(validation.valid ? '' : validation.error);
    return validation.valid;
  }, [value, validationType]);

  return {
    value,
    error,
    handleChange,
    handleBlur,
    reset,
    validate,
    setValue: (newValue) => setValue(sanitizeText(newValue))
  };
};
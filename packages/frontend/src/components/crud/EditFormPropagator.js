import { useEffect } from "react";
import useDebounce from "../../hooks/useDebounce";

export function EditFormPropagator({
  data,
  values,
  setValueCache,
  currentVersion,
  dirty,
  setFormIsDirty,
  isSubmitting,
  setFormIsSubmitting,
}) {
  useEffect(() => {
    setFormIsDirty(dirty);
  }, [dirty, setFormIsDirty, data, currentVersion]);

  const debouncedValues = useDebounce(values, 200);

  useEffect(() => {
    setValueCache(debouncedValues);
  }, [debouncedValues, setValueCache]);

  useEffect(() => {
    setFormIsSubmitting(isSubmitting);
  }, [isSubmitting, setFormIsSubmitting]);

  return null;
}

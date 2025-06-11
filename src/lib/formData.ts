export function objectToFormData(
  obj: Record<string, unknown>,
  formData = new FormData(),
  parentKey = ""
): FormData {
  for (const key in obj) {
    const value = obj[key];
    const formKey = parentKey ? `${parentKey}[${key}]` : key;

    if (value instanceof File) {
      formData.append(formKey, value);
    } else if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item));
    } else if (value === null) {
      formData.append(formKey, "");
    } else {
      formData.append(formKey, String(value));
    }
  }
  return formData;
}

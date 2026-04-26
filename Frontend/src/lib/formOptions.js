export const WARD_UPPER_LIMIT = Number(import.meta.env.VITE_WARD_UPPER_LIMIT || 144);

export const getWardOptions = (upperLimit = WARD_UPPER_LIMIT) => {
  return Array.from({ length: upperLimit }, (_, i) => {
    const wardNumber = i + 1;
    return {
      value: `Ward ${wardNumber}`,
      label: `Ward ${wardNumber}`,
      numberValue: String(wardNumber),
    };
  });
};

const REQUIRED_FIELD_KEYS = new Set([
  "name",
  "dateOfBirth",
  "beneficiaryId",
  "wardNo",
  "projectResponsible",
]);

export const isCoreRequiredField = (fieldName) => REQUIRED_FIELD_KEYS.has(fieldName);
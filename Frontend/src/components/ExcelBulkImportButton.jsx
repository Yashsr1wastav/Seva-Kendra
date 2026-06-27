import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Download, FileSpreadsheet, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

const normalizeHeader = (value) => String(value || "").trim().replace(/\s+/g, " ");

const formatDateValue = (value) => value.toISOString().split("T")[0];

const normalizeCellValue = (value) => {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return formatDateValue(value);
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "";
  if (typeof value === "string") {
    const trimmed = value.trim();

    if (/^(true|yes|y|1)$/i.test(trimmed)) return true;
    if (/^(false|no|n|0)$/i.test(trimmed)) return false;

    return trimmed;
  }
  return String(value).trim();
};

const isEmptyValue = (value) =>
  value === "" || value === null || value === undefined || Number.isNaN(value);

const normalizeComparableText = (value) =>
  String(value || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ");

const normalizeFieldDefinition = (field) => {
  if (typeof field === "string") {
    return {
      label: field,
      key: field,
      options: [],
    };
  }

  return {
    label: field?.label || field?.key || "",
    key: field?.key || field?.label || "",
    options: Array.isArray(field?.options) ? field.options : [],
  };
};

const normalizeValueAgainstOptions = (value, options = []) => {
  if (typeof value !== "string" || !options.length) {
    return value;
  }

  const normalizedValue = normalizeComparableText(value);
  if (!normalizedValue) return value;

  const matchedOption = options.find(
    (option) => normalizeComparableText(option) === normalizedValue
  );

  return matchedOption ?? value;
};

const buildNestedPayload = (row) => {
  const payload = {};

  Object.entries(row).forEach(([rawKey, rawValue]) => {
    const key = normalizeHeader(rawKey);
    const value = normalizeCellValue(rawValue);

    if (isEmptyValue(value)) return;

    const segments = key.split(".").filter(Boolean);

    if (segments.length === 0) return;

    let target = payload;

    segments.forEach((segment, index) => {
      const isLeaf = index === segments.length - 1;

      if (isLeaf) {
        target[segment] = value;
        return;
      }

      if (!target[segment] || typeof target[segment] !== "object" || Array.isArray(target[segment])) {
        target[segment] = {};
      }

      target = target[segment];
    });
  });

  return payload;
};

const buildColumnLookup = (fields) =>
  fields.reduce((map, field) => {
    const normalizedLabel = normalizeHeader(field.label);
    const normalizedKey = normalizeHeader(field.key);

    if (normalizedLabel) map.set(normalizedLabel.toLowerCase(), field);
    if (normalizedKey) map.set(normalizedKey.toLowerCase(), field);

    return map;
  }, new Map());

const ExcelBulkImportButton = ({
  label = "Import Excel",
  description = "Upload an Excel file to create multiple records at once.",
  templateColumns = [],
  templateFields = [],
  sampleRow = null,
  createRecord,
  onImported,
  disabled = false,
}) => {
  const inputRef = useRef(null);
  const [isImporting, setIsImporting] = useState(false);
  const normalizedFields = (templateFields.length ? templateFields : templateColumns).map(normalizeFieldDefinition);
  const headerToFieldMap = buildColumnLookup(normalizedFields);

  const triggerFilePicker = () => {
    if (disabled || isImporting) return;
    inputRef.current?.click();
  };

  const downloadTemplate = () => {
    if (!normalizedFields.length) {
      toast.error("No template columns were provided for this page.");
      return;
    }

    const workbook = XLSX.utils.book_new();
    const headers = normalizedFields.map((field) => field.label);
    const templateWorksheet = XLSX.utils.aoa_to_sheet([headers]);
    XLSX.utils.book_append_sheet(workbook, templateWorksheet, "ImportTemplate");

    if (sampleRow && Object.keys(sampleRow).length > 0) {
      const sampleValues = normalizedFields.map((field) => {
        const value = sampleRow[field.key];
        return value === undefined || value === null ? "" : value;
      });
      const sampleWorksheet = XLSX.utils.aoa_to_sheet([headers, sampleValues]);
      XLSX.utils.book_append_sheet(workbook, sampleWorksheet, "SampleData");
    }

    XLSX.writeFile(workbook, `${label.replace(/\s+/g, "-").toLowerCase()}-template.xlsx`);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    setIsImporting(true);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
      const sheetName = workbook.SheetNames[0];

      if (!sheetName) {
        toast.error("The Excel file does not contain any sheets.");
        return;
      }

      const worksheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet, {
        defval: "",
        raw: true,
      });

      if (!rows.length) {
        toast.error("The selected sheet does not contain any data rows.");
        return;
      }

      let importedCount = 0;
      const failures = [];

      for (let index = 0; index < rows.length; index += 1) {
        const row = rows[index];
        const payload = buildNestedPayload(
          Object.fromEntries(
            Object.entries(row).map(([header, value]) => {
              const field = headerToFieldMap.get(normalizeHeader(header).toLowerCase());
              const fieldKey = field?.key || header;
              const normalizedValue = normalizeValueAgainstOptions(value, field?.options || []);

              return [fieldKey, normalizedValue];
            })
          )
        );

        if (!Object.keys(payload).length) {
          continue;
        }

        try {
          await createRecord(payload);
          importedCount += 1;
        } catch (error) {
          failures.push(`Row ${index + 2}: ${error?.response?.data?.message || error.message || "Import failed"}`);
        }
      }

      if (importedCount > 0) {
        toast.success(`Imported ${importedCount} record${importedCount === 1 ? "" : "s"} from Excel.`);
        onImported?.();
      }

      if (failures.length > 0) {
        toast.error(
          failures.length === rows.length
            ? `Import failed for all ${rows.length} row${rows.length === 1 ? "" : "s"}.`
            : `Imported ${importedCount} row${importedCount === 1 ? "" : "s"}, but ${failures.length} row${failures.length === 1 ? "" : "s"} failed.`
        );
        console.error(`Excel import failures for ${label}:`, failures);
      }
    } catch (error) {
      console.error(`Error importing ${label} from Excel:`, error);
      toast.error(error?.message || `Failed to import ${label} from Excel.`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button variant="outline" onClick={downloadTemplate} disabled={disabled || isImporting}>
        <Download className="mr-2 h-4 w-4" />
        Template
      </Button>
      <Button onClick={triggerFilePicker} disabled={disabled || isImporting}>
        {isImporting ? (
          <FileSpreadsheet className="mr-2 h-4 w-4 animate-pulse" />
        ) : (
          <Upload className="mr-2 h-4 w-4" />
        )}
        {isImporting ? "Importing..." : label}
      </Button>
      {description ? <span className="text-xs text-muted-foreground">{description}</span> : null}
    </div>
  );
};

export default ExcelBulkImportButton;
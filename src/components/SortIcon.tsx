import {
  CaretUpDownIcon,
  CaretUpIcon,
  CaretDownIcon,
} from "@phosphor-icons/react";

export type SortField = "sentence_idx" | "fault_level" | "confidence_score";
export type SortDir = "asc" | "desc";

interface SortIconProps {
  field: SortField;
  sortField: SortField;
  sortDir: SortDir;
}

const SortIcon = ({ field, sortField, sortDir }: SortIconProps) => {
  if (sortField !== field) {
    return (
      <CaretUpDownIcon
        className="w-3 h-3 text-gray-300 ml-1 inline"
        weight="bold"
      />
    );
  }
  return sortDir === "asc" ? (
    <CaretUpIcon
      className="w-3 h-3 text-amway-dark ml-1 inline"
      weight="bold"
    />
  ) : (
    <CaretDownIcon
      className="w-3 h-3 text-amway-dark ml-1 inline"
      weight="bold"
    />
  );
};

export default SortIcon;

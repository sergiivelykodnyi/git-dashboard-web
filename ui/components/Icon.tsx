import React, { type ComponentProps } from "react";

interface IconProps extends ComponentProps<"span"> {
  name: string;
  size?: number;
  fill?: boolean;
}

export function Icon({
  name,
  size,
  fill = false,
  className = "",
  style,
  ...props
}: IconProps) {
  const iconStyle: React.CSSProperties = {
    ...style,
  };

  if (size !== undefined) {
    iconStyle.fontSize = `${size}px`;
    iconStyle.width = `${size}px`;
    iconStyle.height = `${size}px`;
  }

  const symbolSettings: string[] = [];
  if (fill) {
    symbolSettings.push("'FILL' 1");
  } else {
    symbolSettings.push("'FILL' 0");
  }

  if (symbolSettings.length > 0) {
    iconStyle.fontVariationSettings = symbolSettings.join(", ");
  }

  return (
    <span
      className={`material-symbols-outlined select-none inline-flex items-center justify-center shrink-0 ${className}`}
      style={iconStyle}
      {...props}
    >
      {name}
    </span>
  );
}

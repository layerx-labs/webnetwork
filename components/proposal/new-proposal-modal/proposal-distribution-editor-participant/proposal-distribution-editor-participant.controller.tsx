import { useEffect, useState } from "react";
import {  NumberFormatValues } from "react-number-format";

import { User } from "interfaces/api";

import ProposalDistributionEditorParticipantView 
  from "./proposal-distribution-editor-participant.view";

interface ProposalDistributionEditorParticipantProps {
  user: User;
  label: string;
  defaultValue?: number;
  isDisable?: boolean;
  isRemovable?: boolean;
  onChangeDistribution(user: User, percentage: number): void;
  onRemoveParticipant: (user: User) => void;
}

export default function ProposalDistributionEditorParticipant({
  user,
  label,
  defaultValue,
  isDisable = false,
  isRemovable,
  onChangeDistribution,
  onRemoveParticipant,
}: ProposalDistributionEditorParticipantProps) {
  const [value, setValue] = useState<number>(defaultValue);

  function handleValueChange(params: NumberFormatValues) {
    setValue(params.floatValue);
    onChangeDistribution(user, params.floatValue);
  }

  function handleBlur() {
    let enhancedValue = value;
    if (value > 100) {
      enhancedValue = 100;
    }
    if (!value || value < 0) {
      enhancedValue = undefined;
    }

    setValue(enhancedValue);
    onChangeDistribution(user, enhancedValue);
  }

  useEffect(() => {
    if (defaultValue !== value)
      setValue(defaultValue);
  }, [defaultValue]);

  return(
    <ProposalDistributionEditorParticipantView
      user={user}
      label={label}
      value={value}
      isDisabled={isDisable}
      isRemovable={isRemovable}
      onBlur={handleBlur}
      onValueChange={handleValueChange}
      onRemoveParticipant={onRemoveParticipant}
    />
  );
}

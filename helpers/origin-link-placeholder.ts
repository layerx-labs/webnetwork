import { TFunction } from "next-i18next";

//The translation must have "bounty" initialized
export function getOriginLinkPlaceholder(translation: TFunction, type: string) {
  const placeholderPath = "bounty:fields.origin-link.placeholders"

  if(type === 'code') return translation(`${placeholderPath}.code`)
  if(type === 'design') return translation(`${placeholderPath}.design`)
  if(type === 'other') return translation(`${placeholderPath}.other`)

  return  translation(`${placeholderPath}.default`)
}
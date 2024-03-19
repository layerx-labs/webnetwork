import {SPAM_TERMS} from "./constants";

export default function isSpamValue(value: string|unknown) {
  return SPAM_TERMS.some(r => (value.toString()).match(r)?.length > 0)
}
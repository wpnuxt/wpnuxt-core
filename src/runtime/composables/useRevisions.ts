import { getContentNodes } from "./useWPContent";

const _useRevisions = async () => {

  return getContentNodes('Revisions')
}

export const useRevisions = _useRevisions

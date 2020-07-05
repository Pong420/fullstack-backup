import { RxFileToImageState } from 'use-rx-hooks';

type State = RxFileToImageState | string | null;
type UploadFile = string | File | null | undefined;
function getFileHandler(state?: State): UploadFile {
  return state ? (typeof state === 'string' ? state : state.file) : state;
}
export function getFile(state?: State): UploadFile;
export function getFile(state?: State[]): UploadFile[];
export function getFile(state?: State | State[]): UploadFile | UploadFile[] {
  return Array.isArray(state)
    ? state.map(getFileHandler)
    : getFileHandler(state);
}

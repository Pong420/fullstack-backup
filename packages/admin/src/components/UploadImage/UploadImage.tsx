import React, {
  useRef,
  useEffect,
  useMemo,
  DragEvent,
  ChangeEvent,
  ReactNode,
  HTMLAttributes
} from 'react';
import { fromEvent, merge, Subject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import {
  fromDropImageEvent,
  fromChangeEvent,
  useRxFileToImage,
  RxFileToImageState
} from 'use-rx-hooks';
import { useBoolean } from '../../hooks/useBoolean';

interface Context {
  upload: () => void;
}

export interface UploadImageProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onUpload'> {
  className?: string;
  children?: (context: Context) => ReactNode;
  onUpload?: (image: RxFileToImageState | null) => void;
  multiple?: boolean;
  dropArea?: boolean;
}

type UploadEvent = ChangeEvent | ClipboardEvent | DragEvent;

const nil = () => {};

function mapEvent(event: UploadEvent) {
  if (event.type === 'drop') {
    return fromDropImageEvent(event as DragEvent);
  }
  return fromChangeEvent(event as ChangeEvent<HTMLInputElement>);
}

export const UploadImage = React.memo<UploadImageProps>(
  ({
    children,
    className = '',
    dropArea,
    multiple,
    onUpload = nil,
    ...props
  }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [dropAreaShown, showDropArea, hideDropArea] = useBoolean();

    const subject = useRef(new Subject<UploadEvent>());

    const source$ = useMemo(() => subject.current.pipe(map(mapEvent)), []);

    const state = useRxFileToImage(source$);

    const { handleUpload, context } = useMemo(() => {
      return {
        handleUpload: (event: UploadEvent) => subject.current.next(event),
        context: {
          upload: () => {
            fileInputRef.current && fileInputRef.current.click();
          }
        }
      };
    }, []);

    useEffect(() => {
      state && onUpload(state);
      fileInputRef.current!.value = '';
    }, [state, onUpload]);

    useEffect(() => {
      if (dropArea) {
        const subscription = merge(
          fromEvent(window, 'dragover').pipe(
            tap(event => {
              event.preventDefault();
              showDropArea();
            })
          ),
          fromEvent(window, 'drop').pipe(
            tap(event => {
              event.preventDefault();
              hideDropArea();
            })
          )
        ).subscribe();

        return () => {
          subscription.unsubscribe();
        };
      }
    }, [dropArea, showDropArea, hideDropArea]);

    return (
      <div {...props} className={`upload ${className}`.trim()}>
        {children && children(context)}
        <input
          type="file"
          accept="images/*"
          hidden
          multiple={multiple}
          ref={fileInputRef}
          onChange={handleUpload}
        />
        {dropArea && (
          <div className="drop-area" hidden={!dropAreaShown}>
            <div className="drop-area-content" onDrop={handleUpload}>
              Drop Image Here
            </div>
          </div>
        )}
      </div>
    );
  }
);

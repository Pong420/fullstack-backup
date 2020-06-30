import React, {
  useRef,
  useEffect,
  useMemo,
  DragEvent,
  ChangeEvent,
  ReactNode,
  HTMLAttributes
} from 'react';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  fromDropImageEvent,
  fromChangeEvent,
  useRxFileToImage,
  RxFileToImageState
} from 'use-rx-hooks';

type Value = RxFileToImageState | null;

interface Context {
  value?: Value;
  upload: () => void;
}

export interface Control {
  value?: Value;
  onChange?: (image: Value) => void;
}

export interface UploadImageProps
  extends Control,
    Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'onUpload'> {
  children?: (context: Context) => ReactNode;
  className?: string;
  multiple?: boolean;
  dropArea?: boolean;
}

type UploadEvent = ChangeEvent | ClipboardEvent | DragEvent;

function mapEvent(event: UploadEvent) {
  if (event.type === 'drop') {
    return fromDropImageEvent(event as DragEvent);
  }
  return fromChangeEvent(event as ChangeEvent<HTMLInputElement>);
}

export function UploadImage({
  children,
  className = '',
  dropArea,
  multiple,
  value,
  onChange,
  ...props
}: UploadImageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { source$, handleUpload, context } = useMemo(() => {
    const subject = new Subject<UploadEvent>();
    return {
      source$: subject.pipe(map(mapEvent)),
      handleUpload: (event: UploadEvent) => subject.next(event),
      context: {
        upload: () => {
          fileInputRef.current && fileInputRef.current.click();
        }
      }
    };
  }, []);

  const state$ = useRxFileToImage(source$);

  useEffect(() => {
    const subscription = state$.subscribe(value => {
      onChange && onChange(value);
      fileInputRef.current!.value = '';
    });
    return () => subscription.unsubscribe();
  }, [state$, onChange]);

  return (
    <div {...props} className={`upload ${className}`.trim()}>
      {children && children({ value, ...context })}
      <input
        type="file"
        accept="images/*"
        hidden
        multiple={multiple}
        ref={fileInputRef}
        onChange={handleUpload}
      />
    </div>
  );
}

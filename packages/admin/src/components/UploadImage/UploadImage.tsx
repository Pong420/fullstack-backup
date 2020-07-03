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
  RxFileToImageState,
  useRxFileToImage
} from 'use-rx-hooks';

export type Value = RxFileToImageState | string | null;

interface Context<T> {
  value?: T;
  upload: () => void;
}

export interface Control<T> {
  value?: T;
  onChange?: (image: T) => void;
}

export interface Single extends Control<Value> {
  multiple?: false;
  children?: (context: Context<Value>) => ReactNode;
}

export interface Multi extends Control<Value[]> {
  multiple: true;
  children?: (context: Context<Value[]>) => ReactNode;
}

export interface BaseUploadImageProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'onUpload'> {
  className?: string;
  dropArea?: boolean;
}

type UploadImageProps = BaseUploadImageProps & (Single | Multi);

type UploadEvent = ChangeEvent | ClipboardEvent | DragEvent;

function mapEvent(event: UploadEvent) {
  if (event.type === 'drop') {
    return fromDropImageEvent(event as DragEvent);
  }
  return fromChangeEvent(event as ChangeEvent<HTMLInputElement>);
}

export function UploadImage(props: BaseUploadImageProps & Single): JSX.Element;
export function UploadImage(props: BaseUploadImageProps & Multi): JSX.Element;
export function UploadImage({
  className = '',
  dropArea,
  ...props
}: UploadImageProps) {
  const { multiple, children, value, onChange, ...divProps } = props;
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
      onChange && onChange((multiple ? value : value[0]) as any);
      fileInputRef.current!.value = '';
    });
    return () => subscription.unsubscribe();
  }, [state$, multiple, onChange]);

  return (
    <div {...divProps} className={`upload ${className}`.trim()}>
      {props.children &&
        (props.multiple
          ? props.children({ value: props.value, ...context })
          : props.children({ value: props.value, ...context }))}
      <input
        type="file"
        accept="images/*"
        hidden
        multiple={props.multiple}
        ref={fileInputRef}
        onChange={handleUpload}
      />
    </div>
  );
}

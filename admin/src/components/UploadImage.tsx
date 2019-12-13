import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  ReactNode,
  HTMLAttributes
} from 'react';
import { useRxUploadImage, RxFileToImageState } from 'use-rx-hooks';

export interface UploadImageProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onUpload'> {
  className?: string;
  children?: ReactNode;
  onUpload?: (image: RxFileToImageState | null) => void;
  multiple?: boolean;
}

const nil = () => {};

export const UploadImage = React.memo(
  React.forwardRef<HTMLInputElement | null, UploadImageProps>(
    ({ onUpload = nil, children, multiple, className = '', ...props }, ref) => {
      const fileInputRef = useRef<HTMLInputElement>(null);
      const [localState, inputProps] = useRxUploadImage();

      useEffect(() => {
        localState && onUpload(localState);
        fileInputRef.current!.value = '';
      }, [localState, onUpload]);

      useImperativeHandle(ref, () => fileInputRef.current);

      return (
        <div {...props} className={`upload ${className}`.trim()}>
          {children}
          <input
            type="file"
            accept="images/*"
            hidden
            multiple={multiple}
            ref={fileInputRef}
            {...inputProps}
          />
        </div>
      );
    }
  )
);

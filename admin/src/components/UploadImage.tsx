import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  ReactNode,
  HTMLAttributes
} from 'react';
import { useRxUploadImage, RxFileToImageState } from 'use-rx-hooks';

export interface UploadImageProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  className?: string;
  children?: ReactNode;
  onChange?: (image: RxFileToImageState | null) => void;
}

const nil = () => {};

export const UploadImage = React.memo(
  React.forwardRef<HTMLInputElement | null, UploadImageProps>(
    ({ onChange = nil, children, className = '', ...props }, ref) => {
      const fileInputRef = useRef<HTMLInputElement>(null);
      const [localState, inputProps] = useRxUploadImage();

      useEffect(() => {
        localState && onChange(localState);
        fileInputRef.current!.value = '';
      }, [localState, onChange]);

      useImperativeHandle(ref, () => fileInputRef.current);

      return (
        <div {...props} className={`upload ${className}`.trim()}>
          {children}
          <input type="file" hidden ref={fileInputRef} {...inputProps} />
        </div>
      );
    }
  )
);

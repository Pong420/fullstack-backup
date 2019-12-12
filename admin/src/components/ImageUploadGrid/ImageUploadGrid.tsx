import React, { useRef } from 'react';
import { RxFileToImageState } from 'use-rx-hooks';
import { Button, Dialog } from '@blueprintjs/core';
import { UploadImage } from '../UploadImage';
import { useBoolean } from '../../hooks/useBoolean';

interface Props {
  value?: Array<RxFileToImageState | string>;
  onChange?: (payload: Array<RxFileToImageState | string>) => void;
}

interface GridProps {
  src: string;
  onRemove: () => void;
}

const nil = () => {};

// TODO: drag to upload, paste ?

const Grid = React.memo<GridProps>(({ src, onRemove }) => {
  const [dialogOpen, setDialogOpen] = useBoolean();
  return (
    <div className="grid">
      <div
        className="grid-content"
        style={{ backgroundImage: `url(${src})` }}
      />
      <div className="grid-backdrop">
        <Button minimal icon="eye-open" onClick={setDialogOpen.on} />
        <Button minimal icon="cross" onClick={onRemove} />
      </div>
      <Dialog
        className="preview-image-dialog"
        isOpen={dialogOpen}
        onClose={setDialogOpen.off}
      >
        <img src={src} alt="" />
      </Dialog>
    </div>
  );
});

export const ImageUploadGrid = React.memo<Props>(
  ({ value = [], onChange = nil }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
      <div className="image-upload-grid">
        {value.map((payload, index) => {
          const src = typeof payload === 'string' ? payload : payload.url;
          return (
            <Grid
              src={src}
              key={index + '@@' + src}
              onRemove={() =>
                onChange([...value.slice(0, index), ...value.slice(index + 1)])
              }
            />
          );
        })}
        <UploadImage
          className="upload-grid"
          ref={fileInputRef}
          onChange={image => image && onChange([...value, image])}
        >
          <Button
            minimal
            className="grid-content"
            icon="plus"
            onClick={() => fileInputRef.current!.click()}
          />
        </UploadImage>
      </div>
    );
  }
);

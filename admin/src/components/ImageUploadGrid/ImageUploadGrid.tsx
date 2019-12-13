import React, { useRef } from 'react';
import { RxFileToImageState } from 'use-rx-hooks';
import { Button, Dialog } from '@blueprintjs/core';
import { UploadImage } from '../UploadImage';
import { Image } from '../Image';
import { Schema$ResponsiveImage, isResponsesiveImage } from '../../typings';
import { useBoolean } from '../../hooks/useBoolean';

interface Props {
  value?: Array<RxFileToImageState | Schema$ResponsiveImage>;
  onChange?: (
    payload: Array<RxFileToImageState | Schema$ResponsiveImage>
  ) => void;
}

interface GridProps {
  payload: Schema$ResponsiveImage | string;
  onRemove: () => void;
}

const nil = () => {};

// TODO: drag to upload, paste ?

const Grid = React.memo<GridProps>(({ payload, onRemove }) => {
  const [dialogOpen, setDialogOpen] = useBoolean();
  const [small, large] =
    typeof payload === 'string'
      ? [payload, payload]
      : [payload.small, payload.large];

  return (
    <div className="grid">
      <Image className="grid-content" url={small} />
      <div className="grid-backdrop">
        <Button minimal icon="eye-open" onClick={setDialogOpen.on} />
        <Button minimal icon="cross" onClick={onRemove} />
      </div>
      <Dialog
        className="preview-image-dialog"
        isOpen={dialogOpen}
        onClose={setDialogOpen.off}
      >
        <img src={large} alt="" />
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
          const _payload = isResponsesiveImage(payload) ? payload : payload.url;
          return (
            <Grid
              payload={_payload}
              key={index}
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

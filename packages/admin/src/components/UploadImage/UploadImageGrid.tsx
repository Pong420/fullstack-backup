import React from 'react';
import { Button, Dialog } from '@blueprintjs/core';
import { UploadImage, Value } from './UploadImage';
import { Image } from '../Image';
import { useBoolean } from '../../hooks/useBoolean';

interface Control {
  value?: Value[];
  onChange?: (payload: Value[]) => void;
}

interface GridProps {
  payload: Value;
  onRemove: () => void;
}

function UploadGrid({ payload, onRemove }: GridProps) {
  const [dialogOpen, openDialog, closeDialog] = useBoolean();
  const url = typeof payload === 'string' ? payload : payload && payload.url;

  if (url !== null) {
    const image = <Image src={url} size={1200} />;

    return (
      <div className="upload-grid">
        <Image
          className="upload-grid-image"
          src={url}
          size={400}
          thumbnal
          background
        />
        <div className="grid-backdrop">
          <Button minimal icon="eye-open" onClick={openDialog} />
          <Button minimal icon="cross" onClick={onRemove} />
        </div>
        <Dialog
          className="preview-image-dialog"
          isOpen={dialogOpen}
          onClose={closeDialog}
        >
          {image}
        </Dialog>
      </div>
    );
  }

  return null;
}

export function UploadImageGrid({ value, onChange }: Control) {
  const values = value || [];
  const handleChange = onChange || (() => {});

  return (
    <UploadImage
      className="upload-image-grid"
      multiple
      dropArea
      onChange={image => {
        handleChange([...values, ...(Array.isArray(image) ? image : [image])]);
      }}
    >
      {({ upload }) => (
        <div className="image-grid-container">
          {values.map((payload, index) => {
            return (
              <UploadGrid
                key={index}
                payload={payload}
                onRemove={() =>
                  handleChange([
                    ...values.slice(0, index),
                    ...values.slice(index + 1)
                  ])
                }
              />
            );
          })}
          <div className="upload-grid-button">
            <Button minimal icon="plus" onClick={upload} />
          </div>
        </div>
      )}
    </UploadImage>
  );
}

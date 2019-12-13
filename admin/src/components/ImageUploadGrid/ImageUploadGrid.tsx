import React, { useRef, useState, useEffect, useMemo } from 'react';
import { RxFileToImageState } from 'use-rx-hooks';
import { Button, Dialog } from '@blueprintjs/core';
import { UploadImage } from '../UploadImage';
import { CloudinaryImage } from '../CloudinaryImage';
import { useBoolean } from '../../hooks/useBoolean';

interface Props {
  value?: (RxFileToImageState | string)[];
  onChange?: (payload: Array<RxFileToImageState | string>) => void;
}

interface GridProps {
  payload: RxFileToImageState | string;
  index: number;
  onRemove: (index: number) => void;
}

const nil = () => {};

// TODO: drag to upload, paste ?

const Grid = React.memo<GridProps>(({ index, payload, onRemove }) => {
  const [dialogOpen, setDialogOpen] = useBoolean();

  const url = typeof payload === 'string' ? payload : payload.url;

  return (
    <div className="grid">
      <CloudinaryImage className="grid-content" url={url} width={150} />
      <div className="grid-backdrop">
        <Button minimal icon="eye-open" onClick={setDialogOpen.on} />
        <Button minimal icon="cross" onClick={() => onRemove(index)} />
      </div>
      <Dialog
        className="preview-image-dialog"
        isOpen={dialogOpen}
        onClose={setDialogOpen.off}
      >
        <CloudinaryImage img url={url} width={1200} />
      </Dialog>
    </div>
  );
});

// `onChange` passing from `FormItem` will always trigger, so cannot use as deps
export const ImageUploadGrid = React.memo<Props>(
  ({ value: initialValues = [], onChange = nil }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [values, setValues] = useState<(RxFileToImageState | string)[]>(
      initialValues
    );

    const [onUpload, onRemove] = useMemo(
      () => [
        (image: RxFileToImageState | null) => {
          image && setValues(curr => [...curr, image]);
        },
        (index: number) => {
          setValues(curr => [
            ...curr.slice(0, index),
            ...curr.slice(index + 1)
          ]);
        }
      ],
      []
    );

    useEffect(() => {
      onChange(values);
    }, [values]); // eslint-disable-line

    return (
      <div className="image-upload-grid">
        {values.map((payload, index) => {
          const _payload = typeof payload === 'string' ? payload : payload.url;
          return (
            <Grid
              index={index}
              key={_payload}
              payload={_payload}
              onRemove={onRemove}
            />
          );
        })}
        <UploadImage
          multiple
          className="upload-grid"
          ref={fileInputRef}
          onUpload={onUpload}
        >
          <Button
            minimal
            icon="plus"
            className="grid-content"
            onClick={() => fileInputRef.current!.click()}
          />
        </UploadImage>
      </div>
    );
  }
);

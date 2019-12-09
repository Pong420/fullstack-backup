import React, { useRef, useEffect } from 'react';
import { useRxUploadImage, RxFileToImageState } from 'use-rx-hooks';
import { IPopoverProps, Menu } from '@blueprintjs/core';
import { ButtonPopover } from '../../components/ButtonPopover';

export type OnAvatarChange = (image: RxFileToImageState | null) => void;

interface Props {
  avatar: string | null;
  onChange: OnAvatarChange;
}

const popoverProps: IPopoverProps = {
  popoverClassName: 'edit-avatar-popover',
  interactionKind: 'click',
  position: 'bottom-right'
};

export const EditAvatar = React.memo<Props>(({ avatar, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, inputProps] = useRxUploadImage();

  useEffect(() => {
    image && onChange(image);
    fileInputRef.current!.value = '';
  }, [image, onChange]);

  return (
    <>
      <ButtonPopover
        small
        minimal
        icon="edit"
        text="Edit"
        popoverProps={popoverProps}
        content={
          <Menu>
            <Menu.Item
              icon="upload"
              text="Upload a photo"
              onClick={() => fileInputRef.current!.click()}
            />
            <Menu.Item
              icon="trash"
              text="Remove photo"
              onClick={() => onChange(null)}
              disabled={!avatar}
            />
          </Menu>
        }
      />
      <input type="file" hidden ref={fileInputRef} {...inputProps} />
    </>
  );
});

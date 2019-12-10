import React, { useRef } from 'react';
import { RxFileToImageState } from 'use-rx-hooks';
import { IPopoverProps, Menu } from '@blueprintjs/core';
import { UploadImage, UploadImageProps } from '../../components/UploadImage';
import { ButtonPopover } from '../../components/ButtonPopover';

interface Props extends UploadImageProps {
  value?: RxFileToImageState;
}

export type OnAvatarChange = (image: RxFileToImageState | null) => void;

const popoverProps: IPopoverProps = {
  popoverClassName: 'edit-avatar-popover',
  interactionKind: 'click',
  position: 'bottom-right'
};

export const EditAvatar = React.memo<Props>(
  ({ value, onChange, children, ...props }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
      <UploadImage
        {...props}
        ref={fileInputRef}
        onChange={onChange}
        className="edit-avatar"
      >
        {children}
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
                onClick={() => onChange && onChange(null)}
                disabled={!value}
              />
            </Menu>
          }
        />
      </UploadImage>
    );
  }
);

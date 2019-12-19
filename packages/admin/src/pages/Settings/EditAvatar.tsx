import React from 'react';
import { RxFileToImageState } from 'use-rx-hooks';
import { IPopoverProps, Menu } from '@blueprintjs/core';
import { UploadImage, UploadImageProps } from '../../components/UploadImage';
import { ButtonPopover } from '../../components/ButtonPopover';

interface Props extends Omit<UploadImageProps, 'onChange' | 'children'> {
  value?: RxFileToImageState;
  onChange?: UploadImageProps['onUpload'];
  children?: React.ReactNode;
}

export type OnAvatarChange = (image: RxFileToImageState | null) => void;

const popoverProps: IPopoverProps = {
  popoverClassName: 'edit-avatar-popover',
  interactionKind: 'click',
  position: 'bottom-right'
};

export const EditAvatar = React.memo<Props>(
  ({ value, onChange, children, ...props }) => {
    return (
      <UploadImage {...props} onUpload={onChange} className="edit-avatar">
        {({ upload }) => (
          <>
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
                    onClick={upload}
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
          </>
        )}
      </UploadImage>
    );
  }
);

import React from 'react';
import { Avatar, AvatarProps } from '../../components/Avatar';
import { UploadImage, Control } from '../../components/UploadImage';
import { Button, Popover, Menu, MenuItem } from '@blueprintjs/core';

interface Props extends AvatarProps, Control {}

export function UpdateAvatar({ fallback, value, onChange }: Props) {
  return (
    <UploadImage className="update-avatar" value={value} onChange={onChange}>
      {({ value, upload }) => {
        return (
          <>
            <Avatar
              avatar={value && (typeof value === 'string' ? value : value.url)}
              fallback={fallback}
              size={150}
            />
            <Popover
              position="bottom-right"
              content={
                <Menu>
                  <MenuItem
                    icon="upload"
                    text="Upload a photo"
                    onClick={upload}
                  />
                  <MenuItem
                    icon="trash"
                    text="Remove photo"
                    disabled={!value}
                    onClick={() => onChange && onChange(null)}
                  />
                </Menu>
              }
            >
              <Button small minimal icon="edit" text="Edit" />
            </Popover>
          </>
        );
      }}
    </UploadImage>
  );
}

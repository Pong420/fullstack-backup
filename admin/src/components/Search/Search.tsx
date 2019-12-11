import React, { useCallback, useRef } from 'react';
import { Overlay, Icon, Classes } from '@blueprintjs/core';
import { ButtonPopover } from '../ButtonPopover';
import { useBoolean } from '../../hooks/useBoolean';
import { useMouseTrap } from '../../hooks/useMouseTrap';

export interface SearchProps {
  suffix?: string;
  value?: string;
  onChange?: (search: string) => void;
}

const hotKey = 'p';

export const Search = ({
  suffix = '',
  value,
  onChange = () => {}
}: SearchProps) => {
  const [isOpen, { on, off }] = useBoolean();
  const inputRef = useRef<HTMLInputElement>(null);

  const search = useCallback(() => {
    off();
    onChange(inputRef.current!.value);
  }, [off, onChange]);

  useMouseTrap(isOpen ? 'enter' : '', search);
  useMouseTrap(isOpen ? '' : `shift+${hotKey}`, on);

  return (
    <>
      {!value ? (
        <ButtonPopover
          minimal
          icon="search"
          content={
            <div className="search-tooltips">
              Search {suffix} ( {<Icon icon="key-shift" />}
              <span>{hotKey}</span>)
            </div>
          }
          onClick={on}
        />
      ) : (
        <ButtonPopover
          minimal
          icon="delete"
          content="Clear Search"
          onClick={() => onChange('')}
        />
      )}
      <Overlay
        className="search-overlay"
        onClose={off}
        isOpen={isOpen}
        transitionDuration={100}
      >
        <div className="search-overlay-content">
          <div className={[Classes.INPUT_GROUP, Classes.LARGE].join(' ')}>
            <Icon icon="search" />
            <input
              autoFocus
              type="text"
              placeholder={`Search ${suffix} ...`}
              ref={inputRef}
              className={Classes.INPUT}
              defaultValue={value}
            />
          </div>
        </div>
      </Overlay>
    </>
  );
};

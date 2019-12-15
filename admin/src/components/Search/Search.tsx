import React, { useCallback, useRef } from 'react';
import { Overlay, Icon, Classes } from '@blueprintjs/core';
import { ButtonPopover } from '../ButtonPopover';
import { useBoolean } from '../../hooks/useBoolean';
import { useMouseTrap } from '../../hooks/useMouseTrap';
import { useQuery } from '../../hooks/useQuery';

export interface SearchProps {
  suffix?: string;
}

const hotKey = 'p';

export const Search = React.memo(({ suffix = '' }: SearchProps) => {
  const [isOpen, { on, off }] = useBoolean();
  const inputRef = useRef<HTMLInputElement>(null);
  const [{ search }, setQuery] = useQuery();

  const callSearch = useCallback(() => {
    off();
    setQuery({ pageNo: undefined, search: inputRef.current!.value });
  }, [off, setQuery]);

  const open = useCallback(() => {
    !document.body.classList.contains(Classes.OVERLAY_OPEN) && on();
  }, [on]);

  useMouseTrap(isOpen ? 'enter' : '', callSearch);
  useMouseTrap(isOpen ? '' : `shift+${hotKey}`, open);

  return (
    <>
      {!search ? (
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
          onClick={() => setQuery({ search: '' })}
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
              defaultValue={search}
            />
          </div>
        </div>
      </Overlay>
    </>
  );
});

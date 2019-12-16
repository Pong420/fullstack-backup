import React, { useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Overlay, Icon, Classes } from '@blueprintjs/core';
import { searchParamSelector } from '../../store';
import { ButtonPopover } from '../ButtonPopover';
import { useBoolean } from '../../hooks/useBoolean';
import { useMouseTrap } from '../../hooks/useMouseTrap';
import { useSearchParam } from '../../hooks/useSearchParam';

export interface SearchProps {
  suffix?: string;
}

const hotKey = 'p';

export const Search = React.memo(({ suffix = '' }: SearchProps) => {
  const [isOpen, { on, off }] = useBoolean();
  const inputRef = useRef<HTMLInputElement>(null);
  const { search } = useSelector(searchParamSelector);
  const { setSearchParam } = useSearchParam();

  const setSearch = useCallback(() => {
    off();
    setSearchParam({ pageNo: undefined, search: inputRef.current!.value });
  }, [off, setSearchParam]);

  const open = useCallback(() => {
    !document.body.classList.contains(Classes.OVERLAY_OPEN) && on();
  }, [on]);

  useMouseTrap(isOpen ? 'enter' : '', setSearch);
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
          onClick={() => setSearchParam({ search: '' })}
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

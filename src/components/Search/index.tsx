import React, { useRef } from 'react';
import debounce from 'lodash.debounce';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchValue } from '../../redux/slices/filtersAndSortSlice';

import SearchPopupItem from '../SearchPopupItem';

import emptyImg from '../../assets/img/searchEmpty.png';

import styles from './Search.module.scss';
import root from './SearchPopupEmpty.module.scss';

import axios from 'axios';
import { Link } from 'react-router-dom';
import { RootState } from '../../redux/store';

interface IBurger {
  id: number;
  title: string;
  imageUrl: string;
  price: number;
}

const Search: React.FC = () => {
  const dispatch = useDispatch();
  const searchValue = useSelector((state: RootState) => state.filtersAndSortSlice.searchValue);
  const [searchPopupOpen, setSearchPopupOpen] = React.useState(false);
  const [searchPopupItems, setSearchPopupItems] = React.useState<IBurger[]>([]);

  const [isLoading, setIsLoading] = React.useState(false);

  const [inputValue, setInputValue] = React.useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        event.target !== inputRef.current
      ) {
        setSearchPopupOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  React.useEffect(() => {
    // Делаем запрос только если есть поисковый запрос
    if (searchValue && searchValue.length > 0) {
      setSearchPopupOpen(true);
      setIsLoading(true);

      // Используем searchValue в URL!
      axios
        .get(`https://90746f9cd0776131.mokky.dev/burgers?title=*${searchValue}*`)
        .then((res) => {
          setSearchPopupItems(res.data);
        })
        .catch(() => {
          setSearchPopupItems([]); // На случай ошибки
        })
        .finally(() => {
          setIsLoading(false); // Заканчиваем загрузку
        });
    } else {
      setSearchPopupOpen(false);
      setSearchPopupItems([]);
      setIsLoading(false);
    }
  }, [searchValue]);

  const handleInputFocus = () => {
    if (inputValue && inputValue.length > 0) {
      setSearchPopupOpen(true);
    }
  };

  const onClickClearIcon = () => {
    dispatch(setSearchValue(''));
    setInputValue('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
    //  или можно так, оператор опциональной последовательности
    //  inputRef.current?.focus();
  };

  const updateSearchValue = React.useCallback(
    debounce((str: string) => {
      dispatch(setSearchValue(str));
    }, 500),
    [],
  );

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    updateSearchValue(event.target.value);
  };

  const onClickSearchPopupItem = () => {
    setSearchPopupOpen(false);
    setInputValue('');
    dispatch(setSearchValue('')); // очищаем и в Redux
    inputRef.current?.blur(); // убираем фокус
  };

  return (
    <div className={styles.search}>
      {inputValue && (
        <svg
          onClick={onClickClearIcon}
          className={styles.clearIcon}
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M38 12.83l-2.83-2.83-11.17 11.17-11.17-11.17-2.83 2.83 11.17 11.17-11.17 11.17 2.83 2.83 11.17-11.17 11.17 11.17 2.83-2.83-11.17-11.17z" />
          <path d="M0 0h48v48h-48z" fill="none" />
        </svg>
      )}
      {!inputValue && (
        <svg
          className={styles.searchSvg}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 16 16"
          data-v-ffa16fa5="">
          <path
            fill="#d7c7b4"
            fillRule="evenodd"
            d="M10.618 12.032a5.5 5.5 0 1 1 1.414-1.414l2.21 2.21a1 1 0 0 1-1.414 1.415zM11.5 7.5a4 4 0 1 1-8 0 4 4 0 0 1 8 0"
            clipRule="evenodd"
          />
        </svg>
      )}
      <input
        ref={inputRef}
        value={inputValue}
        onFocus={handleInputFocus}
        onChange={onChangeInput}
        className={styles.input}
        placeholder="Поиск по меню"
      />

      {/* Показываем popup только когда есть поиск и он открыт */}

      {searchPopupOpen && inputValue && (
        <div className={styles.popup} ref={popupRef}>
          {isLoading ? ( // Показываем индикатор загрузки
            <div className={root.loading}>
              <div className={root.skeleton}></div>
              <div className={root.skeleton}></div>
              <div className={root.skeleton}></div>
            </div>
          ) : searchPopupItems.length > 0 ? (
            searchPopupItems.map((obj) => (
              <SearchPopupItem
                onClickSearchPopupItem={onClickSearchPopupItem}
                key={obj.id}
                {...obj}
              />
            ))
          ) : (
            <div className={root.emptyPopup}>
              <img src={emptyImg} alt="search empty" />
              <div className={root.title}>Ничего не нашлось</div>
              <div className={root.subtitle}>
                Скорректируй запрос <br /> или посмотри в меню
              </div>
              <Link to="/">
                <button className={root.emptyBtn} onClick={onClickSearchPopupItem}>
                  <svg
                    className={root.burgerSvg}
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="24"
                    fill="none"
                    viewBox="0 0 25 24">
                    <path
                      fill="#f5ebdc"
                      d="M14.398 3.015a.75.75 0 1 0-.295 1.47l1.897.38v.885a.75.75 0 0 0 1.5 0V4.66a1.25 1.25 0 0 0-1.005-1.226zM20.5 7h-7c-1 0-1.212.522-1.132 1.673C14.734 9.14 17 11 16.668 13.35c.79 1.177.954 2.532.029 3.734-.044 1.166-.206 2.144-1.197 2.916h5l.985-11.737C21.511 7.622 21.26 7 20.5 7"
                    />
                    <path
                      fill="#f5ebdc"
                      d="M12.5 18c-1-.007-4.241-.006-5 0-.758.006-2.57-.101-3.293-.33C3.961 19.46 6 20 7.5 20h5c2 0 3.269-.332 3.366-2.161-.66.161-2.365.168-3.365.16M13 17H7c-1 0-2.5 0-3-.5s-.445-1.907-.289-2.255c.436.441.79.755 1.79.755h9c.962 0 1.28-.263 1.75-.65l.056-.046C16.79 15.028 16.5 16 16 16.5s-2 .5-3 .5M4.201 12.78c0 1.187 1.321 1.22 2.3 1.22h7q.085 0 .21.004c.684.02 2.146.062 2.146-.848 0-2.61-2.564-3.905-5.817-3.905-1.492.011-5.839.41-5.839 3.529"
                    />
                  </svg>
                  В меню
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;

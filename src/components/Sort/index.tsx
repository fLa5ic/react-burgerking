import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SelectedSortTypeEnum, setSelectedSort } from '../../redux/slices/filtersAndSortSlice';

import cn from 'classnames';
import styles from './Sort.module.scss';
import { RootState } from '../../redux/store';

type SortListItem = {
  name: string;
  sortProperty: SelectedSortTypeEnum;
};

export const sortList: SortListItem[] = [
  { name: 'цене (DESC)', sortProperty: SelectedSortTypeEnum.PRICE_DESC },
  { name: 'цене (ASC)', sortProperty: SelectedSortTypeEnum.PRICE_ASC },
  { name: 'алфавиту (DESC)', sortProperty: SelectedSortTypeEnum.TITLE_DESC },
  { name: 'алфавиту (ASC)', sortProperty: SelectedSortTypeEnum.TITLE_ASC },
];

const Sort: React.FC = () => {
  const dispatch = useDispatch();
  const selectedSort = useSelector((state: RootState) => state.filtersAndSortSlice.selectedSort);

  const [openSort, setOpenSort] = React.useState(false);

  const onClickSort = (obj: SortListItem) => {
    dispatch(setSelectedSort(obj));
    setOpenSort(false);
  };

  return (
    <div className={styles.sortWrapper}>
      <div className={styles.sort} onClick={() => setOpenSort(!openSort)}>
        <div className={cn(styles.arrowSvg, { [styles.rotated]: openSort })}>
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10 5C10 5.16927 9.93815 5.31576 9.81445 5.43945C9.69075 5.56315 9.54427 5.625 9.375 5.625H0.625C0.455729 5.625 0.309245 5.56315 0.185547 5.43945C0.061849 5.31576 0 5.16927 0 5C0 4.83073 0.061849 4.68424 0.185547 4.56055L4.56055 0.185547C4.68424 0.061849 4.83073 0 5 0C5.16927 0 5.31576 0.061849 5.43945 0.185547L9.81445 4.56055C9.93815 4.68424 10 4.83073 10 5Z"
              fill="#2C2C2C"
            />
          </svg>
        </div>
        <div className={styles.title}>Сортировка по:</div>
        <span>{selectedSort?.name}</span>
      </div>
      {openSort && (
        <div className={styles.popup}>
          {sortList.map((obj, i) => (
            <p
              key={i}
              onClick={() => onClickSort(obj)}
              className={selectedSort.sortProperty === obj.sortProperty ? 'active' : ''}>
              {obj.name}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sort;

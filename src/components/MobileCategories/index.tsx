import React from 'react';

import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useAppDispatch } from '../../redux/store';
import { setCategoryIdAndName } from '../../redux/slices/filtersAndSortSlice';

import popularImg from '../../assets/img/menuImages/popular.svg';
import newImg from '../../assets/img/menuImages/1.webp';
import comboImg from '../../assets/img/menuImages/2.webp';
import burgersImg from '../../assets/img/menuImages/3.webp';
import shrimpsImg from '../../assets/img/menuImages/4.webp';
import rollsImg from '../../assets/img/menuImages/5.webp';
import sousImg from '../../assets/img/menuImages/6.webp';
import kartofelImg from '../../assets/img/menuImages/7.webp';

import styles from './MobileCategories.module.scss';

const MobileCategories: React.FC = () => {
  const dispatch = useAppDispatch();
  const categoryId = useSelector((state: RootState) => state.filtersAndSortSlice.categoryId);

  type MobileCategoriesItem = {
    id: number;
    categoryName: string;
    img: string;
  };

  const mobileCategories: MobileCategoriesItem[] = [
    { id: 0, categoryName: 'Популярное', img: popularImg },
    { id: 1, categoryName: 'Новинки', img: newImg },
    { id: 2, categoryName: 'Кинг Комбо', img: comboImg },
    { id: 3, categoryName: 'Бургеры', img: burgersImg },
    { id: 4, categoryName: 'Креветки', img: shrimpsImg },
    { id: 5, categoryName: 'Роллы', img: rollsImg },
    { id: 6, categoryName: 'Соусы', img: sousImg },
    { id: 7, categoryName: 'Картофель', img: kartofelImg },
  ];

  const handleChangeMobileCategory = (id: number, name: string) => {
    dispatch(setCategoryIdAndName({ id, name }));
  };

  return (
    <div className="container">
      <div className={styles.mobileCategories}>
        {mobileCategories.map((item) => (
          <div
            key={item.id}
            onClick={() => handleChangeMobileCategory(item.id, item.categoryName)}
            className={
              categoryId === item.id
                ? styles.mobileCategories__item + ' ' + styles.active
                : styles.mobileCategories__item
            }>
            <div className={styles.img__wrapper}>
              <img src={item.img} alt={item.categoryName} />
            </div>
            {item.categoryName}
          </div>
        ))}
      </div>
    </div>
  );
};
export default MobileCategories;

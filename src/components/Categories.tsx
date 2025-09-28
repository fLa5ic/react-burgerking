import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCategoryIdAndName } from '../redux/slices/filtersAndSortSlice';

import popularImg from '../assets/img/menuImages/popular.svg';
import newImg from '../assets/img/menuImages/1.webp';
import comboImg from '../assets/img/menuImages/2.webp';
import burgersImg from '../assets/img/menuImages/3.webp';
import shrimpsImg from '../assets/img/menuImages/4.webp';
import rollsImg from '../assets/img/menuImages/5.webp';
import sousImg from '../assets/img/menuImages/6.webp';
import kartofelImg from '../assets/img/menuImages/7.webp';
import { RootState } from '../redux/store';

type CategoriesItem = {
  id: number;
  categoryName: string;
  img: string;
};

const categories: CategoriesItem[] = [
  { id: 0, categoryName: 'Популярное', img: popularImg },
  { id: 1, categoryName: 'Новинки', img: newImg },
  { id: 2, categoryName: 'Кинг Комбо', img: comboImg },
  { id: 3, categoryName: 'Бургеры', img: burgersImg },
  { id: 4, categoryName: 'Креветки', img: shrimpsImg },
  { id: 5, categoryName: 'Роллы', img: rollsImg },
  { id: 6, categoryName: 'Соусы', img: sousImg },
  { id: 7, categoryName: 'Картофель', img: kartofelImg },
];

const Categories: React.FC = () => {
  const dispatch = useDispatch();
  const categoryId = useSelector((state: RootState) => state.filtersAndSortSlice.categoryId);

  const handleCategoryChange = (id: number, name: string) => {
    dispatch(setCategoryIdAndName({ id, name }));
  };

  return (
    <div className="content-categories">
      {categories.map((item) => (
        <div
          key={item.id}
          onClick={() => handleCategoryChange(item.id, item.categoryName)}
          className={
            categoryId === item.id ? 'content-categories__item active' : 'content-categories__item'
          }>
          <img src={item.img} width={48} alt={item.categoryName} />
          {item.categoryName}
        </div>
      ))}
    </div>
  );
};

export default Categories;

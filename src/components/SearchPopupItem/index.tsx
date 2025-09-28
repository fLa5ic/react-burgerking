import React from 'react';
import { Link } from 'react-router-dom';

import styles from './SearchPopupItem.module.scss';

interface IBurger {
  id: number;
  title: string;
  imageUrl: string;
  price: number;
}

// Используй в обоих местах
type SearchPopupItemProps = IBurger & {
  onClickSearchPopupItem: () => void;
};

const SearchPopupItem: React.FC<SearchPopupItemProps> = ({
  id,
  title,
  imageUrl,
  price,
  onClickSearchPopupItem,
}) => {
  return (
    <Link to={`/item/${id}`}>
      <div className={styles.item} onClick={onClickSearchPopupItem}>
        <img src={imageUrl} alt="Фото товара" />
        <div className={styles.right}>
          <div className={styles.title}>{title}</div>
          <div className={styles.price}>{price} руб.</div>
        </div>
      </div>
    </Link>
  );
};
export default SearchPopupItem;

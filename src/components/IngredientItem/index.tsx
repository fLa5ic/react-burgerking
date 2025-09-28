import React from 'react';

import styles from './IngredientItem.module.scss';

type IngredientItemProps = {
  name: string;
  price: number;
  image: string;
  isSelected: boolean;
  onClick: () => void;
};

const IngredientItem: React.FC<IngredientItemProps> = ({
  name,
  price,
  image,
  isSelected,
  onClick,
}) => {
  return (
    <div className={styles.ingredientItem}>
      <div className={styles.price}>{price} руб.</div>
      <img src={image} alt="Ингредиент фото" />
      <div className={styles.title}>{name}</div>
      <button
        className={isSelected ? styles.addedIngredient : styles.addIngredient}
        type="button"
        onClick={onClick}>
        + Добавить
      </button>
    </div>
  );
};
export default IngredientItem;

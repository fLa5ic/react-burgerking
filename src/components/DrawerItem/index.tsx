import React from 'react';
import { Link } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import {
   removeItem,
   setOpenDrawer,
   incrementItemDrawer,
   decrementItemDrawer,
} from '../../redux/slices/drawerSlice';

import styles from './DraverItem.module.scss';

export interface IIngredient {
   id: number;
   name: string;
   price: number;
   image: string;
}

type DrawerItemProps = {
   itemId: number;
   uniqueKey: string | null;
   title: string;
   basePrice: number;
   imageUrl: string;
   count: number;
   addedIngredients: IIngredient[];
   removedIngredients: IIngredient[];
   addedIds: number[];
   addIngredients: IIngredient[];
   removeIngredients?: IIngredient[];
};

const DrawerItem: React.FC<DrawerItemProps> = ({
   itemId,
   uniqueKey,
   title,
   basePrice,
   imageUrl,
   count,
   addedIngredients,
   removedIngredients,
   addedIds,
   addIngredients,
   removeIngredients,
}) => {
   const dispatch = useDispatch();

   // Функция расчета итоговой цены
   const calculateTotalPrice = () => {
      const baseTotal = basePrice * count;

      // Добавляем стоимость добавленных ингредиентов
      const ingredientsTotal = (addedIds || []).reduce((sum, id) => {
         const ingredient = (addIngredients || []).find((ing) => ing.id === id);
         return sum + (ingredient ? ingredient.price * count : 0);
      }, 0);

      return (baseTotal + ingredientsTotal).toFixed(2);
   };

   const onClickPlus = () => {
      dispatch(
         incrementItemDrawer({
            uniqueKey, // если есть
            itemId, // всегда передавай
            addedIds, // для пересчета цены
         }),
      );
   };

   const onClickMinus = () => {
      dispatch(
         decrementItemDrawer({
            uniqueKey, // если есть
            itemId, // всегда передавай
            addedIds, // для пересчета цены
         }),
      );
   };

   const onClickRemove = () => {
      if (window.confirm('Ты действительно хочешь удалить товар?')) {
         dispatch(
            removeItem({
               uniqueKey, // если есть
               itemId, // всегда передавай для старых товаров
            }),
         );
      }
   };

   const onClickChange = () => {
      dispatch(setOpenDrawer(false));
   };

   return (
      <div className={styles.drawerItem}>
         <div className={styles.image}>
            <img src={imageUrl} alt={title} />
         </div>
         <div className={styles.productInfo}>
            <div className={styles.top}>
               <div className={styles.title}>{title}</div>
               <svg
                  onClick={onClickRemove}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24px"
                  height="24px"
                  fill="#502314">
                  <path
                     clip-rule="evenodd"
                     d="m12 13.414 5.657 5.657a1 1 0 0 0 1.414-1.414L13.414 12l5.657-5.657a1 1 0 0 0-1.414-1.414L12 10.586 6.343 4.929A1 1 0 0 0 4.93 6.343L10.586 12 4.93 17.657a1 1 0 1 0 1.414 1.414L12 13.414Z"></path>
               </svg>
            </div>
            <div
               className={
                  addedIngredients.length > 0 || removedIngredients.length > 0
                     ? styles.removeAddedIng
                     : styles.removeAddedIngHidden
               }>
               {addedIngredients.map((ing) => (
                  <p key={ing.id}>+ {ing.name}</p>
               ))}
               {removedIngredients.map((ing) => (
                  <p key={ing.id}>- {ing.name}</p>
               ))}
            </div>
            <div className={styles.bottom}>
               <Link to={`/item/${itemId}`} onClick={onClickChange} className={styles.changeBtn}>
                  Изменить
               </Link>
               <div className={styles.counterAndPrice}>
                  <div className={styles.counter}>
                     <svg
                        onClick={onClickMinus}
                        className={count === 1 ? styles.minus : styles.minusActive}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24">
                        <path d="M6.864 13.002a.967.967 0 0 1-.712-.288.968.968 0 0 1-.288-.712c0-.284.096-.521.288-.713a.967.967 0 0 1 .712-.287h12c.284 0 .521.095.713.287.191.192.287.43.287.713s-.096.52-.287.712a.968.968 0 0 1-.713.288h-12Z"></path>
                     </svg>
                     <div className={styles.count}>{count}</div>
                     <svg
                        onClick={onClickPlus}
                        className={styles.plus}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24">
                        <path d="M12.002 19.002a.967.967 0 0 1-.713-.288.968.968 0 0 1-.287-.712v-5h-5a.967.967 0 0 1-.713-.288.968.968 0 0 1-.287-.712c0-.284.096-.521.287-.713a.967.967 0 0 1 .713-.287h5v-5c0-.284.096-.521.287-.713a.967.967 0 0 1 .713-.287c.283 0 .52.096.712.287.192.192.288.43.288.713v5h5c.283 0 .52.095.713.287.191.192.287.43.287.713s-.096.52-.287.712a.968.968 0 0 1-.713.288h-5v5c0 .283-.096.52-.288.712a.968.968 0 0 1-.712.288Z"></path>
                     </svg>
                  </div>
                  <div className={styles.price}>{calculateTotalPrice()} руб.</div>
               </div>
            </div>
         </div>
      </div>
   );
};
export default DrawerItem;

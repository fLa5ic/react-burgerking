import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { useDispatch } from 'react-redux';
import { addItem } from '../../redux/slices/drawerSlice';

import IngredientItem from '../IngredientItem';
import styles from './ItemPageBlock.module.scss';
import arrowSvg from '../../assets/img/arrow.svg';
import deleteSvg from '../../assets/img/delete.svg';
// import addIngredient from '../../assets/img/addIngredient.svg';

interface IIngredient {
   id: number;
   name: string;
   price: number;
   image: string;
}

interface IItemData {
   id: number;
   title: string;
   imageUrl: string;
   price: number;
   weight: number;
   allergens: string;
   info: string;
   kbju: number[];
   addIngredients: IIngredient[];
   removeIngredients: IIngredient[];
}

interface ItemPageBlockProps {
   itemId: string;
}

const ItemPageBlock: React.FC<ItemPageBlockProps> = ({ itemId }) => {
   const dispatch = useDispatch();

   const [itemData, setItemData] = React.useState<IItemData | null>(null);
   const [isLoading, setIsLoading] = React.useState(true);

   const [itemCount, setItemCount] = React.useState(1);

   // Храним массив ID удаленных ингредиентов
   const [removedIds, setRemovedIds] = React.useState<number[]>([]);
   const [addedIds, setAddedIds] = React.useState<number[]>([]);

   const [showPopup, setShowPopup] = React.useState(false);
   const [isFading, setIsFading] = React.useState(false);

   const [isMobile, setIsMobile] = React.useState(false);

   React.useEffect(() => {
      const checkScreenSize = () => {
         setIsMobile(window.innerWidth < 768);
      };

      checkScreenSize();
      window.addEventListener('resize', checkScreenSize);

      return () => window.removeEventListener('resize', checkScreenSize);
   }, []);

   const onClickAddToDrawer = () => {
      if (!itemData) return;

      // ФИКС: создаем копии массивов перед сортировкой
      const uniqueKey =
         addedIds.length > 0 || removedIds.length > 0
            ? `${itemData.id}-${[...addedIds].sort().join(',')}-${[...removedIds].sort().join(',')}`
            : null;

      const item = {
         itemId: itemData.id,
         title: itemData.title,
         basePrice: itemData.price,
         price: itemData.price * itemCount,
         imageUrl: itemData.imageUrl,
         count: itemCount,
         addedIds, // ← массив ID добавленных ингредиентов
         removedIds, // ← массив ID удаленных ингредиентов
         uniqueKey,
         addIngredients: itemData.addIngredients, // ← все возможные добавленные
         removeIngredients: itemData.removeIngredients, // ← все возможные удаленные
         addedIngredients: [], // ← добавь пустой массив
         removedIngredients: [],
      };
      dispatch(addItem(item));

      setShowPopup(true);
      setIsFading(false);

      setTimeout(() => {
         setIsFading(true);
         setTimeout(() => setShowPopup(false), 300);
      }, 1700);
   };

   React.useEffect(() => {
      setAddedIds([]);
      setRemovedIds([]);
      setItemCount(1);

      if (itemId) {
         setIsLoading(true);
         axios
            .get(`https://90746f9cd0776131.mokky.dev/burgers/${itemId}`)
            .then((response) => {
               setItemData(response.data);
            })
            .catch((error) => {
               console.error('Ошибка при загрузке данных товара:', error);
               alert('Не удалось загрузить данные о товаре');
            })
            .finally(() => {
               setIsLoading(false);
            });
      }
   }, [itemId]);

   const onClickPlus = () => {
      setItemCount(itemCount + 1);
   };

   const onClickMinus = () => {
      if (itemCount > 1) {
         setItemCount(itemCount - 1);
      }
   };

   // Пока данные грузятся, показываем заглушку
   if (isLoading) {
      return <div className={styles.loading}>Загрузка информации о бургере...</div>;
   }

   // Если данные не загрузились (например, товар не найден)
   if (!itemData) {
      return <div className={styles.error}>Товар не найден.</div>;
   }

   const { title, imageUrl, weight, allergens, info, price, addIngredients } = itemData;

   const handleIngredientClick = (id: number) => {
      setRemovedIds((prev) => {
         // Если ID уже есть в массиве - убираем его (отменяем удаление)
         if (prev.includes(id)) {
            return prev.filter((ingId) => ingId !== id);
         } else {
            // Если нет - добавляем (удаляем ингредиент)
            return [...prev, id];
         }
      });
   };

   const handleIngredientAdd = (id: number) => {
      setAddedIds((prev) => {
         if (prev.includes(id)) {
            return prev.filter((ingAddId) => ingAddId !== id);
         } else {
            return [...prev, id];
         }
      });
   };

   const calculateTotalPrice = () => {
      const baseTotal = price * itemCount;

      // Защита от undefined
      const ingredientsTotal = (addedIds || []).reduce((sum, id) => {
         const ingredient = (itemData.addIngredients || []).find((ing) => ing.id === id);
         return sum + (ingredient ? ingredient.price * itemCount : 0);
      }, 0);

      return (baseTotal + ingredientsTotal).toFixed(2);
   };

   if (isMobile) {
      return (
         <>
            <div className={styles.nav}>
               {showPopup && (
                  <div className={`${styles.addedPopup} ${isFading ? styles.fadeOut : ''}`}>
                     Добавлено: {itemData.title} ✅
                  </div>
               )}
               <Link to="/" className={styles.link}>
                  Главная
               </Link>
               <img src={arrowSvg} alt="" />
               <div className={styles.notActive}>{title}</div>
            </div>
            <div className={styles.content}>
               <div className={styles.title}>{title}</div>
               <img src={imageUrl} alt={`Фото блюда: ${title}`} />
               <div className={styles.footnote}>* Вариант иллюстрации компоновки блюд</div>
               <div className={styles.title}>Добавить ингредиенты</div>
               <div className={styles.itemsWrap}>
                  {addIngredients.map((ingredient) => (
                     <IngredientItem
                        isSelected={addedIds.includes(ingredient.id)}
                        onClick={() => handleIngredientAdd(ingredient.id)}
                        key={ingredient.id}
                        {...ingredient}
                     />
                  ))}
               </div>
            </div>
         </>
      );
   }

   return (
      <>
         <div className={styles.nav}>
            {showPopup && (
               <div className={`${styles.addedPopup} ${isFading ? styles.fadeOut : ''}`}>
                  Добавлено: {itemData.title} ✅
               </div>
            )}
            <Link to="/" className={styles.link}>
               Главная
            </Link>
            <img src={arrowSvg} alt="" />
            <div className={styles.notActive}>{title}</div>
         </div>
         <div className={styles.content}>
            <div className={styles.left}>
               <img src={imageUrl} alt={`Фото блюда: ${title}`} />
               <div className={styles.footnote}>* Вариант иллюстрации компоновки блюд</div>
               <div className={styles.weightInfo}>
                  <div className={styles.title}>Вес: {weight} г</div>
                  <div className={styles.kbju}>
                     <div className={styles.title}>На 100г продукта</div>
                     <div className={styles.items}>
                        <div className={styles.item}>
                           <p>кКал</p>
                           <span>{itemData.kbju[0]}</span>
                        </div>
                        <div className={styles.item}>
                           <p>Белки</p>
                           <span>{itemData.kbju[1]}г</span>
                        </div>
                        <div className={styles.item}>
                           <p>Жиры</p>
                           <span>{itemData.kbju[2]} г</span>
                        </div>
                        <div className={styles.item}>
                           <p>Углев.</p>
                           <span>{itemData.kbju[3]} г</span>
                        </div>
                     </div>
                     <div className={styles.subtitle}>Может содержать аллергены:</div>
                     <div className={styles.description}>{allergens}</div>
                  </div>
               </div>
            </div>
            <div className={styles.right}>
               <div className={styles.top}>
                  <div className={styles.title}>{title}</div>
                  <div className={styles.price}>{calculateTotalPrice()} руб.</div>
               </div>
               <div className={styles.info}>
                  <div className={styles.text}>
                     <div className={styles.title}>Информация</div>
                     <div className={styles.desc}>{info}</div>
                  </div>
                  <div className={styles.buttonWrapper}>
                     <div className={styles.counter}>
                        <div
                           onClick={onClickMinus}
                           className={
                              itemCount === 1 ? styles.counterBtn : styles.activeCounterBtn
                           }>
                           -
                        </div>
                        <span className={styles.count}>{itemCount}</span>
                        <div onClick={onClickPlus} className={styles.activeCounterBtn}>
                           +
                        </div>
                     </div>
                     <button
                        onClick={onClickAddToDrawer}
                        className={styles.addToCart}
                        type="button">
                        В корзину
                     </button>
                  </div>
               </div>
               <div className={styles.ingredients}>
                  <div className={styles.title}>Добавить ингредиенты</div>
                  <div className={styles.itemsWrap}>
                     {addIngredients.map((ingredient) => (
                        <IngredientItem
                           isSelected={addedIds.includes(ingredient.id)}
                           onClick={() => handleIngredientAdd(ingredient.id)}
                           key={ingredient.id}
                           {...ingredient}
                        />
                     ))}
                  </div>
                  <div className={styles.deleteIngredientsWrap}>
                     <div className={styles.title}>Убрать игредиенты</div>
                     <div className={styles.deleteButtons}>
                        {itemData.removeIngredients.map((ingredient) => (
                           <div
                              key={ingredient.id}
                              onClick={() => handleIngredientClick(ingredient.id)}
                              className={
                                 removedIds.includes(ingredient.id)
                                    ? styles.buttonDeleted
                                    : styles.button
                              }>
                              <img src={ingredient.image} alt={ingredient.name} />
                              <p>{ingredient.name}</p>
                              <img className={styles.deleteSvg} src={deleteSvg} alt="" />
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};
export default ItemPageBlock;

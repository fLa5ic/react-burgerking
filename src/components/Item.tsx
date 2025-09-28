import React from 'react';
import { Link } from 'react-router-dom';

type ItemProps = {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
};

const Item: React.FC<ItemProps> = ({ id, title, price, imageUrl }) => {
  return (
    <>
      <Link to={`/item/${id}`} className="content-categoryInner__items-item">
        <img src={imageUrl} alt="Фото блюда" />
        <div className="content-categoryInner__items-item__title">{title}</div>
        <div className="content-categoryInner__items-item__bottom">
          <div className="content-categoryInner__items-item__bottom-price">{price} руб.</div>
          <button type="submit" className="content-categoryInner__items-item__bottom-btn">
            Заказать
          </button>
        </div>
      </Link>
    </>
  );
};
export default Item;

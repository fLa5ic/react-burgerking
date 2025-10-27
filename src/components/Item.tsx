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
            <svg
              className="sc-1hg54s1-10 eTHbjR"
              width="16"
              height="16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8.002 15.877c-.319 0-.586-.108-.802-.324a1.088 1.088 0 0 1-.323-.801V9.127H1.252c-.319 0-.586-.108-.802-.323a1.089 1.089 0 0 1-.323-.802c0-.319.108-.586.323-.802.216-.215.483-.323.802-.323h5.625V1.252c0-.319.108-.586.323-.802.216-.215.483-.323.802-.323.319 0 .586.108.802.323.215.216.323.483.323.802v5.625h5.625c.319 0 .586.108.801.323.216.216.324.483.324.802 0 .319-.108.586-.324.802a1.088 1.088 0 0 1-.801.323H9.127v5.625c0 .319-.108.586-.323.801a1.089 1.089 0 0 1-.802.324Z"
                fill="#F5EBDC"></path>
            </svg>
            <span>Заказать</span>
          </button>
        </div>
      </Link>
    </>
  );
};
export default Item;

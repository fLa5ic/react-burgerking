import React from 'react';
import { useParams } from 'react-router-dom';

import ItemPageBlock from '../components/ItemPageBlock';

const ItemPage: React.FC = () => {
  const { id } = useParams();

  // Ранний возврат если нет ID
  if (!id) {
    return (
      <div className="itemPageBlock-wrap">
        <div className="container">
          <div>Товар не найден</div>
        </div>
      </div>
    );
  }

  return (
    <div className="itemPageBlock-wrap">
      <div className="container">
        <ItemPageBlock itemId={id} />
      </div>
    </div>
  );
};
export default ItemPage;

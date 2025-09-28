import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { setSubCategoryId } from '../redux/slices/filtersAndSortSlice';
import { RootState } from '../redux/store';

const SubCategories: React.FC = () => {
  const dispatch = useDispatch();
  const subCategoryId = useSelector((state: RootState) => state.filtersAndSortSlice.subCategoryId);

  const subCategories: string[] = ['Говядина', 'Курица', 'Рыба', 'Все'];

  const onChangeSubCategory = (id: number) => {
    dispatch(setSubCategoryId(id));
  };

  return (
    <div className="content-subCategories">
      {subCategories.map((subCategoryName, i) => (
        <button
          key={i}
          onClick={() => onChangeSubCategory(i)}
          className={
            subCategoryId === i ? 'content-subCategories__btn active' : 'content-subCategories__btn'
          }>
          {subCategoryName}
        </button>
      ))}
    </div>
  );
};
export default SubCategories;

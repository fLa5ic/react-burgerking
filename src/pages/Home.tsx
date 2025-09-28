import React from 'react';
import qs from 'qs';
import { useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';

import { setFilters } from '../redux/slices/filtersAndSortSlice';
import { fetchBurgers, setBurgers } from '../redux/slices/burgersSlice';

import Skeleton from '../components/Skeleton';

import Categories from '../components/Categories';
import Item from '../components/Item';
import SubCategories from '../components/SubCategories';
import Sort, { sortList } from '../components/Sort';
import { RootState, useAppDispatch } from '../redux/store';

const Home: React.FC = () => {
   const dispatch = useAppDispatch();
   const navigate = useNavigate();
   const isSearch = React.useRef(false);
   const isMounted = React.useRef(false);

   const { categoryId, subCategoryId, categoryName, selectedSort, searchValue } = useSelector(
      (state: RootState) => state.filtersAndSortSlice,
   );

   const { burgers } = useSelector((state: RootState) => state.burgers);
   const status = useSelector((state: RootState) => state.burgers.status);

   // const [burgers, setBurgers] = React.useState([]);

   const getBurgers = async () => {
      if (categoryId === 3) {
         const subCategory = subCategoryId < 3 ? `burgersCategory=${subCategoryId}` : '';
         const sortBy = selectedSort.sortProperty;
         const search = searchValue ? `title=*${searchValue}*` : '';

         dispatch(
            fetchBurgers({
               subCategory,
               sortBy,
               search,
            }),
         );
      } else {
         dispatch(setBurgers([]));
      }
      window.scrollTo(0, 0);
   };

   // Если изменили параметры и был первый рендер
   React.useEffect(() => {
      if (isMounted.current) {
         const queryString = qs.stringify({
            sortProperty: selectedSort.sortProperty,
            categoryId,
            subCategoryId,
         });
         navigate(`?${queryString}`);
      }
      isMounted.current = true;
   }, [subCategoryId, categoryId, selectedSort]);

   // Если был первый рендер, то проверяем URL-парметры и сохраняем в редаксе
   React.useEffect(() => {
      if (window.location.search) {
         const params = qs.parse(window.location.search.substring(1));

         const sort = sortList.find((obj) => obj.sortProperty === params.sortProperty);

         dispatch(
            setFilters({
               categoryId: Number(params.categoryId), // ← добавить Number()
               subCategoryId: Number(params.subCategoryId), // ← добавить Number()
               selectedSort: sort || sortList[0], // ← добавить fallback
            }),
         );
         isSearch.current = true;
      }
   }, []);

   // Если был первый рендер, то запрашиваем пиццы
   React.useEffect(() => {
      if (!isSearch.current) {
         getBurgers();
      }

      isSearch.current = false;
   }, [subCategoryId, categoryId, selectedSort, searchValue]);

   return (
      <div className="container">
         <div className="content__wrap">
            <Categories />
            <div className="content-categoryInner">
               <div className="content-categoryInner__title">{categoryName}</div>
               <div className="content-categoryInner__subCategory-sort">
                  {categoryId === 3 && (
                     <>
                        <SubCategories />
                        <Sort />
                     </>
                  )}
               </div>
               <div className="content-categoryInner__items">
                  {status === 'loading'
                     ? [...new Array(6)].map((_, index) => <Skeleton key={index} />)
                     : burgers.map((obj) => <Item key={obj.id} {...obj} />)}
               </div>
            </div>
         </div>
      </div>
   );
};

export default Home;

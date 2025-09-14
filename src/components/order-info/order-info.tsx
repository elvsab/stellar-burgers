import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectOrderDetails,
  selectOrderDetailsLoading,
  selectOrderDetailsError
} from '../../services/slices/orderDetailsSlice';
import { selectAllIngredients } from '../../services/slices/ingredientsSlice';
import { fetchOrderByNumber } from '../../services/slices/orderDetailsSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();
  const orderData = useSelector(selectOrderDetails);
  const ingredients = useSelector(selectAllIngredients);
  const isLoading = useSelector(selectOrderDetailsLoading);
  const error = useSelector(selectOrderDetailsError);

  useEffect(() => {
    if (number) {
      dispatch(fetchOrderByNumber(parseInt(number)));
    }
  }, [dispatch, number]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredients.find(
            (ing: TIngredient) => ing._id === item
          );
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {} as TIngredientsWithCount
    );

    const total = (
      Object.values(ingredientsInfo) as (TIngredient & { count: number })[]
    ).reduce(
      (acc: number, item: TIngredient & { count: number }) =>
        acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <div>Ошибка загрузки заказа: {error}</div>;
  }

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};

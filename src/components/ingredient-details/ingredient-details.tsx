import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectAllIngredients,
  setSelectedIngredient,
  fetchIngredients
} from '../../services/slices/ingredientsSlice';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

export const IngredientDetails: FC = () => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const allIngredients = useSelector(selectAllIngredients);

  useEffect(() => {
    if (!allIngredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, allIngredients.length]);

  const selectedIngredient = useMemo(
    () => allIngredients.find((ing) => ing._id === id),
    [allIngredients, id]
  );

  useEffect(() => {
    if (selectedIngredient) {
      dispatch(setSelectedIngredient(selectedIngredient));
    }
  }, [selectedIngredient, dispatch]);

  if (!selectedIngredient) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={selectedIngredient} />;
};

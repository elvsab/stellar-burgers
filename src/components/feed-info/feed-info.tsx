import { FC } from 'react';
import { useSelector } from '../../services/store';
import { FeedInfoUI } from '../ui/feed-info';
import {
  selectFeedOrders,
  selectFeedTotals
} from '../../services/slices/feedsSlice';
import { TOrder } from '@utils-types';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const orders = useSelector(selectFeedOrders);
  const feed = useSelector(selectFeedTotals);

  console.log('FeedInfo - orders:', orders);
  console.log('FeedInfo - feed:', feed);

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  console.log('FeedInfo - readyOrders:', readyOrders);
  console.log('FeedInfo - pendingOrders:', pendingOrders);

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};

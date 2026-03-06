import { PostOrderDTO, TOrdersFilter, TOrderStatus } from 'src/order/dto/order.dto';

export const ORDER_REPOSITORY_SERVICE = 'ORDER_REPOSITORY_SERVICE';

export interface IRepositoryService {
  getOrders(userId: string, orderFilter: TOrdersFilter);
  getOrder(id: string);
  patchOrderStatus(id: string, status: TOrderStatus);
  postOrder(order: PostOrderDTO);
}

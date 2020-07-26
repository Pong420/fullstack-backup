import { SuperAgentRequest } from 'superagent';
import { paths } from '@fullstack/common/constants';
import { CreateOrderDto } from '../../src/orders/dto/create-order.dto';
import { UpdateOrderDto } from '../../src/orders/dto/update-order.dto';

export function createOrder(
  token: string,
  dto: CreateOrderDto
): SuperAgentRequest {
  return request
    .post(paths.create_order)
    .set('Authorization', `bearer ${token}`)
    .send(dto);
}

export function updateOrder(
  token: string,
  id: string,
  changes: UpdateOrderDto
): SuperAgentRequest {
  return request
    .patch(paths.update_order.generatePath({ id }))
    .set('Authorization', `bearer ${token}`)
    .send(changes);
}

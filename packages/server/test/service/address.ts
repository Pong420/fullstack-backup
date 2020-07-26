import { SuperAgentRequest } from 'superagent';
import { paths } from '@fullstack/common/constants';
import { CreateAddressDto } from '../../src/address/dto/create-address.dto';
import { UpdateAddressDto } from '../../src/address/dto/update-address.dto';

export function getAddresses(token: string): SuperAgentRequest {
  return request
    .get(paths.get_addresses)
    .set('Authorization', `bearer ${token}`)
    .send();
}

export function createAddress(
  token: string,
  dto: CreateAddressDto
): SuperAgentRequest {
  return request
    .post(paths.create_address)
    .set('Authorization', `bearer ${token}`)
    .send(dto);
}

export function updateAddress(
  token: string,
  id: string,
  changes: UpdateAddressDto
): SuperAgentRequest {
  return request
    .patch(paths.update_address.generatePath({ id }))
    .set('Authorization', `bearer ${token}`)
    .send(changes);
}

import { PostOrderDTO } from './dto/order.dto';

export const postOrderMock: PostOrderDTO = {
  tickets: [
    {
      film: '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf',
      session: 'f2e429b0-685d-41f8-a8cd-1d8cb63b99ce',
      daytime: new Date('2024-06-28T10:00:53+03:00'),
      row: 1,
      seat: 1,
      price: 350,
    },
  ],
  email: 'test@example.com',
  phone: '+77777777777',
};

export const orderMockResult = {
  items: postOrderMock.tickets,
  total: 1,
};

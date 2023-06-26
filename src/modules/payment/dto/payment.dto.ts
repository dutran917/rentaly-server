export class OrderInfoDto {
  order_id: string;
  description: string;
  price: number;
  user_id: number;
  room_id: number;
  start_time: string;
  end_time: string;
}

export class VnPayPaymentResponse {
  message: string;
  code: string;
  status: boolean;
  amount: number;
  order_id: string;
}

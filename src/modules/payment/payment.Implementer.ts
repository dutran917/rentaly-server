import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';
import * as querystring from 'qs';
import { OrderInfoDto, VnPayPaymentResponse } from './dto/payment.dto';
import { VnPayAdapter } from './payment.provider';
import { Query } from 'express-serve-static-core';
type VNPayConfig = {
  VNP_ReturnUrl: string;
  VNP_TmnCode: string;
  VNP_HashSecret: string;
  VNP_Url: string;
};

export class VnPayPaymentImplementor implements VnPayAdapter {
  private cf: VNPayConfig;
  private ipAddr: string;
  constructor(config: ConfigService) {
    this.cf = {
      VNP_HashSecret: process.env.VNPAY_HASH_SERCRET,
      VNP_ReturnUrl: process.env.VNPAY_RETURN_URL,
      VNP_TmnCode: process.env.VNPAY_TMN_CODE,
      VNP_Url: process.env.VNP_URL,
    };
    this.ipAddr = process.env.IPADDRESS;
  }

  generateRedirectUrl(ctxInfo: OrderInfoDto): string {
    let vnpUrl = this.cf.VNP_Url;

    const date = forceToGMT7DateTime(new Date());
    const createDate = getDateTimeFormat(new Date(date));
    const amount = ctxInfo.price;

    const orderInfo = ctxInfo.description;
    const orderType = 'billpayment';
    const locale = 'vn';
    const currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = this.cf.VNP_TmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = ctxInfo.order_id;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = this.cf.VNP_ReturnUrl;
    vnp_Params['vnp_IpAddr'] = this.ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    // vnp_Params['vnp_roomId'] = ctxInfo.room_id;
    // vnp_Params['user_id'] = ctxInfo.user_id;
    // vnp_Params['start_time'] = ctxInfo.start_time;
    // vnp_Params['end_time'] = ctxInfo.end_time;
    vnp_Params = sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = createHmac('sha512', this.cf.VNP_HashSecret);
    vnp_Params['vnp_SecureHash'] = hmac
      .update(Buffer.from(signData, 'utf-8'))
      .digest('hex');
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
    return vnpUrl;
  }

  handleResponse(req: Query): VnPayPaymentResponse {
    let vnp_Params = req;

    const secureHash = vnp_Params['vnp_SecureHash'];
    const amount = Math.floor(+vnp_Params['vnp_Amount'] / 100);

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = createHmac('sha512', this.cf.VNP_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash !== signed) {
      return {
        code: '97',
        message: 'Kiểm tra GD thất bại',
      } as VnPayPaymentResponse;
    }

    const result = Object.assign(new VnPayPaymentResponse(), {
      order_id: vnp_Params['vnp_TxnRef'],
      code: vnp_Params['vnp_ResponseCode'],
      amount,
    } as VnPayPaymentResponse);
    switch (vnp_Params['vnp_ResponseCode']) {
      case '00':
        result.message = 'Giao dịch thành công';
        result.status = true;
        break;
      case '01':
        result.message = 'Giao dịch chưa hoàn tất';
        break;
      case '02':
        result.message = 'Giao dịch bị lỗi';
        break;
      case '04':
        result.message =
          'Giao dịch đảo (Khách hàng đã bị trừ tiền tại Ngân hàng nhưng GD chưa thành công ở VNPAY)';
        break;
      case '05':
        result.message = 'VNPAY đang xử lý giao dịch này (GD hoàn tiền)';
        break;
      case '06':
        result.message =
          'VNPAY đã gửi yêu cầu hoàn tiền sang Ngân hàng (GD hoàn tiền)';
        break;
      case '07':
        result.message = 'Giao dịch bị nghi ngờ gian lận';
        break;
      case '09':
        result.message =
          'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.';
        break;
      case '10':
        result.message =
          'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần';
        break;
      case '11':
        result.message =
          'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.';
        break;
      case '12':
        result.message =
          'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.';
        break;
      case '13':
        result.message =
          'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.';
        break;
      case '24':
        result.message =
          'Giao dịch không thành công do: Khách hàng hủy giao dịch';
        break;
      case '51':
        result.message =
          'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.';
        break;
      case '65':
        result.message =
          'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.';
        break;
      case '75':
        result.message = 'Ngân hàng thanh toán đang bảo trì.';
        break;
      case '79':
        result.message =
          'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch';
        break;
      case '99':
        result.message =
          'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)';
        result.status = true;
        break;
      default:
        result.message = 'GD không xác định';
    }

    return result;
  }
}

function sortObject(obj) {
  const sorted = {};
  const str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}

export function getDateTimeFormat(date: Date): string {
  const isoParts = date.toISOString().split('T');
  const dateParts = isoParts[0].split('-');
  const timeParts = isoParts[1].split('.')[0].split(':');

  return dateParts.join('') + timeParts.join('');
}

export function forceToGMT7DateTime(localTime: Date): number {
  const offsetZone = localTime.getTimezoneOffset() / 60;
  let bonus = 0;
  if (offsetZone !== -7) {
    bonus = 1000 * 60 * 60 * (offsetZone + 7);
  }
  localTime = new Date(localTime.getTime() + bonus);
  return Date.UTC(
    localTime.getFullYear(),
    localTime.getMonth(),
    localTime.getDate(),
    localTime.getHours(),
    localTime.getMinutes(),
    localTime.getSeconds(),
  );
}

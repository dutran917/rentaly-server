import { VERIFY_STATUS } from '@prisma/client';

export class GetListApartmentInput {
  page_size: number;
  page_index: number;
  search: string;
  district: string;
  verified: VERIFY_STATUS;
}

export class ApproveApartmentInput {
  apartmentId: number;
  approve: boolean;
}

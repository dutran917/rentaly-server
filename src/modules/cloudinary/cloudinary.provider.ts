import { ConfigOptions, v2 } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: (): ConfigOptions => {
    return v2.config({
      cloud_name: 'deiijz7oj',
      api_key: '125553869429216',
      api_secret: 'm1IBSXiVCgmv_AnR6Lx8fLT5pXo',
    });
  },
};

export type ProductType = {
  adminEmail: string;
  visible: boolean;
  courseData: {
    title: string;
    description: string;
    price: number;
    category: string;
    videoEmbed: string;
    downloadLink: string;
    files: any;
    thumbnails: string[];
  };
  date: Date;
  updatedAt: Date | null;
};

export type blogType = {
  publishedAt: any;
  date: any;
  adminEmail: string;
  visible: boolean;
  blogData: {
    title: string;
    message: string;
    blogType: string;
    images: any[];
  };
};

export type orderType = {
  date: any;
  deliveredOn: any;
  delivered: boolean;
  orderTotalPrice: string;
  products: {
    id: string;
    img1: string;
    img2: string;
    name: string;
    price: number;
    qty: number;
  }[];
  user: {
    name: string;
    email: string;
    phone: string;
    postOffice: string;
    address: string;
    anotherAddress: string;
  };
};

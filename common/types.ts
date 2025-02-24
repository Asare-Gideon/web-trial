export type ProductType = {
  date: any;
  adminEmail: string;
  id: string;
  visible: boolean;
  productData: {
    name: string;
    description: string;
    price: number;
    quantity: number;
    category: string;
    images: any[];
  };
  updatedAt: any;
};

export type blogType = {
  date: any;
  publishedAt: any;
  adminEmail: string;
  visible: boolean;
  blogData: {
    title: string;
    message: string;
    blogType: string[];
    images: any[];
  };
};

export type orderType = {
  date: any;
  delivered: boolean;
  productData: {
    name: string;
    description: string;
    price: number;
    quantity: number;
    category: string;
    images: any[];
  };
  userData: {
    personalInfo: {
      name: string;
      email: string;
      phoneNumber: string;
    };
    address: {
      name: string;
      city: string;
      postalCode: string;
    };
  };
};

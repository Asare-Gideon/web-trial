export type ProductType = {
  id: string;
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
  purchaseUsers?: string[];
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

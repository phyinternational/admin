interface Category {
    _id: string;
    isActive: boolean;
    type: "Footer" | "main";
    parent?: Category;
    parentId?: string;
    name: string;
    imageUrl: string;
    slug: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export default Category;
  
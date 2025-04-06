
export interface OrderItem {
    item: {
      _id: string;
      name: string;
      mrp: number;
      discount: number;
    };
    quantity: number;
  }
  
  export interface Order {
    _id: string;
    items: OrderItem[];
    mobile: string;
    status: "Pending"| "Processing" | "Completed"| "Cancelled"
    storeId: string;
    createdAt: string;
    updatedAt: string;
  }
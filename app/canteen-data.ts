export type Product = {
  id: number;
  name: string;
  price: number;
  available: boolean;
  category: string;
};

export type OrderStatus = "접수" | "준비완료" | "수령완료";

export type Order = {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  item: string;
  quantity: number;
  total: number;
  orderedAt: string;
  status: OrderStatus;
};

export const products: Product[] = [
  { id: 1, name: "삼각김밥", price: 1200, available: true, category: "식사" },
  { id: 2, name: "샌드위치", price: 2800, available: true, category: "식사" },
  { id: 3, name: "초코우유", price: 1400, available: true, category: "음료" },
  { id: 4, name: "이온음료", price: 1800, available: true, category: "음료" },
  { id: 5, name: "소시지빵", price: 2200, available: false, category: "간식" },
];

export const initialOrders: Order[] = [
  {
    id: "A-1021",
    studentId: "20314",
    studentName: "김민준",
    className: "2학년 3반",
    item: "삼각김밥",
    quantity: 1,
    total: 1200,
    orderedAt: "10:12",
    status: "접수",
  },
  {
    id: "A-1022",
    studentId: "20307",
    studentName: "박서연",
    className: "2학년 3반",
    item: "샌드위치",
    quantity: 1,
    total: 2800,
    orderedAt: "10:13",
    status: "준비완료",
  },
  {
    id: "A-1023",
    studentId: "20322",
    studentName: "이지훈",
    className: "2학년 3반",
    item: "초코우유",
    quantity: 2,
    total: 2800,
    orderedAt: "10:14",
    status: "접수",
  },
];

export const statusStyles: Record<OrderStatus, string> = {
  접수: "bg-blue-50 text-blue-700 ring-blue-100",
  준비완료: "bg-amber-50 text-amber-700 ring-amber-100",
  수령완료: "bg-emerald-50 text-emerald-700 ring-emerald-100",
};

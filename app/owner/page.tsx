"use client";

import { useState } from "react";
import {
  type Order,
  type OrderStatus,
  initialOrders,
  products,
  statusStyles,
} from "../canteen-data";

export default function OwnerPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  function updateOrderStatus(orderId: string, status: OrderStatus) {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order,
      ),
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 lg:px-10">
        <header className="rounded-[2rem] bg-slate-950 p-7 text-white shadow-xl shadow-slate-200 sm:p-10">
          <p className="w-fit rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-cyan-100">
            매점주인 전용 주소
          </p>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                주문 시간순 준비 목록
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
                학생에게 노출되지 않는 매점 관리 화면입니다. 주문자 학번과
                이름, 상품, 수량, 결제 예정 금액을 확인하고 준비 상태를
                변경합니다.
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/10">
              <p className="text-sm text-slate-300">판매 상품 관리</p>
              <div className="mt-4 grid gap-2">
                {products.map((product) => (
                  <div
                    className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3"
                    key={product.id}
                  >
                    <span className="font-bold">{product.name}</span>
                    <span className="text-sm text-slate-300">
                      {product.available ? "판매중" : "품절"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <div>
              <p className="text-sm font-bold text-cyan-700">주문 관리</p>
              <h2 className="mt-2 text-2xl font-black">
                다음 쉬는시간 준비 현황
              </h2>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
              결제 방식: 수령 시 현금/카드 현장 결제
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
            <div className="hidden grid-cols-[0.8fr_1fr_1fr_0.8fr_1fr] bg-slate-100 px-5 py-3 text-sm font-bold text-slate-600 md:grid">
              <span>주문시간</span>
              <span>주문자</span>
              <span>상품</span>
              <span>금액</span>
              <span>상태</span>
            </div>
            {orders.map((order) => (
              <div
                className="grid gap-3 border-t border-slate-100 px-5 py-4 md:grid-cols-[0.8fr_1fr_1fr_0.8fr_1fr] md:items-center"
                key={order.id}
              >
                <div>
                  <p className="font-black">{order.orderedAt}</p>
                  <p className="text-sm text-slate-500">{order.id}</p>
                </div>
                <div>
                  <p className="font-bold">
                    {order.studentId} {order.studentName}
                  </p>
                  <p className="text-sm text-slate-500">{order.className}</p>
                </div>
                <p className="font-semibold">
                  {order.item} {order.quantity}개
                </p>
                <p className="font-black">{order.total.toLocaleString()}원</p>
                <div className="flex flex-wrap gap-2">
                  {(["접수", "준비완료", "수령완료"] as OrderStatus[]).map(
                    (status) => (
                      <button
                        className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${
                          order.status === status
                            ? statusStyles[status]
                            : "bg-white text-slate-500 ring-slate-200"
                        }`}
                        key={status}
                        onClick={() => updateOrderStatus(order.id, status)}
                      >
                        {status}
                      </button>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

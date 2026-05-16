"use client";

import { useState } from "react";
import { type Order, products } from "./canteen-data";

export default function Home() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedProductId, setSelectedProductId] = useState(products[0].id);
  const orderOpen = true;

  const selectedProduct = products.find(
    (product) => product.id === selectedProductId,
  );

  function createOrder() {
    if (!selectedProduct || !selectedProduct.available || !orderOpen) {
      return;
    }

    const nextOrder: Order = {
      id: `A-${1021 + orders.length}`,
      studentId: "20318",
      studentName: "최하늘",
      className: "2학년 3반",
      item: selectedProduct.name,
      quantity: 1,
      total: selectedProduct.price,
      orderedAt: "10:15",
      status: "접수",
    };

    setOrders((currentOrders) => [...currentOrders, nextOrder]);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 lg:px-10">
        <header className="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-xl shadow-slate-200">
          <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.25fr_0.75fr] lg:p-12">
            <div className="flex flex-col justify-between gap-8">
              <div className="space-y-5">
                <p className="w-fit rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-cyan-100">
                  쉬는시간 지각 예방 프로젝트
                </p>
                <div className="space-y-4">
                  <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
                    매점 사전주문으로 줄 서는 시간을 수업 준비 시간으로.
                  </h1>
                  <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                    학생은 학번과 비밀번호로 인증한 뒤 판매 중인 상품만
                    선택합니다. 주문 후에는 변경과 취소가 불가능하므로 제출 전
                    최종 확인을 거칩니다.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <MetricCard label="내 주문" value={`${orders.length}건`} />
                <MetricCard
                  label="주문 상태"
                  value={orderOpen ? "가능" : "마감"}
                />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-300">학생 안내</p>
                  <h2 className="text-2xl font-bold">현장 결제 후 수령</h2>
                </div>
              </div>
              <div className="rounded-2xl bg-white p-5 text-slate-950">
                <p className="text-sm font-semibold text-slate-500">
                  주문 완료 후 수령 방법
                </p>
                <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                  <p className="font-bold">학번과 이름 또는 주문번호 확인</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    매점에서 본인 주문을 확인하고 현금 또는 카드로 결제한 뒤
                    준비된 상품을 수령합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <StudentPanel
          onOrder={createOrder}
          orderOpen={orderOpen}
          orders={orders}
          selectedProductId={selectedProductId}
          setSelectedProductId={setSelectedProductId}
        />
      </section>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
      <p className="text-sm text-slate-300">{label}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}

function StudentPanel({
  onOrder,
  orderOpen,
  orders,
  selectedProductId,
  setSelectedProductId,
}: {
  onOrder: () => void;
  orderOpen: boolean;
  orders: Order[];
  selectedProductId: number;
  setSelectedProductId: (productId: number) => void;
}) {
  const selectedProduct = products.find(
    (product) => product.id === selectedProductId,
  );

  return (
    <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-bold text-cyan-700">학생 인증 예시</p>
        <h2 className="mt-2 text-2xl font-black">학번과 비밀번호로 로그인</h2>
        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-slate-600">학번</span>
            <input
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
              defaultValue="20318"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-600">
              비밀번호
            </span>
            <input
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
              defaultValue="school1234"
              type="password"
            />
          </label>
        </div>
        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          교사가 학생 명단을 일괄 생성하고, 학생은 부여받은 학번과 초기
          비밀번호로 인증합니다.
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <div>
            <p className="text-sm font-bold text-cyan-700">상품 목록</p>
            <h2 className="mt-2 text-2xl font-black">오늘 주문 가능한 상품</h2>
          </div>
          <span
            className={`h-fit rounded-full px-4 py-2 text-sm font-bold ${
              orderOpen
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {orderOpen ? "주문 가능" : "주문 마감"}
          </span>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {products.map((product) => (
            <button
              className={`rounded-2xl border p-4 text-left transition ${
                selectedProductId === product.id
                  ? "border-cyan-500 bg-cyan-50"
                  : "border-slate-200 hover:border-slate-300"
              } ${!product.available ? "opacity-50" : ""}`}
              disabled={!product.available}
              key={product.id}
              onClick={() => setSelectedProductId(product.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-slate-500">
                    {product.category}
                  </p>
                  <p className="mt-1 text-lg font-black">{product.name}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
                  {product.available ? "판매중" : "품절"}
                </span>
              </div>
              <p className="mt-4 text-xl font-black">
                {product.price.toLocaleString()}원
              </p>
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-3xl bg-slate-950 p-5 text-white">
          <p className="text-sm text-slate-300">주문 전 최종 확인</p>
          <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-2xl font-black">
                {selectedProduct?.name ?? "상품 선택 필요"}
              </p>
              <p className="mt-1 text-slate-300">
                주문 후 변경 및 취소가 불가능합니다.
              </p>
            </div>
            <button
              className="rounded-2xl bg-cyan-400 px-6 py-3 font-black text-cyan-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
              disabled={!orderOpen || !selectedProduct?.available}
              onClick={onOrder}
            >
              주문 제출
            </button>
          </div>
        </div>
      </div>

      {orders.length > 0 && (
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
          <p className="text-sm font-bold text-cyan-700">주문 완료 내역</p>
          <h2 className="mt-2 text-2xl font-black">내 주문 확인</h2>
          <div className="mt-6 space-y-3">
            {orders.map((order) => (
              <div
                className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center"
                key={order.id}
              >
                <div>
                  <p className="font-black">
                    {order.id} · {order.item}
                  </p>
                  <p className="text-sm text-slate-500">
                    매점에서 학번과 이름 또는 주문번호를 확인하고 현장 결제 후
                    수령하세요.
                  </p>
                </div>
                <p className="font-black">{order.total.toLocaleString()}원</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

"use client";

import { useMemo, useState } from "react";
import { initialOrders, statusStyles } from "../canteen-data";

export default function TeacherPage() {
  const [orderOpen, setOrderOpen] = useState(true);
  const orders = initialOrders;

  const totalSales = useMemo(
    () => orders.reduce((sum, order) => sum + order.total, 0),
    [orders],
  );

  const topItem = useMemo(() => {
    const itemCounts = orders.reduce<Record<string, number>>((counts, order) => {
      counts[order.item] = (counts[order.item] ?? 0) + order.quantity;
      return counts;
    }, {});

    return Object.entries(itemCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-";
  }, [orders]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 lg:px-10">
        <header className="rounded-[2rem] bg-slate-950 p-7 text-white shadow-xl shadow-slate-200 sm:p-10">
          <p className="w-fit rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-cyan-100">
            교사 전용 주소
          </p>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                본인 반 주문 현황과 통계
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
                학생에게 노출되지 않는 교사 관리 화면입니다. 주문 가능 여부를
                열고 닫고, 본인 반 주문 현황을 생활지도 자료로 확인합니다.
              </p>
            </div>
            <button
              className={`rounded-3xl p-6 text-left font-black transition ${
                orderOpen
                  ? "bg-rose-50 text-rose-700 hover:bg-rose-100"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
              onClick={() => setOrderOpen(!orderOpen)}
            >
              <span className="block text-sm">주문 운영 상태</span>
              <span className="mt-2 block text-3xl">
                {orderOpen ? "주문 열림" : "주문 닫힘"}
              </span>
            </button>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-bold text-cyan-700">담임교사 운영</p>
            <h2 className="mt-2 text-2xl font-black">2학년 3반 통계</h2>
            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              학생 계정은 교사가 일괄 생성하고, 학생은 학번과 비밀번호로
              주문합니다. 이 화면에서는 본인 반의 주문 패턴을 확인합니다.
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <Stat label="총 주문" value={`${orders.length}건`} />
              <Stat
                label="주문 금액"
                value={`${totalSales.toLocaleString()}원`}
              />
              <Stat label="인기 상품" value={topItem} />
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-bold text-cyan-700">반별 모니터링</p>
            <h2 className="mt-2 text-2xl font-black">학생별 주문 현황</h2>
            <div className="mt-6 space-y-3">
              {orders.map((order) => (
                <div
                  className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center"
                  key={`${order.id}-teacher`}
                >
                  <div>
                    <p className="font-black">
                      {order.studentId} {order.studentName}
                    </p>
                    <p className="text-sm text-slate-500">
                      {order.item} · {order.total.toLocaleString()}원 ·{" "}
                      {order.orderedAt}
                    </p>
                  </div>
                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusStyles[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-black">{value}</p>
    </div>
  );
}

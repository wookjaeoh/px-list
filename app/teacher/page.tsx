"use client";

import { useMemo, useState } from "react";
import { initialOrders, statusStyles } from "../canteen-data";

type StudentAccount = {
  studentId: string;
  name: string;
  grade: string;
  classNumber: string;
  number: string;
  initialPassword: string;
};

type ParsedStudentRow =
  | {
      ok: true;
      lineNumber: number;
      student: StudentAccount;
    }
  | {
      ok: false;
      lineNumber: number;
      raw: string;
      errors: string[];
    };

const sampleBulkInput = `20301,강도윤,2,3,1,school20301
20302,김서아,2,3,2,school20302
20303,문지호,2,3,3,school20303`;

const initialStudents: StudentAccount[] = [
  {
    studentId: "20314",
    name: "김민준",
    grade: "2",
    classNumber: "3",
    number: "14",
    initialPassword: "issued",
  },
  {
    studentId: "20307",
    name: "박서연",
    grade: "2",
    classNumber: "3",
    number: "7",
    initialPassword: "issued",
  },
  {
    studentId: "20322",
    name: "이지훈",
    grade: "2",
    classNumber: "3",
    number: "22",
    initialPassword: "issued",
  },
];

export default function TeacherPage() {
  const [orderOpen, setOrderOpen] = useState(true);
  const [bulkInput, setBulkInput] = useState(sampleBulkInput);
  const [students, setStudents] = useState<StudentAccount[]>(initialStudents);
  const [lastCreatedCount, setLastCreatedCount] = useState(0);
  const orders = initialOrders;

  const parsedRows = useMemo(
    () => parseStudentRows(bulkInput, students),
    [bulkInput, students],
  );

  const validRows = parsedRows.filter((row) => row.ok);
  const invalidRows = parsedRows.filter((row) => !row.ok);
  const canCreate = validRows.length > 0 && invalidRows.length === 0;

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

  function createStudents() {
    if (!canCreate) {
      setLastCreatedCount(0);
      return;
    }

    const createdStudents = validRows.map((row) => row.student);
    setStudents((currentStudents) => [...currentStudents, ...createdStudents]);
    setBulkInput("");
    setLastCreatedCount(createdStudents.length);
  }

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
              <Stat label="등록 학생" value={`${students.length}명`} />
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

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
              <div>
                <p className="text-sm font-bold text-cyan-700">
                  학생 계정 관리
                </p>
                <h2 className="mt-2 text-2xl font-black">
                  학생 일괄 생성
                </h2>
              </div>
              <button
                className="h-fit rounded-full border border-cyan-700 px-4 py-2 text-sm font-bold text-cyan-700 transition hover:bg-cyan-50"
                onClick={() => setBulkInput(sampleBulkInput)}
              >
                예시 불러오기
              </button>
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              한 줄에 한 명씩 입력합니다. 형식은{" "}
              <strong>학번,이름,학년,반,번호,초기비밀번호</strong> 입니다.
              학번은 중복될 수 없고, 초기 비밀번호는 8자 이상이어야 합니다.
            </div>

            <label className="mt-5 block">
              <span className="text-sm font-semibold text-slate-600">
                일괄 생성 입력
              </span>
              <textarea
                className="mt-2 min-h-48 w-full rounded-2xl border border-slate-200 px-4 py-3 font-mono text-sm leading-6 outline-none focus:border-cyan-600"
                onChange={(event) => {
                  setBulkInput(event.target.value);
                  setLastCreatedCount(0);
                }}
                placeholder="20301,홍길동,2,3,1,school20301"
                value={bulkInput}
              />
            </label>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-600">
                생성 가능 {validRows.length}명 · 오류 {invalidRows.length}건
              </div>
              <button
                className="rounded-full bg-cyan-700 px-5 py-3 text-sm font-black text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                disabled={!canCreate}
                onClick={createStudents}
              >
                학생 계정 생성
              </button>
            </div>

            {lastCreatedCount > 0 && (
              <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
                학생 계정 {lastCreatedCount}명이 생성되었습니다.
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm font-bold text-cyan-700">검증 결과</p>
              <h2 className="mt-2 text-2xl font-black">입력값 확인</h2>

              {parsedRows.length === 0 ? (
                <p className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                  생성할 학생 정보를 입력하면 검증 결과가 표시됩니다.
                </p>
              ) : (
                <div className="mt-5 space-y-3">
                  {parsedRows.map((row) =>
                    row.ok ? (
                      <div
                        className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4"
                        key={`valid-${row.lineNumber}-${row.student.studentId}`}
                      >
                        <p className="font-black text-emerald-800">
                          {row.lineNumber}행 · {row.student.studentId}{" "}
                          {row.student.name}
                        </p>
                        <p className="mt-1 text-sm text-emerald-700">
                          {row.student.grade}학년 {row.student.classNumber}반{" "}
                          {row.student.number}번 · 생성 가능
                        </p>
                      </div>
                    ) : (
                      <div
                        className="rounded-2xl border border-rose-100 bg-rose-50 p-4"
                        key={`invalid-${row.lineNumber}-${row.raw}`}
                      >
                        <p className="font-black text-rose-800">
                          {row.lineNumber}행 · 생성 불가
                        </p>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-700">
                          {row.errors.map((error) => (
                            <li key={error}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm font-bold text-cyan-700">등록 학생 목록</p>
              <h2 className="mt-2 text-2xl font-black">2학년 3반</h2>
              <div className="mt-5 max-h-72 space-y-3 overflow-auto pr-1">
                {students.map((student) => (
                  <div
                    className="flex items-center justify-between rounded-2xl border border-slate-200 p-4"
                    key={student.studentId}
                  >
                    <div>
                      <p className="font-black">
                        {student.studentId} {student.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {student.grade}학년 {student.classNumber}반{" "}
                        {student.number}번
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      계정 생성됨
                    </span>
                  </div>
                ))}
              </div>
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

function parseStudentRows(
  input: string,
  existingStudents: StudentAccount[],
): ParsedStudentRow[] {
  const existingIds = new Set(
    existingStudents.map((student) => student.studentId),
  );
  const seenIds = new Set<string>();

  return input
    .split(/\r?\n/)
    .map((raw, index) => ({ raw: raw.trim(), lineNumber: index + 1 }))
    .filter((row) => row.raw.length > 0)
    .map(({ raw, lineNumber }) => {
      const [studentId, name, grade, classNumber, number, initialPassword] = raw
        .split(",")
        .map((value) => value.trim());
      const errors: string[] = [];

      if (!studentId || !name || !grade || !classNumber || !number || !initialPassword) {
        errors.push("필수값 6개를 모두 입력해야 합니다.");
      }

      if (studentId && !/^\d{4,10}$/.test(studentId)) {
        errors.push("학번은 숫자 4~10자리로 입력해야 합니다.");
      }

      if (studentId && existingIds.has(studentId)) {
        errors.push("이미 등록된 학번입니다.");
      }

      if (studentId && seenIds.has(studentId)) {
        errors.push("입력 목록 안에서 학번이 중복되었습니다.");
      }

      if (initialPassword && initialPassword.length < 8) {
        errors.push("초기 비밀번호는 8자 이상이어야 합니다.");
      }

      if (grade && !/^\d+$/.test(grade)) {
        errors.push("학년은 숫자로 입력해야 합니다.");
      }

      if (classNumber && !/^\d+$/.test(classNumber)) {
        errors.push("반은 숫자로 입력해야 합니다.");
      }

      if (number && !/^\d+$/.test(number)) {
        errors.push("번호는 숫자로 입력해야 합니다.");
      }

      if (studentId) {
        seenIds.add(studentId);
      }

      if (errors.length > 0) {
        return {
          ok: false,
          lineNumber,
          raw,
          errors,
        };
      }

      return {
        ok: true,
        lineNumber,
        student: {
          studentId,
          name,
          grade,
          classNumber,
          number,
          initialPassword,
        },
      };
    });
}

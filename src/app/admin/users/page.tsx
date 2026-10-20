import type { Metadata } from "next";
import Link from "next/link";
import {
  RefreshCw,
  Search,
  SearchX,
  TriangleAlert,
  Users,
} from "lucide-react";
import type { Prisma, UserStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import PageHeader from "@/components/ui/page-header";
import EmptyState from "@/components/ui/empty-state";
import StatusBadge from "@/components/ui/status-badge";
import Pagination from "@/components/ui/pagination";
import UserStatusActions from "@/components/admin/user-status-actions";
import RoleManager from "@/components/admin/role-manager";
import {
  SYSTEM_ROLE_LABELS,
  USER_STATUS_LABELS,
  USER_STATUS_BADGE,
} from "@/components/admin/constants";
import { formatDateAr } from "@/lib/labels";

export const metadata: Metadata = {
  title: "المستخدمون — بواب مصر",
};

const PAGE_SIZE = 10;

const USER_STATUSES: UserStatus[] = [
  "ACTIVE",
  "SUSPENDED",
  "PENDING_VERIFICATION",
  "DEACTIVATED",
];

type UsersPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

type AdminUser = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    phone: true;
    status: true;
    phoneVerifiedAt: true;
    createdAt: true;
    employerProfile: { select: { displayName: true } };
    systemRoles: { select: { role: { select: { name: true } } } };
    _count: { select: { applications: true } };
  };
}>;

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function parsePage(value: string): number {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function displayNameOf(user: {
  name: string;
  employerProfile: { displayName: string } | null;
}): string {
  return user.employerProfile?.displayName ?? user.name;
}

function applicationsLabel(count: number): string {
  return count === 0
    ? "لا طلبات توظيف"
    : count === 1
      ? "طلب توظيف واحد"
      : `${count} طلبات توظيف`;
}

export default async function AdminUsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams;

  const q = firstParam(params.q).trim();
  const rawStatus = firstParam(params.status);
  const status: UserStatus | undefined = USER_STATUSES.includes(
    rawStatus as UserStatus
  )
    ? (rawStatus as UserStatus)
    : undefined;
  const page = parsePage(firstParam(params.page));

  const where: Prisma.UserWhereInput = {};
  if (status) {
    where.status = status;
  }
  if (q.length > 0) {
    where.OR = [
      { phone: { contains: q } },
      { name: { contains: q, mode: "insensitive" } },
      { employerProfile: { displayName: { contains: q, mode: "insensitive" } } },
    ];
  }

  let users: AdminUser[] = [];
  let total = 0;
  let hasDbError = false;

  try {
    [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        select: {
          id: true,
          name: true,
          phone: true,
          status: true,
          phoneVerifiedAt: true,
          createdAt: true,
          employerProfile: { select: { displayName: true } },
          systemRoles: { select: { role: { select: { name: true } } } },
          _count: { select: { applications: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);
  } catch (error) {
    console.error("[admin-users-page]", error);
    hasDbError = true;
  }

  if (hasDbError) {
    return (
      <div>
        <PageHeader
          title="المستخدمون"
          description="إدارة حسابات المستخدمين وحالتهم وصلاحياتهم الإدارية"
        />
        <div className="alert alert-error flex-col items-center text-center">
          <TriangleAlert size={22} aria-hidden />
          <h2 className="text-lg font-bold">تعذّر تحميل المستخدمين</h2>
          <p className="mt-1">
            حدث خطأ أثناء جلب قائمة المستخدمين. يرجى المحاولة مرة أخرى بعد
            قليل.
          </p>
          <Link href="/admin/users" className="btn btn-primary mt-4">
            <RefreshCw size={16} aria-hidden />
            إعادة المحاولة
          </Link>
        </div>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasFilters = q.length > 0 || Boolean(status);

  return (
    <div>
      <PageHeader
        title="المستخدمون"
        description="إدارة حسابات المستخدمين وحالتهم وصلاحياتهم الإدارية"
      />

      <form
        method="get"
        action="/admin/users"
        className="card mb-6 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end"
      >
        <div>
          <label className="form-label" htmlFor="users-q">
            بحث بالاسم أو رقم الهاتف
          </label>
          <input
            id="users-q"
            type="text"
            name="q"
            className="form-input"
            placeholder="ابحث بالاسم أو الهاتف"
            defaultValue={q}
          />
        </div>
        <div>
          <label className="form-label" htmlFor="users-status">
            الحالة
          </label>
          <select
            id="users-status"
            name="status"
            className="form-input"
            defaultValue={status ?? ""}
          >
            <option value="">كل الحالات</option>
            {USER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {USER_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            <Search size={16} aria-hidden />
            بحث
          </button>
        </div>
      </form>

      {users.length === 0 ? (
        hasFilters ? (
          <EmptyState
            icon={SearchX}
            title="لا توجد نتائج"
            description="لم يتم العثور على مستخدمين يطابقون البحث."
            actionHref="/admin/users"
            actionLabel="عرض كل المستخدمين"
          />
        ) : (
          <EmptyState
            icon={Users}
            title="لا يوجد مستخدمون بعد"
            description="لم يسجّل أي مستخدم في المنصة حتى الآن."
          />
        )
      ) : (
        <ul className="card divide-y divide-line p-0">
          {users.map((user) => {
            const grantedRoles = user.systemRoles.map((r) => r.role.name);
            return (
              <li
                key={user.id}
                className="px-5 py-4 transition-colors hover:bg-muted/60"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 basis-64">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-bold">
                        {displayNameOf(user)}
                      </h2>
                      {grantedRoles.map((role) => (
                        <span key={role} className="badge badge-brand">
                          {SYSTEM_ROLE_LABELS[role] ?? role}
                        </span>
                      ))}
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-mute">
                      <span dir="ltr">{user.phone}</span> • انضم{" "}
                      {formatDateAr(user.createdAt)} •{" "}
                      {applicationsLabel(user._count.applications)}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {user.phoneVerifiedAt ? (
                      <span className="badge badge-published">
                        موثّق هاتفياً
                      </span>
                    ) : (
                      <span className="badge badge-neutral">غير موثّق</span>
                    )}
                    <StatusBadge
                      label={USER_STATUS_LABELS[user.status]}
                      variant={USER_STATUS_BADGE[user.status]}
                      dot
                    />
                  </div>
                </div>

                <div className="mt-3 border-t border-line pt-3">
                  <UserStatusActions
                    userId={user.id}
                    currentStatus={user.status}
                    statusLabel={USER_STATUS_LABELS[user.status]}
                  />
                  <RoleManager userId={user.id} grantedRoles={grantedRoles} />
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/admin/users"
        searchParams={{ q, status: status ?? "" }}
      />
    </div>
  );
}

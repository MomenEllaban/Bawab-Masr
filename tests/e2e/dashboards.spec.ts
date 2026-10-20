import { test, expect, type Page } from "@playwright/test";
import { config as dotenvConfig } from "dotenv";
import pg from "pg";

dotenvConfig({ path: [".env.local", ".env"] });

const SEEKER = {
  phone: "01000000001",
  password: "Demo1234!",
  name: "أحمد علي",
};
const EMPLOYER = {
  phone: "01000000002",
  password: "Demo1234!",
  name: "محمود حسن",
};
const ADMIN = {
  phone: "01000000003",
  password: "Demo1234!",
  name: "مدير النظام",
};

function cleanConnString(raw: string): string {
  try {
    const url = new URL(raw);
    url.searchParams.delete("sslmode");
    return url.toString();
  } catch {
    return raw;
  }
}

const connectionString = cleanConnString(
  process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? ""
);

function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console.error: ${msg.text()}`);
  });
  page.on("pageerror", (err) => {
    errors.push(`pageerror: ${String(err)}`);
  });
  return errors;
}

async function runSql(sql: string, params: unknown[] = []): Promise<void> {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  try {
    await client.query(sql, params);
  } finally {
    await client.end();
  }
}

async function login(
  page: Page,
  account: { phone: string; password: string; name: string }
): Promise<void> {
  await page.goto("/login");
  await page.getByLabel("رقم الهاتف").fill(account.phone);
  await page.getByLabel("كلمة المرور").fill(account.password);
  await page.getByRole("button", { name: "تسجيل الدخول" }).click();
  await expect(page).toHaveURL("/");
  await expect(page.getByText(`مرحباً، ${account.name}`)).toBeVisible();
}

async function logout(page: Page): Promise<void> {
  await page.getByRole("button", { name: "تسجيل الخروج" }).click();
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("link", { name: "تسجيل الدخول" })).toBeVisible();
}

test.describe("الوظيفة والـ SEO", () => {
  test("صفحة تفاصيل وظيفة منشورة للزائر تعرض دعوة للتسجيل بدون أخطاء", async ({
    page,
  }) => {
    const errors = collectErrors(page);
    const response = await page.goto("/jobs/demo-published-smouha-guard", {
      waitUntil: "networkidle",
    });
    expect(response!.status()).toBe(200);

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "بواب عمارة — سموحة (منشورة)"
    );
    await expect(
      page.getByRole("link", { name: "سجّل الدخول للتقديم" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "سجّل الدخول لحفظ الوظيفة" })
    ).toBeVisible();

    expect(errors).toEqual([]);
  });

  test("sitemap.xml و robots.txt يعملان ويحتويان على المسارات الصحيحة", async ({
    page,
  }) => {
    const sitemap = await page.goto("/sitemap.xml");
    expect(sitemap!.status()).toBe(200);
    await expect(page.locator("body")).toContainText(
      "/jobs/demo-published-smouha-guard"
    );

    const robots = await page.goto("/robots.txt");
    expect(robots!.status()).toBe(200);
    await expect(page.locator("body")).toContainText("Disallow: /seeker/");
    await expect(page.locator("body")).toContainText("Disallow: /admin/");
  });
});

test.describe("لوحة الباحث (حساب تجريبي)", () => {
  test("الرئيسية والطلبات والمحفوظات تفتح بدون أخطاء", async ({ page }) => {
    const errors = collectErrors(page);

    await login(page, SEEKER);

    await page.getByRole("link", { name: "حسابي" }).first().click();
    await expect(page).toHaveURL("/seeker");
    await expect(page.getByText("إجمالي الطلبات")).toBeVisible();
    await expect(page.getByText("ضمن القائمة").first()).toBeVisible();

    await page.goto("/seeker/applications", { waitUntil: "networkidle" });
    await expect(
      page.getByText("بواب عمارة — سموحة (منشورة)").first()
    ).toBeVisible();
    await expect(
      page.locator(".badge", { hasText: "ضمن القائمة" }).first()
    ).toBeVisible();

    await page.goto("/seeker/saved", { waitUntil: "networkidle" });
    await expect(page.getByText("حارس مستودع — المنشية")).toBeVisible();

    await page.goto("/seeker/profile", { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "الملف الشخصي"
    );

    await logout(page);
    expect(errors).toEqual([]);
  });
});

test.describe("لوحة صاحب العقار (حساب تجريبي)", () => {
  test("الرئيسية والوظائف وصفحة إضافة وظيفة تفتح بدون أخطاء", async ({
    page,
  }) => {
    const errors = collectErrors(page);

    await login(page, EMPLOYER);

    await page
      .getByRole("link", { name: "لوحة صاحب العقار" })
      .first()
      .click();
    await expect(page).toHaveURL("/employer");

    await page.goto("/employer/jobs", { waitUntil: "networkidle" });
    await expect(
      page.getByText("بواب عمارة سكنية — سموحة").first()
    ).toBeVisible();
    await expect(
      page.locator(".badge", { hasText: "قيد المراجعة" }).first()
    ).toBeVisible();

    await page.goto("/employer/jobs/new", { waitUntil: "networkidle" });
    await expect(page.locator(".form-input").first()).toBeVisible();

    await page.goto("/employer/applications", { waitUntil: "networkidle" });

    await logout(page);
    expect(errors).toEqual([]);
  });
});

test.describe("لوحة الإدارة (حساب تجريبي)", () => {
  test.afterEach(async () => {
    await runSql(
      `UPDATE "Job" SET "status" = 'PENDING_REVIEW', "reviewStatus" = 'PENDING', "publishedAt" = NULL
       WHERE "slug" = 'demo-night-guard-sidi-gaber'`
    );
    await runSql(
      `DELETE FROM "ModerationReview" WHERE "jobId" = (SELECT "id" FROM "Job" WHERE "slug" = 'demo-night-guard-sidi-gaber')`
    );
  });

  test("مراجعة وظيفة وقائمة المستخدمين بدون أخطاء", async ({ page }) => {
    const errors = collectErrors(page);

    await login(page, ADMIN);

    await page.getByRole("link", { name: "لوحة الإدارة" }).first().click();
    await expect(page).toHaveURL("/admin");

    await page.goto("/admin/jobs", { waitUntil: "networkidle" });
    const pendingRow = page
      .locator(".card")
      .filter({ hasText: "حارس ليلي — سيدي جابر" });
    await expect(pendingRow.first()).toBeVisible();

    await pendingRow.first().getByRole("button", { name: "موافقة" }).click();
    await pendingRow
      .first()
      .getByRole("button", { name: "نعم، انشر" })
      .click();
    await expect(
      page.getByText("حارس ليلي — سيدي جابر")
    ).toBeHidden();

    await page.goto("/admin/users", { waitUntil: "networkidle" });
    await expect(page.getByText("01000000001").first()).toBeVisible();

    await page.goto("/admin/reports", { waitUntil: "networkidle" });
    await page.goto("/admin/audit", { waitUntil: "networkidle" });

    await logout(page);
    expect(errors).toEqual([]);
  });
});

test.describe("تقديم طلب على وظيفة (حساب تجريبي)", () => {
  test.beforeEach(async () => {
    await runSql(
      `DELETE FROM "JobApplication"
       WHERE "jobId" = (SELECT "id" FROM "Job" WHERE "slug" = 'demo-published-borg-arab-temp')
         AND "applicantId" = (SELECT "id" FROM "User" WHERE "phone" = '01000000001')`
    );
  });

  test.afterEach(async () => {
    await runSql(
      `DELETE FROM "JobApplication"
       WHERE "jobId" = (SELECT "id" FROM "Job" WHERE "slug" = 'demo-published-borg-arab-temp')
         AND "applicantId" = (SELECT "id" FROM "User" WHERE "phone" = '01000000001')`
    );
  });

  test("تقديم → ظهور الطلب في طلباتي → بدون أخطاء", async ({ page }) => {
    const errors = collectErrors(page);

    await login(page, SEEKER);

    await page.goto("/jobs/demo-published-borg-arab-temp", {
      waitUntil: "networkidle",
    });
    await page
      .getByLabel("رسالة التقديم (اختياري)")
      .fill("جاهز للعمل فوراً ولدي خبرة في تنظيم المواقف.");
    await page.getByRole("button", { name: "إرسال طلب التقديم" }).click();
    await expect(page.locator(".alert-success")).toContainText(
      /تم إرسال طلبك بنجاح|تم تقديم طلبك على هذه الوظيفة/
    );

    await page.goto("/seeker/applications", { waitUntil: "networkidle" });
    await expect(
      page.getByText("حارس مواقف — برج العرب (منشورة)").first()
    ).toBeVisible();

    await logout(page);
    expect(errors).toEqual([]);
  });
});

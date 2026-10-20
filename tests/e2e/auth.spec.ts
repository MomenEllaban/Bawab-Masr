import { test, expect, type Page } from "@playwright/test";
import { config as dotenvConfig } from "dotenv";
import pg from "pg";
import bcrypt from "bcryptjs";

dotenvConfig({ path: [".env.local", ".env"] });

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

function uniquePhone(): string {
  return `010${Date.now().toString().slice(-8)}`;
}

async function setKnownOtp(phone: string, code: string): Promise<void> {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  try {
    const userResult = await client.query(
      'SELECT id FROM "User" WHERE phone = $1',
      [phone]
    );
    expect(userResult.rows.length, "يجب أن يكون المستخدم موجوداً بعد التسجيل").toBe(1);
    const userId = userResult.rows[0].id as string;
    const codeHash = await bcrypt.hash(code, 4);
    await client.query('DELETE FROM "PhoneVerification" WHERE phone = $1', [phone]);
    await client.query(
      `INSERT INTO "PhoneVerification" (id, "userId", phone, "codeHash", "expiresAt", attempts, "createdAt")
       VALUES ($1, $2, $3, $4, now() + interval '10 minutes', 0, now())`,
      [`e2e-${Date.now()}`, userId, phone, codeHash]
    );
  } finally {
    await client.end();
  }
}

async function cleanupUser(phone: string): Promise<void> {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  try {
    await client.query('DELETE FROM "User" WHERE phone = $1', [phone]);
  } finally {
    await client.end();
  }
}

test.describe("الصفحات العامة", () => {
  const routes: { path: string; expect: "ok" | "notfound" }[] = [
    { path: "/", expect: "ok" },
    { path: "/jobs", expect: "ok" },
    { path: "/how-it-works", expect: "ok" },
    { path: "/about", expect: "ok" },
    { path: "/contact", expect: "ok" },
    { path: "/faq", expect: "ok" },
    { path: "/terms", expect: "ok" },
    { path: "/privacy", expect: "ok" },
    { path: "/safety", expect: "ok" },
    { path: "/for-job-seekers", expect: "ok" },
    { path: "/for-property-owners", expect: "ok" },
    { path: "/login", expect: "ok" },
    { path: "/register", expect: "ok" },
    { path: "/verify-phone", expect: "ok" },
    { path: "/صفحة-غير-موجودة", expect: "notfound" },
  ];

  for (const route of routes) {
    test(`المسار ${route.path} يفتح بدون أخطاء في الكونسول`, async ({ page }) => {
      const errors = collectErrors(page);
      const response = await page.goto(route.path, { waitUntil: "networkidle" });
      expect(response).not.toBeNull();
      if (route.expect === "ok") {
        expect(response!.status()).toBe(200);
      } else {
        expect(response!.status()).toBe(404);
        await expect(page.getByRole("heading", { level: 1 })).toContainText(
          "الصفحة غير موجودة"
        );
        // الـ 404 المتوقع للوثيقة نفسها يُسجَّل تلقائيًا في كونسول المتصفح
        expect(
          errors.filter((e) => !e.includes("Failed to load resource"))
        ).toEqual([]);
        return;
      }
      expect(errors).toEqual([]);
    });
  }
});

test.describe("الأمان", () => {
  test("المسارات المحمية تحوّل الزائر إلى صفحة تسجيل الدخول", async ({ page }) => {
    await page.goto("/seeker/dashboard");
    await expect(page).toHaveURL(/\/login\?callbackUrl=/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "تسجيل الدخول"
    );
  });

  test("الدخول ببيانات خاطئة يعرض رسالة عربية", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("رقم الهاتف").fill("01011111111");
    await page.getByLabel("كلمة المرور").fill("wrongpass123");
    await page.getByRole("button", { name: "تسجيل الدخول" }).click();
    await expect(page.locator(".alert-error")).toContainText(
      "رقم الهاتف أو كلمة المرور غير صحيحة"
    );
  });

  test("رمز OTP خاطئ يعرض رسالة عربية", async ({ page }) => {
    const phone = uniquePhone();
    await page.goto("/register");
    await page.getByLabel("الاسم الكامل").fill("مستخدم اختبار");
    await page.getByLabel("رقم الهاتف").fill(phone);
    await page.getByLabel("كلمة المرور", { exact: true }).fill("Testpass123");
    await page.getByLabel("تأكيد كلمة المرور").fill("Testpass123");
    await page.getByRole("button", { name: "إنشاء الحساب" }).click();
    await expect(page).toHaveURL(new RegExp(`/verify-phone\\?phone=${phone}`));

    await setKnownOtp(phone, "123456");
    await page.getByLabel("رمز التحقق").fill("000000");
    await page.getByRole("button", { name: "تأكيد الرقم" }).click();
    await expect(page.locator(".alert-error")).toContainText(
      "رمز التحقق غير صحيح"
    );

    await cleanupUser(phone);
  });
});

test.describe("مسار المصادقة الكامل", () => {
  test("تسجيل → تأكيد الهاتف → دخول → خروج بدون أخطاء", async ({ page }) => {
    const phone = uniquePhone();
    const password = "Testpass123";
    const errors = collectErrors(page);

    await page.goto("/register");
    await page.getByLabel("الاسم الكامل").fill("محمد الاختباري");
    await page.getByLabel("رقم الهاتف").fill(phone);
    await page.getByLabel("كلمة المرور", { exact: true }).fill(password);
    await page.getByLabel("تأكيد كلمة المرور").fill(password);
    await page.getByRole("button", { name: "إنشاء الحساب" }).click();

    await expect(page).toHaveURL(new RegExp(`/verify-phone\\?phone=${phone}`));
    await setKnownOtp(phone, "123456");

    await page.getByLabel("رمز التحقق").fill("123456");
    await page.getByRole("button", { name: "تأكيد الرقم" }).click();
    await expect(page).toHaveURL(/\/login\?verified=1/);
    await expect(page.locator(".alert-success")).toContainText(
      "تم تأكيد رقم هاتفك بنجاح"
    );

    await page.getByLabel("رقم الهاتف").fill(phone);
    await page.getByLabel("كلمة المرور").fill(password);
    await page.getByRole("button", { name: "تسجيل الدخول" }).click();

    await expect(page).toHaveURL("/");
    await expect(page.getByText("مرحباً، محمد الاختباري")).toBeVisible();

    await page.getByRole("button", { name: "تسجيل الخروج" }).click();
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("link", { name: "تسجيل الدخول" })).toBeVisible();

    expect(errors).toEqual([]);
    await cleanupUser(phone);
  });
});

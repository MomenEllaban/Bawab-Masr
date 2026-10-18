-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION', 'DEACTIVATED');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'PAUSED', 'CLOSED', 'REJECTED', 'EXPIRED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('SUBMITTED', 'VIEWED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'OFFERED', 'HIRED', 'REJECTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "WorkType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'TEMPORARY');

-- CreateEnum
CREATE TYPE "WorkSchedule" AS ENUM ('MORNING', 'EVENING', 'NIGHT', 'ROTATING', 'FLEXIBLE');

-- CreateEnum
CREATE TYPE "SalaryPeriod" AS ENUM ('MONTHLY', 'DAILY', 'WEEKLY');

-- CreateEnum
CREATE TYPE "EmployerType" AS ENUM ('INDIVIDUAL_OWNER', 'UNION_REP', 'MANAGEMENT_COMPANY');

-- CreateEnum
CREATE TYPE "OrgRole" AS ENUM ('OWNER', 'HR_MANAGER', 'VIEWER');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'MORE_INFO_NEEDED');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('NEW_APPLICATION', 'APPLICATION_STATUS_CHANGED', 'JOB_REVIEW_DECISION', 'ACCOUNT_REVIEW_DECISION', 'REPORT_UPDATE', 'SYSTEM');

-- CreateEnum
CREATE TYPE "SeekerAvailability" AS ENUM ('IMMEDIATE', 'TWO_WEEKS', 'ONE_MONTH', 'NOT_LOOKING');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT,
    "phoneVerifiedAt" TIMESTAMP(3),
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemRole" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "SystemRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemUserRole" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SystemUserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhoneVerification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PhoneVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeekerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "yearsExperience" INTEGER,
    "preferredWorkType" "WorkType",
    "availability" "SeekerAvailability" NOT NULL DEFAULT 'IMMEDIATE',
    "expectedSalaryMin" INTEGER,
    "expectedSalaryMax" INTEGER,
    "isProfilePublic" BOOLEAN NOT NULL DEFAULT true,
    "hasResume" BOOLEAN NOT NULL DEFAULT false,
    "resumeUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeekerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeekerSkill" (
    "id" TEXT NOT NULL,
    "seekerProfileId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,

    CONSTRAINT "SeekerSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeekerPreferredArea" (
    "id" TEXT NOT NULL,
    "seekerProfileId" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,

    CONSTRAINT "SeekerPreferredArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "employerType" "EmployerType" NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "registrationNo" TEXT,
    "description" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationMember" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "employerProfileId" TEXT,
    "role" "OrgRole" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrganizationMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Province" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Province_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Area" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "provinceId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "privateNotes" TEXT,
    "areaId" TEXT,
    "ownerId" TEXT,
    "orgId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "JobCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "responsibilities" TEXT,
    "requirements" TEXT,
    "workType" "WorkType" NOT NULL,
    "workSchedule" "WorkSchedule",
    "salaryMin" INTEGER,
    "salaryMax" INTEGER,
    "salaryPeriod" "SalaryPeriod" NOT NULL DEFAULT 'MONTHLY',
    "isSalaryPublic" BOOLEAN NOT NULL DEFAULT false,
    "experienceYears" INTEGER,
    "housingProvided" BOOLEAN NOT NULL DEFAULT false,
    "expectedStartDate" TIMESTAMP(3),
    "applicationDeadline" TIMESTAMP(3),
    "status" "JobStatus" NOT NULL DEFAULT 'DRAFT',
    "reviewStatus" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "publishedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "posterId" TEXT NOT NULL,
    "orgId" TEXT,
    "propertyId" TEXT,
    "provinceId" TEXT,
    "areaId" TEXT,
    "categoryId" TEXT,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobApplication" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "coverMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationStatusHistory" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "fromStatus" "ApplicationStatus",
    "toStatus" "ApplicationStatus" NOT NULL,
    "changedByUserId" TEXT NOT NULL,
    "note" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplicationStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedJob" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "internalUrl" TEXT,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "details" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'OPEN',
    "assignedToId" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModerationReview" (
    "id" TEXT NOT NULL,
    "reviewedById" TEXT NOT NULL,
    "decision" "ReviewStatus" NOT NULL,
    "reason" TEXT,
    "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jobId" TEXT,

    CONSTRAINT "ModerationReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SystemRole_name_key" ON "SystemRole"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SystemUserRole_userId_roleId_key" ON "SystemUserRole"("userId", "roleId");

-- CreateIndex
CREATE INDEX "PhoneVerification_userId_idx" ON "PhoneVerification"("userId");

-- CreateIndex
CREATE INDEX "PhoneVerification_expiresAt_idx" ON "PhoneVerification"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "SeekerProfile_userId_key" ON "SeekerProfile"("userId");

-- CreateIndex
CREATE INDEX "SeekerProfile_availability_idx" ON "SeekerProfile"("availability");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_key" ON "Skill"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SeekerSkill_seekerProfileId_skillId_key" ON "SeekerSkill"("seekerProfileId", "skillId");

-- CreateIndex
CREATE UNIQUE INDEX "SeekerPreferredArea_seekerProfileId_areaId_key" ON "SeekerPreferredArea"("seekerProfileId", "areaId");

-- CreateIndex
CREATE UNIQUE INDEX "EmployerProfile_userId_key" ON "EmployerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_registrationNo_key" ON "Organization"("registrationNo");

-- CreateIndex
CREATE INDEX "OrganizationMember_orgId_idx" ON "OrganizationMember"("orgId");

-- CreateIndex
CREATE INDEX "OrganizationMember_userId_idx" ON "OrganizationMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMember_orgId_userId_key" ON "OrganizationMember"("orgId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Province_name_key" ON "Province"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Province_slug_key" ON "Province"("slug");

-- CreateIndex
CREATE INDEX "Area_provinceId_idx" ON "Area"("provinceId");

-- CreateIndex
CREATE UNIQUE INDEX "Area_provinceId_slug_key" ON "Area"("provinceId", "slug");

-- CreateIndex
CREATE INDEX "Property_ownerId_idx" ON "Property"("ownerId");

-- CreateIndex
CREATE INDEX "Property_orgId_idx" ON "Property"("orgId");

-- CreateIndex
CREATE INDEX "Property_areaId_idx" ON "Property"("areaId");

-- CreateIndex
CREATE UNIQUE INDEX "JobCategory_name_key" ON "JobCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "JobCategory_slug_key" ON "JobCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Job_slug_key" ON "Job"("slug");

-- CreateIndex
CREATE INDEX "Job_status_reviewStatus_idx" ON "Job"("status", "reviewStatus");

-- CreateIndex
CREATE INDEX "Job_provinceId_idx" ON "Job"("provinceId");

-- CreateIndex
CREATE INDEX "Job_areaId_idx" ON "Job"("areaId");

-- CreateIndex
CREATE INDEX "Job_publishedAt_idx" ON "Job"("publishedAt");

-- CreateIndex
CREATE INDEX "Job_posterId_idx" ON "Job"("posterId");

-- CreateIndex
CREATE INDEX "Job_workType_idx" ON "Job"("workType");

-- CreateIndex
CREATE INDEX "Job_categoryId_idx" ON "Job"("categoryId");

-- CreateIndex
CREATE INDEX "JobApplication_jobId_idx" ON "JobApplication"("jobId");

-- CreateIndex
CREATE INDEX "JobApplication_applicantId_idx" ON "JobApplication"("applicantId");

-- CreateIndex
CREATE INDEX "JobApplication_status_idx" ON "JobApplication"("status");

-- CreateIndex
CREATE UNIQUE INDEX "JobApplication_jobId_applicantId_key" ON "JobApplication"("jobId", "applicantId");

-- CreateIndex
CREATE INDEX "ApplicationStatusHistory_applicationId_idx" ON "ApplicationStatusHistory"("applicationId");

-- CreateIndex
CREATE INDEX "ApplicationStatusHistory_changedAt_idx" ON "ApplicationStatusHistory"("changedAt");

-- CreateIndex
CREATE INDEX "SavedJob_userId_idx" ON "SavedJob"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedJob_userId_jobId_key" ON "SavedJob"("userId", "jobId");

-- CreateIndex
CREATE INDEX "Notification_userId_readAt_idx" ON "Notification"("userId", "readAt");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "Report_status_idx" ON "Report"("status");

-- CreateIndex
CREATE INDEX "Report_targetType_targetId_idx" ON "Report"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "Report_reporterId_idx" ON "Report"("reporterId");

-- CreateIndex
CREATE INDEX "ModerationReview_jobId_idx" ON "ModerationReview"("jobId");

-- CreateIndex
CREATE INDEX "ModerationReview_decision_idx" ON "ModerationReview"("decision");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_idx" ON "AuditLog"("actorId");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- AddForeignKey
ALTER TABLE "SystemUserRole" ADD CONSTRAINT "SystemUserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemUserRole" ADD CONSTRAINT "SystemUserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "SystemRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhoneVerification" ADD CONSTRAINT "PhoneVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeekerProfile" ADD CONSTRAINT "SeekerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeekerSkill" ADD CONSTRAINT "SeekerSkill_seekerProfileId_fkey" FOREIGN KEY ("seekerProfileId") REFERENCES "SeekerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeekerSkill" ADD CONSTRAINT "SeekerSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeekerPreferredArea" ADD CONSTRAINT "SeekerPreferredArea_seekerProfileId_fkey" FOREIGN KEY ("seekerProfileId") REFERENCES "SeekerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeekerPreferredArea" ADD CONSTRAINT "SeekerPreferredArea_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployerProfile" ADD CONSTRAINT "EmployerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_employerProfileId_fkey" FOREIGN KEY ("employerProfileId") REFERENCES "EmployerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Area" ADD CONSTRAINT "Area_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "Province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "EmployerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_posterId_fkey" FOREIGN KEY ("posterId") REFERENCES "EmployerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "Province"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "JobCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationStatusHistory" ADD CONSTRAINT "ApplicationStatusHistory_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "JobApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedJob" ADD CONSTRAINT "SavedJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedJob" ADD CONSTRAINT "SavedJob_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModerationReview" ADD CONSTRAINT "ModerationReview_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

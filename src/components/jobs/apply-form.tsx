"use client";

import { useActionState } from "react";
import { Send } from "lucide-react";
import { applyAction, type ActionState } from "@/server/actions/applications";

const initialState: ActionState = {};

export default function ApplyForm({ jobId }: { jobId: string }) {
  const [state, formAction, isPending] = useActionState(
    applyAction.bind(null, jobId),
    initialState
  );

  if (state.success) {
    return (
      <div className="alert alert-success">
        {state.success} — يمكنك متابعة حالة طلبك من صفحة طلباتي.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.error && <div className="alert alert-error">{state.error}</div>}

      <div>
        <label htmlFor="coverMessage" className="form-label">
          رسالة التقديم (اختياري)
        </label>
        <textarea
          id="coverMessage"
          name="coverMessage"
          maxLength={500}
          rows={4}
          className="form-input"
          placeholder="عرّف بنفسك باختصار ولماذا أنت مناسب لهذه الوظيفة..."
        />
        <p className="form-hint">حتى 500 حرف</p>
      </div>

      <button
        type="submit"
        className={`btn btn-primary btn-block${isPending ? " is-loading" : ""}`}
        disabled={isPending}
      >
        <Send size={16} aria-hidden />
        إرسال طلب التقديم
      </button>
    </form>
  );
}

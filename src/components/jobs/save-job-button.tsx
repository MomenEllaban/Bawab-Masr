"use client";

import { useActionState, useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toggleSaveAction, type ActionState } from "@/server/actions/applications";

const initialState: ActionState = {};

export default function SaveJobButton({
  jobId,
  initiallySaved,
}: {
  jobId: string;
  initiallySaved: boolean;
}) {
  const [state, formAction, isPending] = useActionState(
    toggleSaveAction.bind(null, jobId),
    initialState
  );
  const [saved, setSaved] = useState(initiallySaved);
  const [seenState, setSeenState] = useState<ActionState>(initialState);

  if (state !== seenState) {
    setSeenState(state);
    if (state.success) {
      setSaved(state.success.includes("تم حفظ الوظيفة"));
    }
  }

  return (
    <div>
      <form action={formAction}>
        <button
          type="submit"
          className={`btn btn-secondary btn-block${isPending ? " is-loading" : ""}`}
          disabled={isPending}
        >
          {saved ? (
            <>
              <BookmarkCheck size={16} aria-hidden />
              إزالة من المحفوظات
            </>
          ) : (
            <>
              <Bookmark size={16} aria-hidden />
              حفظ الوظيفة
            </>
          )}
        </button>
      </form>
      {state.error && (
        <p className="mt-2 text-center text-xs text-danger">{state.error}</p>
      )}
      {state.success && (
        <p className="mt-2 text-center text-xs text-success">{state.success}</p>
      )}
    </div>
  );
}

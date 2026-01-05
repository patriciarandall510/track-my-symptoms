"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryConstraint,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import type { NewPainLog, PainLog } from "../types";
import { useUser } from "./useUser";

type Options = {
  from?: Date;
  to?: Date;
  limit?: number;
};

export function usePainLogs(options: Options = {}) {
  const { user } = useUser();
  const [data, setData] = useState<PainLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) return;

    const ref = collection(db, "painLogs");
    const filters: QueryConstraint[] = [];

    if (options.from) {
      filters.push(where("timestamp", ">=", Timestamp.fromDate(options.from)));
    }
    if (options.to) {
      filters.push(where("timestamp", "<=", Timestamp.fromDate(options.to)));
    }

    const constraints: QueryConstraint[] = [
      ...filters,
      orderBy("timestamp", "desc"),
    ];
    if (options.limit) {
      constraints.push(limit(options.limit));
    }

    const q = query(ref, ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs: PainLog[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<PainLog, "id">),
        }));
        setData(docs);
        setLoading(false);
      },
      (err) => {
        console.error("Error loading pain logs", err);
        setError(err as Error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user, options.from, options.to, options.limit]);

  const addPainLog = async (log: NewPainLog) => {
    if (!user) throw new Error("No user");
    const ref = collection(db, "painLogs");
    const payload: Record<string, unknown> = {
      userId: user.uid,
      painScore: log.painScore,
      timestamp: Timestamp.fromDate(log.timestamp),
    };
    if (log.location) payload.location = log.location;
    if (log.quality) payload.quality = log.quality;
    if (log.notes) payload.notes = log.notes;
    if (log.tags && log.tags.length > 0) payload.tags = log.tags;

    await addDoc(ref, payload);
  };

  const updatePainLog = async (id: string, updates: Partial<NewPainLog>) => {
    const ref = doc(db, "painLogs", id);
    const payload: Record<string, unknown> = { ...updates };
    if (updates.timestamp) {
      payload.timestamp = Timestamp.fromDate(updates.timestamp);
    }
    await updateDoc(ref, payload);
  };

  const deletePainLog = async (id: string) => {
    const ref = doc(db, "painLogs", id);
    await deleteDoc(ref);
  };

  return { data, loading, error, addPainLog, updatePainLog, deletePainLog };
}



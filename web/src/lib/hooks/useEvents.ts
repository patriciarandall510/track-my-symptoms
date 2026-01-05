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
import type {
  ActivityEvent,
  ActivityType,
  NewActivityEvent,
} from "../types";
import { useUser } from "./useUser";

type Options = {
  from?: Date;
  to?: Date;
  type?: ActivityType | "all";
  limit?: number;
};

export function useEvents(options: Options = {}) {
  const { user } = useUser();
  const [data, setData] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) return;

    const ref = collection(db, "activityEvents");
    const filters: QueryConstraint[] = [];

    if (options.from) {
      filters.push(where("timestamp", ">=", Timestamp.fromDate(options.from)));
    }
    if (options.to) {
      filters.push(where("timestamp", "<=", Timestamp.fromDate(options.to)));
    }
    if (options.type && options.type !== "all") {
      filters.push(where("type", "==", options.type));
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
        const docs: ActivityEvent[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<ActivityEvent, "id">),
        }));
        setData(docs);
        setLoading(false);
      },
      (err) => {
        console.error("Error loading events", err);
        setError(err as Error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user, options.from, options.to, options.type, options.limit]);

  const addEvent = async (event: NewActivityEvent) => {
    if (!user) throw new Error("No user");
    const ref = collection(db, "activityEvents");
    const payload: Record<string, unknown> = {
      userId: user.uid,
      type: event.type,
      timestamp: Timestamp.fromDate(event.timestamp),
    };
    if (event.durationMinutes != null) {
      payload.durationMinutes = event.durationMinutes;
    }
    if (event.intensity != null) {
      payload.intensity = event.intensity;
    }
    if (event.notes) {
      payload.notes = event.notes;
    }

    await addDoc(ref, payload);
  };

  const updateEvent = async (id: string, updates: Partial<NewActivityEvent>) => {
    const ref = doc(db, "activityEvents", id);
    const payload: Record<string, unknown> = { ...updates };
    if (updates.timestamp) {
      payload.timestamp = Timestamp.fromDate(updates.timestamp);
    }
    await updateDoc(ref, payload);
  };

  const deleteEvent = async (id: string) => {
    const ref = doc(db, "activityEvents", id);
    await deleteDoc(ref);
  };

  return { data, loading, error, addEvent, updateEvent, deleteEvent };
}



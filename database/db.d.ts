import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface Folders {
  color: Generated<string | null>;
  created_at: Generated<Date | null>;
  id: Generated<number>;
  name: Generated<string | null>;
  uid: number;
  updated_at: Generated<Date | null>;
}

export interface Todos {
  completed_at: Generated<Date | null>;
  created_at: Generated<number | null>;
  description: Generated<string | null>;
  due_date: Generated<Date | null>;
  fid: number;
  id: Generated<number>;
  is_completed: Generated<number | null>;
  is_pinned: Generated<number | null>;
  title: Generated<string | null>;
  uid: number;
  updated_at: Generated<number | null>;
}

export interface Users {
  avtar: Generated<string | null> | null | undefined;
  created_at: Generated<Date | null>;
  email: string;
  first_name: Generated<string | null>;
  id: Generated<number>;
  last_name: Generated<string | null>;
  password: Generated<string | null | undefined>;
  theme: Generated<"" | "dark" | "light" | null>;
  updated_at: Generated<Date | null>;
}

export interface DB {
  folders: Folders;
  todos: Todos;
  users: Users;
}

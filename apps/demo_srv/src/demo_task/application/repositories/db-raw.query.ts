export type db_querie_type = typeof db_queries[keyof typeof db_queries];
export type db_param_querie_type = { query: typeof db_queries[keyof typeof db_queries], param: any };

export const db_queries = {
    all: "SELECT * FROM demo",
    first10: "SELECT * FROM demo LIMIT :limit",
} as const;



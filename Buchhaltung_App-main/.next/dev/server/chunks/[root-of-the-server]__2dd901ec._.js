module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/better-sqlite3 [external] (better-sqlite3, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("better-sqlite3", () => require("better-sqlite3"));

module.exports = mod;
}),
"[externals]/drizzle-orm/better-sqlite3 [external] (drizzle-orm/better-sqlite3, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("drizzle-orm/better-sqlite3");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/drizzle-orm/sqlite-core [external] (drizzle-orm/sqlite-core, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("drizzle-orm/sqlite-core");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/drizzle-orm [external] (drizzle-orm, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("drizzle-orm");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/db/schema.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "customers",
    ()=>customers,
    "expenses",
    ()=>expenses,
    "invoices",
    ()=>invoices,
    "suppliers",
    ()=>suppliers
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/drizzle-orm/sqlite-core [external] (drizzle-orm/sqlite-core, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm__$5b$external$5d$__$28$drizzle$2d$orm$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/drizzle-orm [external] (drizzle-orm, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm__$5b$external$5d$__$28$drizzle$2d$orm$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm__$5b$external$5d$__$28$drizzle$2d$orm$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const invoices = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["sqliteTable"])('invoices', {
    id: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["integer"])('id').primaryKey({
        autoIncrement: true
    }),
    customer: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["text"])('customer').notNull(),
    title: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["text"])('title').notNull().default(''),
    amount: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["real"])('amount').notNull(),
    taxRate: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["real"])('tax_rate').notNull().default(19),
    taxAmount: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["real"])('tax_amount').notNull().default(0),
    totalAmount: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["real"])('total_amount').notNull(),
    dueDate: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["text"])('due_date'),
    description: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["text"])('description'),
    createdAt: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["text"])('created_at').default(__TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm__$5b$external$5d$__$28$drizzle$2d$orm$2c$__esm_import$29$__["sql"]`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["text"])('updated_at').default(__TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm__$5b$external$5d$__$28$drizzle$2d$orm$2c$__esm_import$29$__["sql"]`CURRENT_TIMESTAMP`).notNull(),
    status: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["text"])('status').default('open').notNull() // 'open', 'paid', 'overdue'
});
const expenses = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["sqliteTable"])('expenses', {
    id: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["integer"])('id').primaryKey({
        autoIncrement: true
    }),
    category: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["text"])('category').notNull(),
    amount: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["real"])('amount').notNull(),
    date: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["text"])('date'),
    description: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["text"])('description'),
    createdAt: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["text"])('created_at').default(__TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm__$5b$external$5d$__$28$drizzle$2d$orm$2c$__esm_import$29$__["sql"]`CURRENT_TIMESTAMP`).notNull()
});
const customers = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["sqliteTable"])('customers', {
    id: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["integer"])('id').primaryKey({
        autoIncrement: true
    }),
    name: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["text"])('name').notNull().unique(),
    email: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["text"])('email'),
    phone: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["text"])('phone'),
    address: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["text"])('address'),
    city: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["text"])('city'),
    postalCode: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["text"])('postal_code'),
    country: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["text"])('country'),
    taxId: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["text"])('tax_id'),
    notes: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["text"])('notes'),
    createdAt: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["text"])('created_at').default(__TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm__$5b$external$5d$__$28$drizzle$2d$orm$2c$__esm_import$29$__["sql"]`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["text"])('updated_at').default(__TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm__$5b$external$5d$__$28$drizzle$2d$orm$2c$__esm_import$29$__["sql"]`CURRENT_TIMESTAMP`).notNull()
});
const suppliers = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["sqliteTable"])('suppliers', {
    id: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["integer"])('id').primaryKey({
        autoIncrement: true
    }),
    name: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["text"])('name').notNull().unique(),
    email: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["text"])('email'),
    phone: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["text"])('phone'),
    address: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["text"])('address'),
    city: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["text"])('city'),
    postalCode: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["text"])('postal_code'),
    country: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["text"])('country'),
    taxId: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["text"])('tax_id'),
    notes: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["text"])('notes'),
    createdAt: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["text"])('created_at').default(__TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm__$5b$external$5d$__$28$drizzle$2d$orm$2c$__esm_import$29$__["sql"]`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$sqlite$2d$core__$5b$external$5d$__$28$drizzle$2d$orm$2f$sqlite$2d$core$2c$__esm_import$29$__["text"])('updated_at').default(__TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm__$5b$external$5d$__$28$drizzle$2d$orm$2c$__esm_import$29$__["sql"]`CURRENT_TIMESTAMP`).notNull()
});
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/db/index.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "db",
    ()=>db
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$better$2d$sqlite3__$5b$external$5d$__$28$better$2d$sqlite3$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/better-sqlite3 [external] (better-sqlite3, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$better$2d$sqlite3__$5b$external$5d$__$28$drizzle$2d$orm$2f$better$2d$sqlite3$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/drizzle-orm/better-sqlite3 [external] (drizzle-orm/better-sqlite3, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/db/schema.ts [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$better$2d$sqlite3__$5b$external$5d$__$28$drizzle$2d$orm$2f$better$2d$sqlite3$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$api$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$better$2d$sqlite3__$5b$external$5d$__$28$drizzle$2d$orm$2f$better$2d$sqlite3$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$api$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
const sqlite = new __TURBOPACK__imported__module__$5b$externals$5d2f$better$2d$sqlite3__$5b$external$5d$__$28$better$2d$sqlite3$2c$__cjs$29$__["default"]('buchhaltung.db');
const db = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm$2f$better$2d$sqlite3__$5b$external$5d$__$28$drizzle$2d$orm$2f$better$2d$sqlite3$2c$__esm_import$29$__["drizzle"])(sqlite, {
    schema: __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$api$5d$__$28$ecmascript$29$__
});
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/pages/api/expenses-distribution.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/db/index.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/db/schema.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm__$5b$external$5d$__$28$drizzle$2d$orm$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/drizzle-orm [external] (drizzle-orm, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$api$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$api$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm__$5b$external$5d$__$28$drizzle$2d$orm$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$api$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$api$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm__$5b$external$5d$__$28$drizzle$2d$orm$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
async function handler(req, res) {
    try {
        // get grouped sums per category from expenses, filtering out zero/null amounts
        const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$index$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["db"].select({
            category: __TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["expenses"].category,
            total: __TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm__$5b$external$5d$__$28$drizzle$2d$orm$2c$__esm_import$29$__["sql"]`COALESCE(SUM(${__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["expenses"].amount}),0)`
        }).from(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["expenses"]).groupBy(__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["expenses"].category).having(__TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm__$5b$external$5d$__$28$drizzle$2d$orm$2c$__esm_import$29$__["sql"]`SUM(${__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["expenses"].amount}) > 0`).orderBy(__TURBOPACK__imported__module__$5b$externals$5d2f$drizzle$2d$orm__$5b$external$5d$__$28$drizzle$2d$orm$2c$__esm_import$29$__["sql"]`SUM(${__TURBOPACK__imported__module__$5b$project$5d2f$db$2f$schema$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["expenses"].amount}) DESC`).all();
        const categories = rows.map((r)=>r.category || 'Sonstiges');
        const totals = rows.map((r)=>Number(r.total ?? 0));
        return res.status(200).json({
            categories,
            totals
        });
    } catch (error) {
        console.error('Error fetching expenses distribution:', error);
        return res.status(500).json({
            error: 'Fehler beim Abrufen der Ausgabenverteilung',
            details: String(error)
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2dd901ec._.js.map
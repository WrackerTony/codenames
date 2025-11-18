/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as cleanup from "../cleanup.js";
import type * as fixRooms from "../fixRooms.js";
import type * as friends from "../friends.js";
import type * as game from "../game.js";
import type * as migrations from "../migrations.js";
import type * as rooms from "../rooms.js";
import type * as wordBank from "../wordBank.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  cleanup: typeof cleanup;
  fixRooms: typeof fixRooms;
  friends: typeof friends;
  game: typeof game;
  migrations: typeof migrations;
  rooms: typeof rooms;
  wordBank: typeof wordBank;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};

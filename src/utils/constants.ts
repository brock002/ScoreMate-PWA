import gold_cup from "@/assets/icons/trophy1.png"
import silver_cup from "@/assets/icons/trophy2.png"
import bronze_cup from "@/assets/icons/trophy3.png"
import { FIREBASE_APP } from "./firebase.config"
import { getAnalytics } from "firebase/analytics"
import { collection, getFirestore } from "firebase/firestore"

export const TROPHY_ICON_SRCS = [gold_cup, silver_cup, bronze_cup]

// FireBase essentials
export const F_ANALYTICS = getAnalytics(FIREBASE_APP)
export const F_DB = getFirestore(FIREBASE_APP)

// FireBase DB tables
export const USER_DB = collection(F_DB, "user")
export const GAME_DB = collection(F_DB, "game")
export const PLAYERS_DB = collection(F_DB, "players")

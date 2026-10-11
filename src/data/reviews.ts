// Скрийншотите с отзиви. Сайтът показва олекотените копия от public/social-webp (800px, .webp).
//
// НОВ ОТЗИВ? Две стъпки:
//   1. Пусни снимката в папката new-reviews (в главната папка на проекта) - с каквото и да е име.
//   2. Пусни в терминала:  node optimize-social.js
// Скриптът я прави на .webp, дава ѝ следващия номер, мести я в public/social-webp
// и изтрива тежкия оригинал. Размерите и броят се записват сами в review-sizes.ts
// и този файл ги чете оттам - тук няма нужда да пипаш нищо.

import { SIZES } from './review-sizes';

export type ReviewImage = { src: string; width?: number; height?: number };

export const reviewImage = (n: number): ReviewImage => ({
  src: `/social-webp/${n}.webp`,
  width: SIZES[n]?.[0],
  height: SIZES[n]?.[1],
});

// Всички налични номера, подредени по ред
const NUMBERS = Object.keys(SIZES).map(Number).sort((a, b) => a - b);

// Номера, които НЕ се показват в плъзгача на началната страница.
// Ако нов отзив е твърде висок за плъзгача, добави номера му тук.
const NOT_IN_SLIDER = [10, 11, 12, 13, 14, 28, 29, 30, 31];

// Плъзгачът на началната страница: всички без изброените горе
export const SLIDER_REVIEWS: ReviewImage[] = NUMBERS.filter(n => !NOT_IN_SLIDER.includes(n)).map(reviewImage);

// Всички отзиви (секцията под чекаута)
export const ALL_REVIEWS: ReviewImage[] = NUMBERS.map(reviewImage);
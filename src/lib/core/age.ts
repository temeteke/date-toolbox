import {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  addYears,
  addMonths,
  isBefore,
  startOfDay,
} from 'date-fns';
import type { AgeInput, AgeResult, MilestoneAge } from '../../types/core/age';

/**
 * 年齢を計算
 * @param input 入力パラメータ
 * @returns 年齢情報
 */
export function calculateAge(input: AgeInput): AgeResult {
  const { birthDate, referenceDate = new Date() } = input;

  // 年齢（年）を計算
  const years = differenceInYears(referenceDate, birthDate);

  // 年を引いた後の残り月数
  const dateAfterYears = addYears(birthDate, years);
  const months = differenceInMonths(referenceDate, dateAfterYears);

  // 年と月を引いた後の残り日数
  const dateAfterMonths = addMonths(dateAfterYears, months);
  const days = differenceInDays(referenceDate, dateAfterMonths);

  // 総日数
  const totalDays = Math.abs(differenceInDays(referenceDate, birthDate));

  // 総月数（概算）
  const totalMonths = Math.abs(differenceInMonths(referenceDate, birthDate));

  // 次の誕生日
  const nextBirthday = getNextBirthday(birthDate, referenceDate);

  // 次の誕生日までの日数
  const daysUntilNextBirthday = differenceInDays(nextBirthday, startOfDay(referenceDate));

  return {
    years,
    months,
    days,
    totalDays,
    totalMonths,
    nextBirthday,
    daysUntilNextBirthday,
  };
}

/**
 * 節目の年齢になる日を計算
 * @param birthDate 生年月日
 * @param milestones 節目の年齢リスト（例: [20, 30, 40, 60, 65, 100]）
 * @returns 節目の年齢情報リスト
 */
export function calculateMilestoneAges(
  birthDate: Date,
  milestones: number[]
): MilestoneAge[] {
  const today = startOfDay(new Date());

  return milestones.map(age => {
    const date = addYears(birthDate, age);
    const isPast = isBefore(date, today);

    return {
      age,
      date,
      isPast,
    };
  });
}

/**
 * 次の誕生日を計算
 * @param birthDate 生年月日
 * @param referenceDate 基準日（デフォルト: 今日）
 * @returns 次の誕生日
 */
export function getNextBirthday(
  birthDate: Date,
  referenceDate: Date = new Date()
): Date {
  const currentYear = referenceDate.getFullYear();

  // 今年の誕生日
  const thisYearBirthday = new Date(
    currentYear,
    birthDate.getMonth(),
    birthDate.getDate()
  );

  // 今年の誕生日が既に過ぎている場合は来年の誕生日
  if (isBefore(thisYearBirthday, startOfDay(referenceDate))) {
    return new Date(
      currentYear + 1,
      birthDate.getMonth(),
      birthDate.getDate()
    );
  }

  return thisYearBirthday;
}
